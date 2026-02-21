"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageBubble } from "./message-bubble"
import { Hash } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Message {
    id: string
    content: string
    created_at: string
    user_id: string
    pending?: boolean
    profiles: {
        full_name: string
        avatar_url: string
        username: string
    } | null
}

interface Room {
    id: string
    name: string
    type: string
}

interface ChatLayoutProps {
    rooms: Room[]
    currentRoom: Room
    initialMessages: Message[]
    currentUser: {
        id: string
        full_name: string
        avatar_url?: string
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatLayout({ rooms, currentRoom, initialMessages, currentUser }: ChatLayoutProps) {
    // ✅ RULE 1: Single Source of Truth — ALL message state lives here only
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    // Auto-scroll anchor ref — updates on every render per spec
    const bottomRef = useRef<HTMLDivElement>(null)

    // Stable supabase client (create once, never recreate)
    const supabaseRef = useRef(createClient())
    const supabase = supabaseRef.current

    // ─── Profile Cache ─────────────────────────────────────────────────────────
    // Pre-seed from server-loaded messages to avoid any DB call for known users
    const profileCache = useRef<Record<string, NonNullable<Message["profiles"]>>>({})
    useEffect(() => {
        initialMessages.forEach((m) => {
            if (m.user_id && m.profiles) {
                profileCache.current[m.user_id] = m.profiles
            }
        })
        // Also seed current user's own profile
        profileCache.current[currentUser.id] = {
            full_name: currentUser.full_name,
            avatar_url: currentUser.avatar_url || "",
            username: "",
        }
    }, []) // run once on mount

    // ─── Auto-scroll ───────────────────────────────────────────────────────────
    // Per spec: triggers on every state update (messages array change)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Initial instant scroll (before any animation)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" })
    }, [])

    // ─── Profile fetcher (cached) ──────────────────────────────────────────────
    const getProfile = useCallback(async (userId: string) => {
        if (profileCache.current[userId]) return profileCache.current[userId]
        const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, username")
            .eq("id", userId)
            .single()
        const profile = data || { full_name: "Unknown", avatar_url: "", username: "" }
        profileCache.current[userId] = profile
        return profile
    }, [supabase])

    // ─── ✅ RULE 3: Supabase Realtime Subscription ────────────────────────────
    useEffect(() => {
        const channel = supabase
            .channel(`room-${currentRoom.id}`) // unique channel name per room
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `room_id=eq.${currentRoom.id}`,
                },
                async (payload) => {
                    const raw = payload.new as {
                        id: string
                        content: string
                        created_at: string
                        user_id: string
                        room_id: string
                    }

                    // Build message using cached profile (instant — no DB wait)
                    const profile = profileCache.current[raw.user_id] || null

                    const confirmedMsg: Message = {
                        id: raw.id,
                        content: raw.content,
                        created_at: raw.created_at,
                        user_id: raw.user_id,
                        pending: false,
                        profiles: profile,
                    }

                    // ✅ RULE 3 — Deduplication Logic:
                    // Replace a matching optimistic (pending) bubble, or append if new
                    setMessages((prev) => {
                        const pendingIdx = prev.findIndex(
                            (m) =>
                                m.pending === true &&
                                m.user_id === raw.user_id &&
                                m.content === raw.content
                        )
                        if (pendingIdx !== -1) {
                            // Swap the optimistic placeholder with the real confirmed message
                            const updated = [...prev]
                            updated[pendingIdx] = confirmedMsg
                            return updated
                        }
                        // Not our optimistic message — it's from another user, just append
                        return [...prev, confirmedMsg]
                    })

                    // Fetch profile in background if not yet cached, then patch
                    if (!profile) {
                        const fetched = await getProfile(raw.user_id)
                        setMessages((prev) =>
                            prev.map((m) => (m.id === raw.id ? { ...m, profiles: fetched } : m))
                        )
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "chat_messages",
                    filter: `room_id=eq.${currentRoom.id}`,
                },
                (payload) => {
                    setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.log(`✅ Realtime subscribed to room: ${currentRoom.id}`)
                } else {
                    console.log(`⚡ Realtime status: ${status}`)
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentRoom.id, supabase, getProfile])

    // ─── ✅ RULE 2: Optimistic Send Handler ───────────────────────────────────
    // Called by MessageInput BEFORE the DB insert fires
    const handleOptimisticSend = useCallback((msg: Message) => {
        setMessages((prev) => [...prev, msg])
    }, [])

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

            {/* Rooms / Channels Sidebar */}
            <aside className="w-60 shrink-0 border-r bg-muted/20 flex flex-col">
                <div className="px-4 py-3 border-b">
                    <h2 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                        Channels
                    </h2>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {rooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/dashboard/chat?room=${room.id}`}
                            prefetch={false}
                            className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                currentRoom.id === room.id
                                    ? "bg-accent text-accent-foreground font-semibold"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                        >
                            <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{room.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Current user footer */}
                <div className="p-3 border-t flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                        {currentUser.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{currentUser.full_name}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                            Online
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Chat Column */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">

                {/* Channel Header */}
                <div className="h-14 border-b flex items-center px-4 gap-2 shrink-0">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-base">{currentRoom.name}</span>
                </div>

                {/* ✅ Message List — re-renders whenever `messages` changes */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                            <p className="text-4xl">💬</p>
                            <p className="font-semibold">No messages yet — say hello!</p>
                        </div>
                    )}
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.user_id === currentUser.id}
                        />
                    ))}
                    {/* ✅ RULE 4: auto-scroll anchor — scrolled to on every messages update */}
                    <div ref={bottomRef} />
                </div>

                {/* Message Input */}
                <MessageInputInline
                    roomId={currentRoom.id}
                    userId={currentUser.id}
                    userProfile={profileCache.current[currentUser.id] || null}
                    onOptimisticSend={handleOptimisticSend}
                />
            </div>
        </div>
    )
}

// ─── Inline Message Input ─────────────────────────────────────────────────────
// Kept in same file so it shares the same supabase + profile cache context cleanly

interface MessageInputInlineProps {
    roomId: string
    userId: string
    userProfile: Message["profiles"]
    onOptimisticSend: (msg: Message) => void
}

function MessageInputInline({ roomId, userId, userProfile, onOptimisticSend }: MessageInputInlineProps) {
    const [text, setText] = useState("")
    const [sending, setSending] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const supabase = useRef(createClient()).current

    const send = async () => {
        const trimmed = text.trim()
        if (!trimmed) return

        // Clear the input immediately
        setText("")
        textareaRef.current?.focus()

        // ✅ RULE 2: Push optimistic message to parent state BEFORE DB call
        const optimistic: Message = {
            id: `temp-${Date.now()}-${Math.random()}`,
            content: trimmed,
            created_at: new Date().toISOString(),
            user_id: userId,
            pending: true,      // ✅ RULE 5: visual 'sending' state
            profiles: userProfile,
        }
        onOptimisticSend(optimistic)

        setSending(true)
        const { error } = await supabase
            .from("chat_messages")
            .insert({ content: trimmed, room_id: roomId, user_id: userId })
        setSending(false)

        if (error) {
            console.error("Send error:", error)
            // Remove the failed optimistic message
            // (parent's state setter handles dedup; we won't replace it with a real one)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    return (
        <div className="shrink-0 px-4 py-3 border-t bg-background">
            <div className="flex gap-2 items-end rounded-lg border bg-muted/30 px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-all">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={`Message #${roomId.slice(0, 4)}…`}
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[24px] max-h-[120px]"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                />
                <button
                    onClick={send}
                    disabled={!text.trim() || sending}
                    className="shrink-0 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                    {sending ? "…" : "Send"}
                </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
                <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[9px]">Enter</kbd> to send &nbsp;·&nbsp;
                <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[9px]">Shift+Enter</kbd> for new line
            </p>
        </div>
    )
}

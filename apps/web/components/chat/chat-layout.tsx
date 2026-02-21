"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { MessageBubble } from "./message-bubble"
import { Hash, Wifi, WifiOff, Loader2 } from "lucide-react"
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

interface Room { id: string; name: string; type: string }

interface ChatLayoutProps {
    rooms: Room[]
    currentRoom: Room
    initialMessages: Message[]
    currentUser: { id: string; full_name: string; avatar_url?: string }
}

type Status = "connecting" | "connected" | "error"

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatLayout({ rooms, currentRoom, initialMessages, currentUser }: ChatLayoutProps) {

    // Single source of truth
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [status, setStatus] = useState<Status>("connecting")
    const bottomRef = useRef<HTMLDivElement>(null)

    // Stable refs — never change between renders
    const supabase = useRef(createClient()).current
    const channelRef = useRef<RealtimeChannel | null>(null)

    // ─── Profile Cache ────────────────────────────────────────────────────────
    const profileCache = useRef<Record<string, NonNullable<Message["profiles"]>>>({})
    useEffect(() => {
        initialMessages.forEach((m) => {
            if (m.user_id && m.profiles) profileCache.current[m.user_id] = m.profiles
        })
        // Current user's own profile
        profileCache.current[currentUser.id] = {
            full_name: currentUser.full_name,
            avatar_url: currentUser.avatar_url || "",
            username: "",
        }
    }, []) // eslint-disable-line

    // ─── Auto-scroll on every messages change ─────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" })
    }, [])

    // ─── Deduplicated append ──────────────────────────────────────────────────
    const appendMessage = useCallback((msg: Message) => {
        setMessages((prev) => {
            // Skip if already in list (by real ID)
            if (prev.some((m) => m.id === msg.id)) return prev
            return [...prev, msg]
        })
    }, [])

    // ─── Profile fetcher ──────────────────────────────────────────────────────
    const getProfile = useCallback(async (userId: string) => {
        if (profileCache.current[userId]) return profileCache.current[userId]
        const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, username")
            .eq("id", userId)
            .single()
        const p = data || { full_name: "Unknown", avatar_url: "", username: "" }
        profileCache.current[userId] = p
        return p
    }, [supabase])

    // ─── Realtime Channel ─────────────────────────────────────────────────────
    // Uses BOTH Broadcast (instant) + postgres_changes (reliable backup)
    useEffect(() => {
        setStatus("connecting")

        const channel = supabase.channel(`room:${currentRoom.id}`, {
            config: { broadcast: { self: false } },
        })

        // ── 1. Broadcast listener (instant — sender pushes directly) ──────────
        channel.on("broadcast", { event: "new_message" }, ({ payload }) => {
            const msg = payload as Message
            // Build full message using cached profile
            const profile = profileCache.current[msg.user_id] || null
            appendMessage({ ...msg, profiles: profile })

            // Patch profile in background if not cached yet
            if (!profile) {
                getProfile(msg.user_id).then((p) =>
                    setMessages((prev) =>
                        prev.map((m) => m.id === msg.id ? { ...m, profiles: p } : m)
                    )
                )
            }
        })

        // ── 2. postgres_changes (backup for missed broadcasts / page reload) ──
        channel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "chat_messages",
                filter: `room_id=eq.${currentRoom.id}`,
            },
            async (payload) => {
                const raw = payload.new as { id: string; content: string; created_at: string; user_id: string }
                const profile = profileCache.current[raw.user_id] || null
                appendMessage({
                    id: raw.id,
                    content: raw.content,
                    created_at: raw.created_at,
                    user_id: raw.user_id,
                    pending: false,
                    profiles: profile,
                })
                if (!profile) {
                    const p = await getProfile(raw.user_id)
                    setMessages((prev) =>
                        prev.map((m) => m.id === raw.id ? { ...m, profiles: p } : m)
                    )
                }
            }
        )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "chat_messages", filter: `room_id=eq.${currentRoom.id}` },
                (payload) => setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
            )
            .subscribe((s) => {
                if (s === "SUBSCRIBED") {
                    setStatus("connected")
                    channelRef.current = channel
                    console.log("✅ Realtime + Broadcast subscribed:", currentRoom.id)
                } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(s)) {
                    setStatus("error")
                    console.error("❌ Realtime:", s)
                }
            })

        return () => {
            channelRef.current = null
            supabase.removeChannel(channel)
        }
    }, [currentRoom.id, supabase, appendMessage, getProfile])

    // ─── Optimistic send ──────────────────────────────────────────────────────
    const handleOptimisticSend = useCallback((msg: Message) => {
        setMessages((prev) => [...prev, msg])
    }, [])

    // ─── Confirm own message (replace temp ID with real DB row) ──────────────
    const handleConfirm = useCallback((tempId: string, confirmedMsg: Message) => {
        setMessages((prev) =>
            prev.map((m) => m.id === tempId ? confirmedMsg : m)
        )
    }, [])

    // ─── Remove failed optimistic message ─────────────────────────────────────
    const handleFail = useCallback((tempId: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
    }, [])

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

            {/* Rooms sidebar */}
            <aside className="w-60 shrink-0 border-r bg-muted/20 flex flex-col">
                <div className="px-4 py-3 border-b">
                    <h2 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Channels</h2>
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
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                        >
                            <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{room.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-3 border-t flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                        {currentUser.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{currentUser.full_name}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" /> Online
                        </p>
                    </div>
                </div>
            </aside>

            {/* Chat panel */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">

                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{currentRoom.name}</span>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium",
                        status === "connected" && "bg-green-500/10 text-green-600",
                        status === "connecting" && "bg-yellow-500/10 text-yellow-600",
                        status === "error" && "bg-red-500/10 text-red-500",
                    )}>
                        {status === "connected" && <><Wifi className="h-3 w-3" /> Live</>}
                        {status === "connecting" && <><Loader2 className="h-3 w-3 animate-spin" /> Connecting…</>}
                        {status === "error" && <><WifiOff className="h-3 w-3" /> Disconnected</>}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-center text-muted-foreground">
                            <p className="text-4xl">💬</p>
                            <p className="text-sm">No messages yet — say hello!</p>
                        </div>
                    )}
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={message.user_id === currentUser.id}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <ChatInput
                    roomId={currentRoom.id}
                    roomName={currentRoom.name}
                    userId={currentUser.id}
                    userProfile={profileCache.current[currentUser.id] ?? null}
                    supabase={supabase}
                    channelRef={channelRef}
                    onOptimisticSend={handleOptimisticSend}
                    onConfirm={handleConfirm}
                    onFail={handleFail}
                />
            </div>
        </div>
    )
}

// ─── Chat Input ───────────────────────────────────────────────────────────────

interface ChatInputProps {
    roomId: string
    roomName: string
    userId: string
    userProfile: Message["profiles"]
    supabase: ReturnType<typeof createClient>
    channelRef: React.MutableRefObject<RealtimeChannel | null>
    onOptimisticSend: (msg: Message) => void
    onConfirm: (tempId: string, confirmed: Message) => void
    onFail: (tempId: string) => void
}

function ChatInput({ roomId, roomName, userId, userProfile, supabase, channelRef, onOptimisticSend, onConfirm, onFail }: ChatInputProps) {
    const [text, setText] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const send = async () => {
        const trimmed = text.trim()
        if (!trimmed) return

        setText("")
        textareaRef.current?.focus()

        // Step 1: Optimistic bubble — appears instantly
        const tempId = `temp-${Date.now()}-${Math.random()}`
        onOptimisticSend({
            id: tempId,
            content: trimmed,
            created_at: new Date().toISOString(),
            user_id: userId,
            pending: true,
            profiles: userProfile,
        })

        // Step 2: Persist to DB and get confirmed row
        const { data, error } = await supabase
            .from("chat_messages")
            .insert({ content: trimmed, room_id: roomId, user_id: userId })
            .select("id, content, created_at, user_id")
            .single()

        if (error || !data) {
            console.error("Send failed:", error?.message)
            onFail(tempId)
            return
        }

        // Step 3: Confirm own message (swap temp → real)
        const confirmedMsg: Message = {
            id: data.id,
            content: data.content,
            created_at: data.created_at,
            user_id: data.user_id,
            pending: false,
            profiles: userProfile,
        }
        onConfirm(tempId, confirmedMsg)

        // Step 4: Broadcast to ALL other subscribers — guaranteed instant delivery
        // This is the "push" model — sender notifies others explicitly
        if (channelRef.current) {
            channelRef.current.send({
                type: "broadcast",
                event: "new_message",
                payload: confirmedMsg,
            })
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    return (
        <div className="shrink-0 px-4 py-3 border-t">
            <div className="flex gap-2 items-end rounded-xl border bg-muted/30 px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-all">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={`Message #${roomName}…`}
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[24px] max-h-[120px]"
                />
                <button
                    onClick={send}
                    disabled={!text.trim()}
                    className="shrink-0 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                    Send
                </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
                <kbd className="bg-muted px-1 py-0.5 rounded font-mono text-[9px]">Enter</kbd> send &nbsp;·&nbsp;
                <kbd className="bg-muted px-1 py-0.5 rounded font-mono text-[9px]">Shift+Enter</kbd> new line
            </p>
        </div>
    )
}

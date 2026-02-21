"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageBubble } from "./message-bubble"

interface Message {
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

interface MessageAreaProps {
    roomId: string
    initialMessages: Message[]
    currentUserId: string
}

export function MessageArea({ roomId, initialMessages, currentUserId }: MessageAreaProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // ─── Profile Cache ─────────────────────────────────────────────
    // Pre-populate from initialMessages so we never re-fetch known profiles
    const profileCache = useRef<Record<string, any>>({})
    useEffect(() => {
        initialMessages.forEach((m) => {
            if (m.user_id && m.profiles) {
                profileCache.current[m.user_id] = m.profiles
            }
        })
    }, []) // only on mount

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        bottomRef.current?.scrollIntoView({ behavior })
    }

    // Instant scroll on first render
    useEffect(() => scrollToBottom("instant"), [])

    // Fetch & cache a profile ONCE per unknown user
    const getProfile = useCallback(async (userId: string) => {
        if (profileCache.current[userId]) return profileCache.current[userId]

        const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, username")
            .eq("id", userId)
            .single()

        if (data) profileCache.current[userId] = data
        return data || { full_name: "Unknown", avatar_url: "", username: "" }
    }, [supabase])

    useEffect(() => {
        const channel = supabase
            .channel(`chat:${roomId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `room_id=eq.${roomId}`,
                },
                async (payload) => {
                    const raw = payload.new as any

                    // ⚡ INSTANT: Show immediately using cached profile (no wait)
                    const cachedProfile = profileCache.current[raw.user_id] || null

                    const newMsg: Message = {
                        id: raw.id,
                        content: raw.content,
                        created_at: raw.created_at,
                        user_id: raw.user_id,
                        profiles: cachedProfile,
                    }

                    setMessages((prev) => {
                        // Replace optimistic temp message if it matches
                        const tempIdx = prev.findIndex(
                            (m) => m.id.startsWith("temp-") &&
                                m.user_id === raw.user_id &&
                                m.content === raw.content
                        )
                        if (tempIdx !== -1) {
                            const updated = [...prev]
                            updated[tempIdx] = newMsg
                            return updated
                        }
                        return [...prev, newMsg]
                    })

                    scrollToBottom()

                    // If profile wasn't cached, fetch in background and patch
                    if (!cachedProfile) {
                        const profile = await getProfile(raw.user_id)
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === raw.id ? { ...m, profiles: profile } : m
                            )
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
                    filter: `room_id=eq.${roomId}`,
                },
                (payload) => {
                    setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, supabase, getProfile])

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="text-4xl">💬</div>
                <h3 className="font-semibold text-lg">No messages yet</h3>
                <p className="text-muted-foreground text-sm">Be the first to say something!</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.user_id === currentUserId}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    )
}

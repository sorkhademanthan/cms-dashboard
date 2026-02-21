"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageBubble } from "./message-bubble"
import { Loader2 } from "lucide-react"

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
    }
}

interface MessageAreaProps {
    roomId: string
    initialMessages: Message[]
    currentUserId: string
}

export function MessageArea({ roomId, initialMessages, currentUserId }: MessageAreaProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        bottomRef.current?.scrollIntoView({ behavior })
    }

    useEffect(() => {
        // Scroll to bottom on initial load (instant, no animation)
        scrollToBottom("instant")
    }, [])

    useEffect(() => {
        // Realtime subscription — INSERT new message
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
                    // Fetch the full message with profile data
                    const { data } = await supabase
                        .from("chat_messages")
                        .select(`*, profiles(full_name, avatar_url, username)`)
                        .eq("id", payload.new.id)
                        .single()

                    if (data) {
                        setMessages((prev) => {
                            // Replace optimistic message if it exists, otherwise append
                            const exists = prev.find((m) => m.id.startsWith("temp-") && m.user_id === data.user_id && m.content === data.content)
                            if (exists) {
                                return prev.map((m) => (m.id === exists.id ? data as any : m))
                            }
                            return [...prev, data as any]
                        })
                        scrollToBottom()
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
    }, [roomId, supabase])

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
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
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

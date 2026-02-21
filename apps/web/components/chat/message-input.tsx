"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MessageInputProps {
    roomId: string
    userId: string
    onOptimisticSend: (message: any) => void
}

export function MessageInput({ roomId, userId, onOptimisticSend }: MessageInputProps) {
    const [content, setContent] = useState("")
    const [sending, setSending] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const supabase = createClient()

    const handleSend = async () => {
        if (!content.trim() || sending) return

        const trimmed = content.trim()
        setContent("")

        // OPTIMISTIC UPDATE — Message appears instantly
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            content: trimmed,
            user_id: userId,
            room_id: roomId,
            created_at: new Date().toISOString(),
            pending: true,
            profiles: null,
        }
        onOptimisticSend(optimisticMsg)

        setSending(true)
        const { error } = await supabase
            .from("chat_messages")
            .insert({ content: trimmed, room_id: roomId, user_id: userId })

        setSending(false)

        if (error) {
            toast.error("Failed to send message")
            console.error(error)
        }

        // Refocus the textarea after send
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-4 border-t bg-background">
            <div className="flex gap-2 items-end">
                <Textarea
                    ref={textareaRef}
                    placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[44px] max-h-[160px] resize-none flex-1 text-sm"
                    rows={1}
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!content.trim() || sending}
                    className="h-11 w-11 shrink-0"
                >
                    {sending
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <SendHorizontal className="h-4 w-4" />
                    }
                </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                Press <kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> to send
            </p>
        </div>
    )
}

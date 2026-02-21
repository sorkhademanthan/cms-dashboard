"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
    message: {
        id: string
        content: string
        created_at: string
        pending?: boolean
        user_id: string
        profiles?: {
            full_name: string
            avatar_url: string
            username: string
        }
    }
    isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const name = message.profiles?.full_name || "Unknown"
    const avatar = message.profiles?.avatar_url || ""
    const initials = name.substring(0, 2).toUpperCase()

    return (
        <div className={cn(
            "flex gap-3 items-end mb-4 group",
            isOwn ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            {!isOwn && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "flex flex-col max-w-[70%]",
                isOwn ? "items-end" : "items-start"
            )}>
                {/* Name + Time */}
                {!isOwn && (
                    <span className="text-xs text-muted-foreground mb-1 ml-1 font-medium">{name}</span>
                )}

                {/* Bubble */}
                <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm",
                    message.pending && "opacity-60"
                )}>
                    {message.content}
                    {message.pending && (
                        <span className="ml-2 text-xs opacity-70">sending…</span>
                    )}
                </div>

                {/* Timestamp */}
                <time className="text-[10px] text-muted-foreground mt-1 mx-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </time>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageArea } from "./message-area"
import { MessageInput } from "./message-input"
import { OnlineIndicator } from "./online-indicator"
import { Hash, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Room {
    id: string
    name: string
    type: string
}

interface ChatLayoutProps {
    rooms: Room[]
    currentRoom: Room
    initialMessages: any[]
    currentUser: {
        id: string
        full_name: string
        avatar_url?: string
    }
}

export function ChatLayout({ rooms, currentRoom, initialMessages, currentUser }: ChatLayoutProps) {
    const [messages, setMessages] = useState<any[]>(initialMessages)

    const handleOptimisticSend = (msg: any) => {
        setMessages((prev) => [...prev, msg])
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Rooms Sidebar */}
            <aside className="w-56 shrink-0 border-r bg-muted/30 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Channels</h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {rooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/dashboard/chat?room=${room.id}`}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                currentRoom.id === room.id
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Hash className="h-4 w-4 shrink-0" />
                            <span className="truncate">{room.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {currentUser.full_name?.substring(0, 1).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{currentUser.full_name || "You"}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background">
                    <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <h1 className="font-semibold">{currentRoom.name}</h1>
                    </div>
                    <OnlineIndicator
                        roomId={currentRoom.id}
                        userId={currentUser.id}
                        userName={currentUser.full_name}
                    />
                </div>

                {/* Messages */}
                <MessageArea
                    roomId={currentRoom.id}
                    initialMessages={messages}
                    currentUserId={currentUser.id}
                />

                {/* Input */}
                <MessageInput
                    roomId={currentRoom.id}
                    userId={currentUser.id}
                    onOptimisticSend={handleOptimisticSend}
                />
            </div>
        </div>
    )
}

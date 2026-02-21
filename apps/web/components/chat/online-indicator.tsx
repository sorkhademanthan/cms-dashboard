"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OnlineIndicatorProps {
    roomId: string
    userId: string
    userName: string
}

export function OnlineIndicator({ roomId, userId, userName }: OnlineIndicatorProps) {
    const [onlineCount, setOnlineCount] = useState(1)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel(`presence:${roomId}`)
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState()
                const count = Object.keys(state).length
                setOnlineCount(count)
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({ user_id: userId, name: userName, online_at: new Date().toISOString() })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, userId, userName, supabase])

    return (
        <div className="flex items-center gap-1.5">
            <span className={cn(
                "h-2 w-2 rounded-full bg-green-500 animate-pulse"
            )} />
            <span className="text-xs text-muted-foreground font-medium">
                {onlineCount} online
            </span>
        </div>
    )
}

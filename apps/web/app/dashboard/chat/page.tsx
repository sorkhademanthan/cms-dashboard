import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatLayout } from "@/components/chat/chat-layout"

interface ChatPageProps {
    searchParams: Promise<{ room?: string }>
}

export default async function ChatPage(props: ChatPageProps) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect("/login")

    // Get current user's profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single()

    if (!profile) redirect("/dashboard/settings")

    // Fetch all public rooms
    const { data: rooms } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: true })

    if (!rooms || rooms.length === 0) {
        // No rooms yet — show setup message
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4 text-center p-8">
                <div className="text-5xl">🚀</div>
                <h2 className="text-2xl font-bold">Chat is almost ready!</h2>
                <p className="text-muted-foreground max-w-md">
                    You need to create some chat rooms first. Run the SQL setup script in Supabase to create the database tables and seed the default rooms.
                </p>
                <div className="bg-muted rounded-lg p-4 text-left text-sm font-mono max-w-lg w-full">
                    <p className="text-muted-foreground mb-2">-- Run in Supabase SQL Editor:</p>
                    <p>insert into chat_rooms (name, type) values</p>
                    <p>  (&apos;general&apos;, &apos;public&apos;),</p>
                    <p>  (&apos;random&apos;, &apos;public&apos;),</p>
                    <p>  (&apos;announcements&apos;, &apos;public&apos;);</p>
                </div>
            </div>
        )
    }

    // Pick the room from query param, else default to first
    const currentRoom = rooms.find((r) => r.id === searchParams.room) || rooms[0]

    // Auto-join user into current room if not already a participant
    await supabase
        .from("chat_participants")
        .upsert({ room_id: currentRoom.id, user_id: user.id }, { onConflict: "room_id,user_id" })

    // Fetch last 50 messages with author profiles
    const { data: messages } = await supabase
        .from("chat_messages")
        .select(`
            *,
            profiles (
                full_name,
                avatar_url,
                username
            )
        `)
        .eq("room_id", currentRoom.id)
        .order("created_at", { ascending: true })
        .limit(50)

    return (
        <ChatLayout
            rooms={rooms}
            currentRoom={currentRoom}
            initialMessages={messages || []}
            currentUser={{
                id: user.id,
                full_name: profile.full_name || user.email || "User",
                avatar_url: profile.avatar_url || "",
            }}
        />
    )
}

import { createClient } from "@/lib/supabase/server"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export async function RecentActivity() {
    const supabase = await createClient()

    // Fetch recent comments
    const { data: comments } = await supabase
        .from("comments")
        .select(`
            id,
            content,
            created_at,
            profiles (
                full_name,
                email,
                avatar_url
            )
        `)
        .order("created_at", { ascending: false })
        .limit(5)

    if (!comments || comments.length === 0) {
        return <div className="text-sm text-muted-foreground">No recent activity.</div>
    }

    return (
        <div className="space-y-8">
            {comments.map((comment: any) => (
                <div key={comment.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={comment.profiles?.avatar_url} alt="Avatar" />
                        <AvatarFallback>
                            {comment.profiles?.full_name?.substring(0, 2).toUpperCase() || "US"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {comment.profiles?.full_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {comment.content}
                        </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                </div>
            ))}
        </div>
    )
}

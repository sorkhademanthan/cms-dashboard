"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, SendHorizontal, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        id: string
        full_name: string
        avatar_url: string
        username: string
    }
}

interface CommentsSectionProps {
    postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
        fetchComments()

        // Realtime Subscription
        const channel = supabase
            .channel('realtime-comments')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`,
                },
                (payload) => {
                    // Fetch the new comment with profile data to append correctly
                    fetchNewComment(payload.new.id)
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`,
                },
                (payload) => {
                    setComments((prev) => prev.filter((c) => c.id !== payload.old.id))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [postId, supabase])

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `)
            .eq("post_id", postId)
            .order("created_at", { ascending: false }) // Newest first

        if (error) {
            console.error("Error fetching comments:", error)
        } else {
            setComments(data as any)
        }
    }

    const fetchNewComment = async (commentId: string) => {
        const { data, error } = await supabase
            .from("comments")
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    username,
                    avatar_url
                )
            `)
            .eq("id", commentId)
            .single()

        if (data) {
            setComments((prev) => [data as any, ...prev])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        if (!user) {
            toast.error("Please login to comment")
            return
        }

        setLoading(true)
        const { error } = await supabase.from("comments").insert({
            content,
            post_id: postId,
            user_id: user.id,
        })

        if (error) {
            toast.error("Failed to post comment")
            console.error(error)
        } else {
            setContent("")
            toast.success("Comment posted!")
        }
        setLoading(false)
    }

    const handleDelete = async (commentId: string) => {
        const { error } = await supabase.from("comments").delete().eq("id", commentId)
        if (error) {
            toast.error("Failed to delete comment")
        } else {
            toast.success("Comment deleted")
        }
    }

    return (
        <div className="space-y-8 mt-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            placeholder="Add a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading || !content.trim()}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Post Comment <SendHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50 text-center space-y-4">
                    <p className="text-muted-foreground">Please log in to join the conversation.</p>
                    {/* Login buttons could go here */}
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <Avatar className="h-10 w-10 mt-1 cursor-pointer">
                            <AvatarImage src={comment.profiles?.avatar_url} alt={comment.profiles?.full_name} />
                            <AvatarFallback>{comment.profiles?.full_name?.substring(0, 2).toUpperCase() || "AU"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{comment.profiles?.full_name || "Unknown User"}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                {user?.id === comment.user_id && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DeletePostButton } from "@/components/posts/delete-post-button"

// ... imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function PostsPage() {
    const supabase = await createClient()

    // Fetch posts from Supabase
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching posts:", error)
    }

    // Manual Join: Fetch profiles for these posts
    // We do this to avoid complex SQL FK changes for now
    let profilesMap: Record<string, any> = {}
    if (posts && posts.length > 0) {
        const authorIds = Array.from(new Set(posts.map((p) => p.author_id)))
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, email")
            .in("id", authorIds)

        if (profiles) {
            profiles.forEach((p) => {
                profilesMap[p.id] = p
            })
        }
    }

    return (
        <div className="flex flex-col gap-4 h-full p-4">
            {/* ... Header ... */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground">
                        Manage your blog posts and content.
                    </p>
                </div>
                <Link href="/dashboard/posts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No posts found. Create your first post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts?.map((post) => {
                                const author = profilesMap[post.author_id]
                                return (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">
                                            {post.title}
                                            <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                /{post.slug}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={post.published ? "default" : "secondary"}>
                                                {post.published ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={author?.avatar_url} />
                                                    <AvatarFallback className="text-[10px]">
                                                        {author?.full_name?.substring(0, 2).toUpperCase() || "AU"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">
                                                    {author?.full_name || "Unknown"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(post.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/posts/${post.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeletePostButton postId={post.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { PostForm } from "@/components/posts/post-form"
import { Separator } from "@/components/ui/separator"

interface EditPostPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditPostPage(props: EditPostPageProps) {
    const params = await props.params;
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/")
    }

    // 2. Fetch post
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single()

    if (error || !post) {
        console.error("Error fetching post:", error)
        notFound()
    }

    // 3. Authorization check (users can only edit their own posts)
    if (post.author_id !== user.id) {
        // Ideally user-friendly error page or unauthorized
        redirect("/dashboard/posts")
    }

    return (
        <div className="flex-1 space-y-4 p-4 lg:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Post</h2>
            </div>
            <Separator />
            <PostForm initialData={post} />
        </div>
    )
}

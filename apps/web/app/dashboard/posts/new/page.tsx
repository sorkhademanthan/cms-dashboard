import { PostForm } from "@/components/posts/post-form"
import { Separator } from "@/components/ui/separator"

export default function NewPostPage() {
    return (
        <div className="flex-1 space-y-4 p-4 lg:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create Post</h2>
            </div>
            <Separator />
            <PostForm />
        </div>
    )
}

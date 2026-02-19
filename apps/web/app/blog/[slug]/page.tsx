import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const revalidate = 60 // ISR: Revalidate content

interface PostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(props: PostPageProps) {
    const params = await props.params;

    const supabase = await createClient()
    const { data: post } = await supabase
        .from("posts")
        .select("title, excerpt, image_url")
        .eq("slug", params.slug)
        .single()

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            images: post.image_url ? [{ url: post.image_url }] : [],
        },
    }
}

export default async function PostPage(props: PostPageProps) {
    const params = await props.params;
    const supabase = await createClient()

    // Fetch post by slug
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .single()

    if (error || !post) {
        console.error("Fetch error:", error)
        notFound()
    }

    return (
        <article className="container relative max-w-3xl py-6 lg:py-10 mx-auto px-4">
            <Link
                href="/blog"
                className="absolute left-[-200px] top-14 hidden xl:inline-flex"
            >
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </Link>
            <div>
                {post.created_at && (
                    <time
                        dateTime={post.created_at}
                        className="block text-sm text-muted-foreground"
                    >
                        Published on {format(new Date(post.created_at), "MMMM d, yyyy")}
                    </time>
                )}
                <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
                    {post.title}
                </h1>
                {post.image_url && (
                    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg border bg-muted transition-colors">
                        {/* Using standard img tag for simplicity or Next Image if domain is whitelisted */}
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
            </div>
            <div className="prose dark:prose-invert max-w-none pb-8 pt-4">
                <ReactMarkdown>{post.content || ""}</ReactMarkdown>
            </div>
            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link href="/blog">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> See all posts
                    </Button>
                </Link>
            </div>
        </article>
    )
}

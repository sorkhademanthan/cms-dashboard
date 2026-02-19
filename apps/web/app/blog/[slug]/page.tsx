import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CommentsSection } from "@/components/comments/comments-section"
import { ViewCounter } from "@/components/view-counter"

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

    // Fetch author profile
    const { data: author } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", post.author_id)
        .single()

    return (
        <article className="container relative max-w-3xl py-6 lg:py-10 mx-auto px-4">
            <ViewCounter postId={post.id} />
            <Link
                href="/blog"
                className="absolute left-[-200px] top-14 hidden xl:inline-flex"
            >
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </Link>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    {author && (
                        <div className="flex items-center gap-2">
                            {author.avatar_url ? (
                                <img
                                    src={author.avatar_url}
                                    alt={author.full_name}
                                    width={42}
                                    height={42}
                                    className="rounded-full bg-secondary object-cover aspect-square border"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border">
                                    <span className="text-sm font-medium uppercase text-muted-foreground">
                                        {author.full_name ? author.full_name.substring(0, 2) : "AU"}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col text-sm leading-tight">
                                <span className="font-medium text-foreground">
                                    {author.full_name || "Unknown Author"}
                                </span>
                                {author.username && (
                                    <span className="text-muted-foreground">@{author.username}</span>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col text-sm leading-tight text-muted-foreground ml-auto">
                        {post.created_at && (
                            <time dateTime={post.created_at}>
                                {format(new Date(post.created_at), "MMMM d, yyyy")}
                            </time>
                        )}
                        <span>5 min read</span>
                    </div>
                </div>

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

            {author && author.bio && (
                <div className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-8 bg-muted/30 p-6 rounded-lg my-8 border">
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">About the Author</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {author.bio}
                        </p>
                        {author.website && (
                            <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                Visit Website
                            </a>
                        )}
                    </div>
                </div>
            )}

            <CommentsSection postId={post.id} />

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

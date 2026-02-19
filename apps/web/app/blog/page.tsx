import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const revalidate = 60 // Revalidate every minute

export default async function BlogPage() {
    const supabase = await createClient()

    // Fetch only published posts
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching published posts:", error)
    }

    return (
        <div className="container py-10 mx-auto px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                        Blog
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        A collection of thoughts, news, and updates.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-muted">
                            {post.image_url && (
                                <div className="aspect-video w-full overflow-hidden relative">
                                    <Image
                                        src={post.image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader className="p-4">
                                <h2 className="text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex-1">
                                <p className="text-muted-foreground line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 flex items-center justify-between text-sm text-muted-foreground mt-auto border-t">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback>AU</AvatarFallback>
                                    </Avatar>
                                    <span>Author</span>
                                </div>
                                <time dateTime={post.created_at}>
                                    {format(new Date(post.created_at), "MMM d, yyyy")}
                                </time>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
                {posts?.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        <p>No posts published yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

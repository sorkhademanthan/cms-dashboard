"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const postSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must be lowercase and hyphen-separated.",
    }),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    image_url: z.string().optional().or(z.literal("")),
    published: z.boolean(),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
    initialData?: any // flexible to accept DB response which might include nulls
}

export function PostForm({ initialData }: PostFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const defaultValues: PostFormValues = {
        title: (initialData?.title as string) || "",
        slug: (initialData?.slug as string) || "",
        content: (initialData?.content as string) || "",
        excerpt: (initialData?.excerpt as string) || "",
        image_url: (initialData?.image_url as string) || "",
        published: (initialData?.published as boolean) || false,
    }

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues,
    })

    // Auto-generate slug from title if slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        // Only auto-generate if specific conditions met (e.g. creating new post)
        if (!initialData && !form.getValues("slug")) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")
            form.setValue("slug", slug)
        }
    }

    async function onSubmit(data: PostFormValues) {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("You must be logged in to create a post.")
                setLoading(false)
                return
            }

            if (initialData) {
                // Update existing post
                const { error } = await supabase
                    .from("posts")
                    .update({
                        ...data,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", initialData.id)

                if (error) throw error
                toast.success("Post updated successfully.")
                router.refresh()
            } else {
                // Create new post
                const { error } = await supabase
                    .from("posts")
                    .insert([
                        {
                            ...data,
                            author_id: user.id,
                        },
                    ])

                if (error) throw error
                toast.success("Post created successfully.")
                router.push("/dashboard/posts")
                router.refresh()
            }
        } catch (error: any) {
            console.error("Submission error:", error)
            toast.error(error.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Post title" {...field} onChange={(e) => {
                                    field.onChange(e);
                                    handleTitleChange(e);
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="post-url-slug" {...field} />
                            </FormControl>
                            <FormDescription>
                                The URL-friendly version of the name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Paste a URL from the Media Library.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="A brief summary of your post."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your post content here (Markdown supported)..."
                                    className="min-h-[300px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Published</FormLabel>
                                <FormDescription>
                                    Make this post visible to the public.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Post" : "Create Post"}
                </Button>
            </form>
        </Form>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { toast } from "sonner"
import { Loader2, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MediaLibrary } from "@/components/media-library"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const profileFormSchema = z.object({
    full_name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).optional().or(z.literal("")),
    email: z.string().email().optional(), // Read-only
    bio: z.string().max(160).optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    avatar_url: z.string().optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    initialData: any
    userId: string
    userEmail: string
}

export function ProfileForm({ initialData, userId, userEmail }: ProfileFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [openMediaPicker, setOpenMediaPicker] = useState(false)

    const defaultValues: Partial<ProfileFormValues> = {
        full_name: initialData?.full_name || "",
        username: initialData?.username || "",
        email: userEmail || "",
        bio: initialData?.bio || "",
        website: initialData?.website || "",
        avatar_url: initialData?.avatar_url || "",
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(data: ProfileFormValues) {
        setLoading(true)

        try {
            // Create or update profile
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: userId,
                    full_name: data.full_name,
                    username: data.username,
                    website: data.website,
                    bio: data.bio,
                    avatar_url: data.avatar_url,
                    email: userEmail, // Keep email synced
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error

            toast.success("Profile updated successfully")
            router.refresh()
        } catch (error: any) {
            console.error("Profile update error:", error)
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative group">
                                        <Avatar className="h-24 w-24 cursor-pointer border-2 border-border transition-opacity hover:opacity-80">
                                            <AvatarImage src={field.value} alt="Avatar" />
                                            <AvatarFallback className="text-xl">
                                                {defaultValues.full_name ? defaultValues.full_name.substring(0, 2).toUpperCase() : "ME"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Dialog open={openMediaPicker} onOpenChange={setOpenMediaPicker}>
                                            <DialogTrigger asChild>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 rounded-full cursor-pointer">
                                                    <Camera className="h-6 w-6" />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                                <DialogHeader>
                                                    <DialogTitle>Select Avatar</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-hidden -mx-4 -mb-4">
                                                    <MediaLibrary onSelect={(url) => {
                                                        field.onChange(url)
                                                        setOpenMediaPicker(false)
                                                    }} />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-1">
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                            Click to upload or change your avatar.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will be used for your profile URL.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} disabled />
                            </FormControl>
                            <FormDescription>
                                You can manage verified email addresses in your{' '}
                                <a href="/dashboard/settings" className="underline">email settings</a>.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                You can <span>@mention</span> other users and organizations to
                                link to them.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Add a link to your website, blog, or portfolio.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update profile
                </Button>
            </form>
        </Form>
    )
}

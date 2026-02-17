"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CloudUpload, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RichTextEditor } from "@/components/editor"

export default function CreatePostPage() {
    const [content, setContent] = useState("")

    return (
        <div className="flex flex-col flex-1 p-8 pt-6 space-y-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/posts">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Create Post</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        Save Draft
                    </Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Publish
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-lg font-medium">Post Title</Label>
                        <Input id="title" placeholder="Enter post title" className="text-lg py-6" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content" className="text-lg font-medium">Content</Label>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                            <CardDescription>Manage visibility and schedule</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select defaultValue="draft">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Author</Label>
                                <Select defaultValue="admin">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin User</SelectItem>
                                        <SelectItem value="jane">Jane Smith</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input id="slug" placeholder="post-url-slug" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea id="excerpt" placeholder="Brief summary of the post..." className="h-24" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                                <div className="text-sm font-medium">Drag & drop or click to upload</div>
                                <div className="text-xs text-muted-foreground mt-1">Recommended size: 1200x630px</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

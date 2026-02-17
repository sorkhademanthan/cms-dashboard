import { promises as fs } from "fs" // This is a mock, in real app we fetch from DB
import path from "path"
import { Metadata } from "next"
import { z } from "zod"

import { columns, Post } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
    title: "Posts",
    description: "Manage your posts.",
}

// Simulate fetching data from your API
async function getPosts(): Promise<Post[]> {
    return [
        {
            id: "728ed52f",
            title: "The Future of AI in CMS",
            status: "published",
            author: "Admin User",
            createdAt: "2024-03-10",
            views: 1250,
        },
        {
            id: "489e1d42",
            title: "10 Tips for Better SEO",
            status: "published",
            author: "Admin User",
            createdAt: "2024-03-08",
            views: 890,
        },
        {
            id: "921e1d42",
            title: "Understanding React Server Components",
            status: "draft",
            author: "Admin User",
            createdAt: "2024-03-12",
            views: 0,
        },
        {
            id: "621e1d42",
            title: "Why Tailwind CSS is Awesome",
            status: "published",
            author: "Admin User",
            createdAt: "2024-02-28",
            views: 3400,
        },
        {
            id: "121e1d42",
            title: "Building Scalable Web Apps",
            status: "archived",
            author: "John Doe",
            createdAt: "2023-12-15",
            views: 560,
        },
        // Add more mock data to demonstrate pagination
        { id: "a1", title: "Introduction to Shadcn UI", status: "published", author: "Jane Smith", createdAt: "2024-01-20", views: 2100 },
        { id: "a2", title: "Advanced TypeScript Patterns", status: "draft", author: "Admin User", createdAt: "2024-03-14", views: 0 },
        { id: "a3", title: "Next.js 14 Features", status: "published", author: "Jane Smith", createdAt: "2024-02-10", views: 1800 },
        { id: "a4", title: "State Management in 2024", status: "published", author: "Admin User", createdAt: "2024-02-05", views: 950 },
        { id: "a5", title: "Deploying to Vercel", status: "published", author: "John Doe", createdAt: "2024-01-30", views: 1200 },
        { id: "a6", title: "CSS Grid vs Flexbox", status: "archived", author: "Jane Smith", createdAt: "2023-11-20", views: 450 },
    ]
}

export default async function PostsPage() {
    const data = await getPosts()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
                    <p className="text-muted-foreground">
                        Manage your blog posts and articles.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

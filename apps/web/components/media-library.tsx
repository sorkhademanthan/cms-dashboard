"use client"

import * as React from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Copy, MoreHorizontal, Trash, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock Data
const initialMedia = [
    {
        id: "1",
        name: "hero-image.jpg",
        url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=800&lazy=load",
        size: "1.2 MB",
        type: "image/jpeg",
        createdAt: "2024-03-20",
    },
    {
        id: "2",
        name: "avatar-01.png",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&lazy=load",
        size: "450 KB",
        type: "image/png",
        createdAt: "2024-03-19",
    },
    {
        id: "3",
        name: "conference-hall.jpg",
        url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800&lazy=load",
        size: "2.8 MB",
        type: "image/jpeg",
        createdAt: "2024-03-18",
    },
    {
        id: "4",
        name: "product-mockup.png",
        url: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80&w=800&lazy=load",
        size: "3.5 MB",
        type: "image/png",
        createdAt: "2024-03-15",
    },
    {
        id: "5",
        name: "team-meeting.jpg",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&lazy=load",
        size: "1.8 MB",
        type: "image/jpeg",
        createdAt: "2024-03-10",
    },
]

interface MediaItem {
    id: string
    name: string
    url: string
    size: string
    type: string
    createdAt: string
}

export function MediaLibrary() {
    const [media, setMedia] = React.useState<MediaItem[]>(initialMedia)
    const [selectedItem, setSelectedItem] = React.useState<MediaItem | null>(null)

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        // In a real app, we would upload these to a server
        const newItems = acceptedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            url: URL.createObjectURL(file), // Local preview
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            type: file.type,
            createdAt: new Date().toISOString().split("T")[0] || new Date().toISOString(),
        }))
        setMedia((prev) => [...newItems, ...prev])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    })

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage your images and assets.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Upload Media</DialogTitle>
                            <DialogDescription>
                                Drag and drop files here or click to browse.
                            </DialogDescription>
                        </DialogHeader>
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors hover:bg-muted/50 cursor-pointer",
                                isDragActive && "border-primary bg-muted"
                            )}
                        >
                            <Input {...getInputProps()} className="hidden" />
                            <div className="rounded-full bg-muted p-4">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-sm font-medium">
                                {isDragActive ? "Drop files here" : "Drag files here to upload"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                SVG, PNG, JPG or GIF (max. 10MB)
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                            onClick={() => setSelectedItem(item)}
                        >
                            <Image
                                src={item.url}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                width={300}
                                height={300}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <p className="truncate text-xs text-white font-medium">{item.name}</p>
                                <p className="text-[10px] text-white/80">{item.size}</p>
                            </div>
                            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation()
                                            navigator.clipboard.writeText(item.url)
                                        }}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={(e) => {
                                            e.stopPropagation()
                                            setMedia(media.filter(m => m.id !== item.id))
                                        }}>
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Media Details</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                                <Image
                                    src={selectedItem.url}
                                    alt={selectedItem.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-1">
                                    <Label>Filename</Label>
                                    <div className="font-medium">{selectedItem.name}</div>
                                </div>
                                <div className="grid gap-1">
                                    <Label>File Type</Label>
                                    <div className="text-sm text-muted-foreground uppercase">{selectedItem.type.split('/')[1]}</div>
                                </div>
                                <div className="grid gap-1">
                                    <Label>Size</Label>
                                    <div className="text-sm text-muted-foreground">{selectedItem.size}</div>
                                </div>
                                <div className="grid gap-1">
                                    <Label>Uploaded At</Label>
                                    <div className="text-sm text-muted-foreground">{selectedItem.createdAt}</div>
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <Label htmlFor="alt-text">Alt Text</Label>
                                    <Input id="alt-text" placeholder="Describe the image for screen readers" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedItem(null)}>
                                        Close
                                    </Button>
                                    <Button onClick={() => setSelectedItem(null)}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import * as React from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Copy, MoreHorizontal, Trash, Upload, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner" // Assuming you have a toast library or similar. If not, can use console for now.

// Type Definition
interface MediaItem {
    id: string
    name: string
    url: string
    size: string
    type: string
    createdAt: string
}

export function MediaLibrary() {
    const [media, setMedia] = React.useState<MediaItem[]>([])
    const [uploading, setUploading] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [selectedItem, setSelectedItem] = React.useState<MediaItem | null>(null)
    const [openUpload, setOpenUpload] = React.useState(false) // Control upload dialog

    const supabase = createClient()

    // Fetch Media on Load
    React.useEffect(() => {
        fetchMedia()
    }, [])

    const fetchMedia = async () => {
        setLoading(true)
        const { data, error } = await supabase.storage.from("media").list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
        })

        if (error) {
            console.error("Error fetching media:", error)
        } else {
            // Transform Supabase data to our MediaItem format
            const items = data.map((file) => {
                const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(file.name)
                return {
                    id: file.id,
                    name: file.name,
                    url: publicUrl,
                    size: (file.metadata?.size / 1024 / 1024).toFixed(2) + " MB",
                    type: file.metadata?.mimetype || "unknown",
                    createdAt: new Date(file.created_at).toLocaleDateString(),
                }
            })
            setMedia(items)
        }
        setLoading(false)
    }

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        setUploading(true)
        const newItems: MediaItem[] = []

        for (const file of acceptedFiles) {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}` // Sanitize filename
            const { data, error } = await supabase.storage
                .from("media")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                })

            if (error) {
                console.error("Upload error:", error)
            } else {
                const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName)
                newItems.push({
                    id: data.id || Math.random().toString(), // data.id might be path
                    name: fileName,
                    url: publicUrl,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    type: file.type,
                    createdAt: new Date().toISOString().split("T")[0] || "",
                })
            }
        }

        setMedia((prev) => [...newItems, ...prev])
        setUploading(false)
        setOpenUpload(false) // Close dialog
    }, [supabase])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    })

    const handleDelete = async (item: MediaItem) => {
        const { error } = await supabase.storage.from("media").remove([item.name])
        if (error) {
            console.error("Delete error:", error)
        } else {
            setMedia((prev) => prev.filter((m) => m.id !== item.id))
            if (selectedItem?.id === item.id) setSelectedItem(null)
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage your images and assets.
                    </p>
                </div>
                <Dialog open={openUpload} onOpenChange={setOpenUpload}>
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
                                {uploading ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
                            </div>
                            <p className="mt-2 text-sm font-medium">
                                {uploading ? "Uploading..." : (isDragActive ? "Drop files here" : "Drag files here to upload")}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                SVG, PNG, JPG or GIF (max. 10MB)
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <ScrollArea className="flex-1 p-4">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                        <p>No media found.</p>
                        <p className="text-sm">Upload some images to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={item.url}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        width={300}
                                        height={300}
                                        unoptimized // Supabase URLs might need this or configured domains
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100 z-10 transition-all">
                                    <p className="truncate text-xs text-white font-medium">{item.name}</p>
                                    <p className="text-[10px] text-white/80">{item.size}</p>
                                </div>
                                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 z-20">
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
                                                handleDelete(item)
                                            }}>
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Detail View (Simplified for now) */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Media Details</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                                <Image
                                    src={selectedItem.url}
                                    alt={selectedItem.name}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-1">
                                    <Label>Filename</Label>
                                    <div className="font-medium break-all">{selectedItem.name}</div>
                                </div>
                                <div className="grid gap-1">
                                    <Label>File Type</Label>
                                    <div className="text-sm text-muted-foreground uppercase">{selectedItem.type.split('/')[1] || selectedItem.type}</div>
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
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => {
                                        navigator.clipboard.writeText(selectedItem.url)
                                    }}>
                                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(selectedItem)}>
                                        Delete
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

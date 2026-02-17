import { MediaLibrary } from "@/components/media-library"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Media Library",
    description: "Manage your images and assets.",
}

export default function MediaPage() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <MediaLibrary />
        </div>
    )
}

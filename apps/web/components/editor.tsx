"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface EditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something amazing...",
}: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    "min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col gap-2 rounded-md border bg-background">
            <div className="flex flex-wrap items-center gap-1 p-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    aria-label="Toggle strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    aria-label="Toggle heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    aria-label="Toggle heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 3 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    aria-label="Toggle heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Toggle bullet list"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Toggle ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Toggle blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const url = window.prompt('Enter image URL')
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run()
                        }
                    }}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <EditorContent editor={editor} className="p-4" />
        </div>
    )
}

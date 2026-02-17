"use client"

import { useState } from "react"
import Link from "next/link"
import { Metadata } from "next"
import { Copy, Plus, Save, Trash, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general")

    // Mock Data for Team
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: "Admin User", email: "admin@moderncms.com", role: "Owner", avatar: "/avatars/01.png" },
        { id: 2, name: "Jane Smith", email: "jane@moderncms.com", role: "Editor", avatar: "/avatars/02.png" },
        { id: 3, name: "Bob Johnson", email: "bob@moderncms.com", role: "Viewer", avatar: "/avatars/03.png" },
    ])

    // Mock Data for API Keys
    const [apiKeys, setApiKeys] = useState([
        { id: "key_1", name: "Production Key", key: "pk_live_51Mwd...", created: "2024-01-15" },
        { id: "key_2", name: "Development Key", key: "pk_test_51Mwd...", created: "2024-03-20" },
    ])

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>

            <Tabs value={activeTab} defaultValue="general" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="team">Team Members</TabsTrigger>
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Information</CardTitle>
                            <CardDescription>
                                Manage your site's public profile and branding.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input id="site-name" defaultValue="Modern CMS" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site-desc">Description</Label>
                                <Textarea
                                    id="site-desc"
                                    defaultValue="A high-performance CMS built with Next.js and Shadcn UI."
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site-url">Public URL</Label>
                                <Input id="site-url" defaultValue="https://moderncms.com" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Localization</CardTitle>
                            <CardDescription>
                                Set your site's default language and timezone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select defaultValue="usd">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                            <SelectItem value="gbp">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Team Members Tab */}
                <TabsContent value="team" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>
                                    Invite your team members to collaborate.
                                </CardDescription>
                            </div>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Invite Member
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Select defaultValue={member.role.toLowerCase()}>
                                                <SelectTrigger className="w-[110px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="owner">Owner</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {member.role !== "Owner" && (
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Keys Tab */}
                <TabsContent value="api-keys" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription>
                                    Manage your API keys for accessing the content API.
                                </CardDescription>
                            </div>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Create New Key
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {apiKeys.map((apiKey) => (
                                    <div key={apiKey.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none">{apiKey.name}</p>
                                            <div className="flex items-center pt-1">
                                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                                    {apiKey.key}
                                                </code>
                                                <Button variant="ghost" size="icon" className="ml-2 h-6 w-6" onClick={() => navigator.clipboard.writeText(apiKey.key)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Created on {apiKey.created}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                            Revoke
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Configure when you receive email alerts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-comments" className="flex flex-col space-y-1">
                                    <span>New comments</span>
                                    <span className="font-normal text-muted-foreground">Receive emails when someone comments on your posts.</span>
                                </Label>
                                <Switch id="new-comments" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="post-published" className="flex flex-col space-y-1">
                                    <span>Post published</span>
                                    <span className="font-normal text-muted-foreground">Receive emails when a scheduled post goes live.</span>
                                </Label>
                                <Switch id="post-published" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                                    <span>Security alerts</span>
                                    <span className="font-normal text-muted-foreground">Receive emails about suspicious login attempts.</span>
                                </Label>
                                <Switch id="security-alerts" defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

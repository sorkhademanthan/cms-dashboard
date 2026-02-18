"use client"

import { useState } from "react"
import {
    Layout,
    Users,
    Key,
    Bell,
    CreditCard,
    Activity,
    ShieldCheck,
    HardDrive,
    Search,
    Lock,
    Globe,
    Mail,
    Smartphone,
    CheckCircle2,
    AlertCircle,
    Download,
    Save
} from "lucide-react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your workspace, team, and billing preferences.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost">Discard</Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <div className="border-b pb-0">
                    <TabsList className="bg-transparent p-0 h-auto justify-start border-b-0 rounded-none w-full space-x-6 overflow-x-auto">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-2 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="general"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-2 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="team"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-2 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground"
                        >
                            Team
                        </TabsTrigger>
                        <TabsTrigger
                            value="billing"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-2 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground"
                        >
                            Billing
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-2 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground"
                        >
                            Notifications
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
                    {/* Metric Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Plan Type</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Pro Plan</div>
                                <p className="text-xs text-muted-foreground">$29/mo billed monthly</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4 / 10</div>
                                <p className="text-xs text-muted-foreground">6 seats remaining</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12.5 GB</div>
                                <p className="text-xs text-muted-foreground">of 50 GB capacity</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Health</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span>Healthy</span>
                                </div>
                                <p className="text-xs text-muted-foreground">All systems operational</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 h-full">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks you might want to perform.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <Button variant="outline" className="h-auto flex-col gap-3 items-start p-6 hover:bg-muted/50 transition-all border-dashed">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <div className="font-semibold text-base">Invite Team</div>
                                        <div className="text-xs text-muted-foreground font-normal leading-relaxed">
                                            Add new members to your workspace to collaborate.
                                        </div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-auto flex-col gap-3 items-start p-6 hover:bg-muted/50 transition-all border-dashed">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <div className="font-semibold text-base">Manage Billing</div>
                                        <div className="text-xs text-muted-foreground font-normal leading-relaxed">
                                            Update payment methods and download invoices.
                                        </div>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 h-full">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest changes in the workspace.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-start">
                                        <Avatar className="h-9 w-9 mt-0.5">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                            <AvatarFallback>OM</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-xs text-muted-foreground">
                                                Updated workspace settings
                                            </p>
                                            <div className="text-[10px] text-muted-foreground pt-1">2m ago</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Avatar className="h-9 w-9 mt-0.5">
                                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                                            <AvatarFallback>JL</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-xs text-muted-foreground">
                                                Invited new member to the team
                                            </p>
                                            <div className="text-[10px] text-muted-foreground pt-1">1h ago</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                                            <CreditCard className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Billing</p>
                                            <p className="text-xs text-muted-foreground">
                                                Invoice #1023 paid successfully
                                            </p>
                                            <div className="text-[10px] text-muted-foreground pt-1">1d ago</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Branding</CardTitle>
                            <CardDescription>
                                This information will be displayed publicly on your site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="ws-name">Workspace Name</Label>
                                <Input id="ws-name" defaultValue="Modern CMS" className="max-w-md" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ws-url">Workspace URL</Label>
                                <div className="flex max-w-md">
                                    <span className="flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground text-sm">
                                        https://
                                    </span>
                                    <Input id="ws-url" defaultValue="moderncms.com" className="rounded-l-none" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ws-desc">About</Label>
                                <Textarea
                                    id="ws-desc"
                                    className="max-w-md min-h-[100px]"
                                    defaultValue="A collaborative space for content creation."
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Brief description of your workspace (max 240 chars).
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Preferences</CardTitle>
                            <CardDescription>Set your local language and currency formats.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2 max-w-2xl">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="uk">English (UK)</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select defaultValue="utc">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utc">UTC (+00:00)</SelectItem>
                                        <SelectItem value="est">EST (-05:00)</SelectItem>
                                        <SelectItem value="pst">PST (-08:00)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                            <div className="space-y-1">
                                <CardTitle>Team Management</CardTitle>
                                <CardDescription>Manage your team members and their roles.</CardDescription>
                            </div>
                            <Button>
                                <Users className="mr-2 h-4 w-4" /> Invite Member
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Owner */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/avatars/01.png" />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Admin User</p>
                                            <p className="text-sm text-muted-foreground">admin@moderncms.com</p>
                                        </div>
                                    </div>
                                    <Badge>Owner</Badge>
                                </div>
                                <Separator />
                                {/* Member */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/avatars/02.png" />
                                            <AvatarFallback>JS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Jane Smith</p>
                                            <p className="text-sm text-muted-foreground">jane@moderncms.com</p>
                                        </div>
                                    </div>
                                    <Select defaultValue="editor">
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                {/* Member 2 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/avatars/03.png" />
                                            <AvatarFallback>BJ</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Bob Johnson</p>
                                            <p className="text-sm text-muted-foreground">bob@moderncms.com</p>
                                        </div>
                                    </div>
                                    <Select defaultValue="viewer">
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BILLING TAB */}
                <TabsContent value="billing" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan & Usage</CardTitle>
                            <CardDescription>You are currently on the Pro Plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                <div>
                                    <div className="font-semibold text-lg">Pro Plan</div>
                                    <div className="text-sm text-muted-foreground">$29/month • Billed monthly</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline">Downgrade</Button>
                                    <Button variant="default">Upgrade Plan</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Storage Usage</span>
                                    <span className="text-muted-foreground">12.5 GB / 50 GB</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[25%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invoices</CardTitle>
                            <CardDescription>Recent billing history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 last:pb-0">
                                        <div className="space-y-0.5">
                                            <div className="font-medium text-sm">Invoice #{1020 + i}</div>
                                            <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                Paid on Feb {15 - i}, 2024 • $29.00
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8">
                                            <Download className="mr-2 h-3.5 w-3.5" />
                                            PDF
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Alerts</CardTitle>
                            <CardDescription>
                                Manage your email notification preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-start gap-4">
                                <Mail className="mt-1 h-5 w-5 text-primary" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="comments" className="font-medium">Comments</Label>
                                        <Switch id="comments" defaultChecked />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Receive emails when someone comments on your posts.
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-4">
                                <Lock className="mt-1 h-5 w-5 text-primary" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="security" className="font-medium">Security</Label>
                                        <Switch id="security" defaultChecked />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Receive emails about suspicious login attempts.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}

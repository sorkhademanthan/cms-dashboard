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
    Save,
    Trash2,
    Plus,
    History
} from "lucide-react"
import { toast } from "sonner"

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
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your workspace, team, and billing preferences.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost">Discard</Button>
                    <Button onClick={() => toast.success("Settings saved successfully")}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <div className="border-b">
                    <TabsList className="bg-transparent p-0 h-auto w-full justify-start rounded-none space-x-8 overflow-x-auto">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-3 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground hover:text-foreground"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="general"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-3 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground hover:text-foreground"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="team"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-3 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground hover:text-foreground"
                        >
                            Team
                        </TabsTrigger>
                        <TabsTrigger
                            value="billing"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-3 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground hover:text-foreground"
                        >
                            Billing
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-0 pb-3 bg-transparent font-medium text-muted-foreground transition-none data-[state=active]:text-foreground hover:text-foreground"
                        >
                            Notifications
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
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
                        <Card className="col-span-4 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks you might want to perform.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2 flex-1">
                                <Button variant="outline" className="h-auto flex-col gap-3 items-start p-6 hover:bg-muted/50 transition-all border-dashed justify-start">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left space-y-1">
                                        <div className="font-semibold text-base">Invite Team</div>
                                        <div className="text-xs text-muted-foreground font-normal leading-relaxed">
                                            Add new members to your workspace to collaborate.
                                        </div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-auto flex-col gap-3 items-start p-6 hover:bg-muted/50 transition-all border-dashed justify-start">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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

                        <Card className="col-span-3 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest changes in the workspace.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-start">
                                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-muted mt-0.5 shrink-0">
                                            <span className="text-xs font-medium">OM</span>
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-xs text-muted-foreground">
                                                Updated workspace settings
                                            </p>
                                            <div className="text-[10px] text-muted-foreground pt-1">2m ago</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-muted mt-0.5 shrink-0">
                                            <span className="text-xs font-medium">JL</span>
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-xs text-muted-foreground">
                                                Invited new member
                                            </p>
                                            <div className="text-[10px] text-muted-foreground pt-1">1h ago</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 h-full">
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
                                    <div className="flex w-full max-w-md">
                                        <span className="flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground text-sm">
                                            https://
                                        </span>
                                        <Input id="ws-url" defaultValue="moderncms.com" className="rounded-l-none flex-1" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ws-desc">About</Label>
                                    <Textarea
                                        id="ws-desc"
                                        className="min-h-[100px] w-full max-w-lg"
                                        defaultValue="A collaborative space for content creation."
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Brief description of your workspace (max 240 chars).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="col-span-3 space-y-6 h-full flex flex-col">
                            <Card className="flex-1">
                                <CardHeader>
                                    <CardTitle>Regional Preferences</CardTitle>
                                    <CardDescription>Set your local language and currency formats.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
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

                            <Card className="border-destructive/20 bg-destructive/5 shrink-0">
                                <CardHeader>
                                    <CardTitle className="text-destructive text-base">Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Delete Workspace</span>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                                <div className="space-y-1">
                                    <CardTitle>Team Management</CardTitle>
                                    <CardDescription>Manage your team members and their roles.</CardDescription>
                                </div>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>AU</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">Admin User</p>
                                            <p className="text-sm text-muted-foreground">admin@moderncms.com</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-auto">Owner</Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>JS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">Jane Smith</p>
                                            <p className="text-sm text-muted-foreground">jane@moderncms.com</p>
                                        </div>
                                    </div>
                                    <Select defaultValue="editor">
                                        <SelectTrigger className="w-[100px] h-8 ml-auto">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Pending Invites</CardTitle>
                                <CardDescription>People invited to the workspace.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-full">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span>bob@example.com</span>
                                        </div>
                                        <Badge variant="secondary">Sent</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-full">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span>alice@example.com</span>
                                        </div>
                                        <Badge variant="secondary">Sent</Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-6">
                                <Button variant="outline" className="w-full text-xs">Revoke All</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* BILLING TAB */}
                <TabsContent value="billing" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 h-full">
                            <CardHeader>
                                <CardTitle>Plan & Usage</CardTitle>
                                <CardDescription>You are currently on the Pro Plan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                    <div>
                                        <div className="font-semibold text-lg flex items-center gap-2">
                                            Pro Plan
                                            <Badge>Active</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">$29/month • Billed monthly</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">Downgrade</Button>
                                        <Button size="sm">Upgrade</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Storage Usage</span>
                                            <span className="text-muted-foreground">12.5 GB / 50 GB</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[25%]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="rounded-lg border p-4">
                                            <div className="text-xs text-muted-foreground">API Requests</div>
                                            <div className="font-bold text-2xl">4.5M</div>
                                            <div className="text-xs text-muted-foreground mt-1">out of 10M</div>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <div className="text-xs text-muted-foreground">Bandwidth</div>
                                            <div className="font-bold text-2xl">142GB</div>
                                            <div className="text-xs text-muted-foreground mt-1">out of 500GB</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Invoices</CardTitle>
                                <CardDescription>Recent billing history.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 last:pb-0 group">
                                            <div className="space-y-0.5">
                                                <div className="font-medium text-sm">Invoice #{1020 + i}</div>
                                                <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                    Paid Feb {15 - i}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-6 mt-auto">
                                <Button variant="outline" className="w-full">View All Invoices</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 h-full">
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
                                            <Label htmlFor="comments" className="font-medium text-base">Comments</Label>
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
                                            <Label htmlFor="security" className="font-medium text-base">Security</Label>
                                            <Switch id="security" defaultChecked />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Receive emails about suspicious login attempts.
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-4">
                                    <Bell className="mt-1 h-5 w-5 text-primary" />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="marketing" className="font-medium text-base">Marketing</Label>
                                            <Switch id="marketing" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Receive emails about new features and products.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 h-full">
                            <CardHeader>
                                <CardTitle>Notification Log</CardTitle>
                                <CardDescription>History of sent alerts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                                    <History className="h-8 w-8 opacity-50" />
                                    <span>No recent alerts sent.</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

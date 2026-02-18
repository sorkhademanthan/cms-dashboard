"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import Link from "next/link"

export function DynamicBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter((segment) => segment !== "")

    // Don't render anything if we're at the root or just haven't loaded yet
    if (segments.length === 0) return null

    // Ensure first segment is always "dashboard" (or adjust logic if app root is different)
    // If we are at /dashboard, segments is ['dashboard'].
    // If we assume the layout already has "Dashboard" as root... let's check.

    // Let's render from the second segment onward if the first is 'dashboard',
    // or just render everything.
    // Standard pattern: Home > Dashboard > Section

    // For simplicity, let's assume this component is used IN dashboard layout
    // so "Dashboard" is the start.

    const breadcrumbSegments = segments.slice(1) // Remove 'dashboard'

    if (breadcrumbSegments.length === 0) {
        return (
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbSegments.map((segment, index) => {
                    const href = `/dashboard/${breadcrumbSegments.slice(0, index + 1).join("/")}`
                    const isLast = index === breadcrumbSegments.length - 1

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href} className="capitalize">{segment}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

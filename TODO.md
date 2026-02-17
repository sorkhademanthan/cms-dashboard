# Project Analysis & Todo

## Project Structure
- **Monorepo**: Turborepo
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Component Library**: Shadcn UI (Radix Primitives)
- **Charting**: Recharts
- **Icons**: Lucide React

## Current State Analysis (apps/web)

### ✅ Completed Features
1.  **Authentication UI**:
    - Split-screen design (`apps/web/app/page.tsx`).
    - Login form structure.
2.  **Dashboard Shell**:
    - Sidebar navigation (`apps/web/components/app-sidebar.tsx`).
    - Header with breadcrumbs and search.
3.  **Overview Page**:
    - Key metrics cards (Revenue, Subscriptions, Sales, Active Now).
    - Bar chart visualization (`apps/web/components/dashboard/overview.tsx`).
    - Recent activity list (`apps/web/components/dashboard/recent-activity.tsx`).
4.  **Settings**:
    - Comprehensive settings page with tabs (Overview, General, Team, Billing, Notifications).
    - Responsive layout with sidebar/tabs interaction.
5.  **Media Library**:
    - Masonry grid layout for images.
    - Drag-and-drop upload zone.
    - Image details dialog with metadata editing.

### 🚧 Pending / In Progress (Based on Roadmap)
1.  **Posts Management**:
    - The roadmap mentions a "Posts List Page" and "Create/Edit Post Page" are completed, but the source files (`apps/web/app/dashboard/posts/...`) were not provided in this context context, only referenced in the roadmap.
2.  **Data Persistence**:
    - All data is currently hardcoded (Mock Data). No database connection (Prisma/Postgres) is visible in the provided files.
3.  **Real Authentication**:
    - The login form is UI only. Authentication logic (NextAuth.js / Clerk) needs to be integrated.
4.  **Shared UI Library**:
    - `packages/ui` is currently empty except for a `Code` component. Components defined in `apps/web/components/ui` should ideally be moved to `@repo/ui` if they are to be shared with `apps/docs`.

## Next Steps Recommendation
1.  **Database Setup**: Initialize Prisma or Drizzle ORM to replace mock data.
2.  **Auth Integration**: Implement NextAuth.js or Clerk.
3.  **Refactor UI**: Move generic Shadcn components from `apps/web/components/ui` to `packages/ui` to share with the docs app.

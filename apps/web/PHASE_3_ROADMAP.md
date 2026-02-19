# Phase 3: Public Content Delivery (The Blog)

Now that we have a working backend and dashboard, the next phase is to build the public-facing side of the application where users can actually read the content.

## 1. Objectives

1.  **Blog Index (`/blog`)**: A beautiful grid layout displaying all **Published** posts.
2.  **Single Post View (`/blog/[slug]`)**: A dedicated page for reading articles, featuring:
    *   Hero Image support.
    *   Markdown rendering for rich text content.
    *   Author info and publication date.
    *   SEO metadata generation.

## 2. Technical Stack

*   **Rendering**: Server Components (RSC) for optimal performance and SEO.
*   **Data Fetching**: Direct Supabase queries filtered by `published = true`.
*   **Markdown**: We will use `react-markdown` to safely render the content stored in our database.
*   **Styling**: Valid Tailwind CSS typography plugin (`@tailwindcss/typography`) to make the blog content look beautiful automatically.

## 3. Implementation Plan

### Step 1: Dependencies
- [ ] Install `react-markdown` for rendering content.
- [ ] Ensure `@tailwindcss/typography` is configured in `tailwind.config.ts`.

### Step 2: Blog Listing Page (`apps/web/app/blog/page.tsx`)
- [ ] Fetch all posts where `published` is `true`.
- [ ] Sort by `created_at` descending.
- [ ] Display in a responsive grid card layout.

### Step 3: Single Post Page (`apps/web/app/blog/[slug]/page.tsx`)
- [ ] Fetch single post by `slug`.
- [ ] Handle 404s if post not found or not published.
- [ ] Render the markdown content using the typography plugin.

### Step 4: Polish
- [ ] Add a "Read More" button to the home page or navigation.
- [ ] Ensure responsive design on mobile.

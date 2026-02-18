# Phase 2: Content Management Core (Storage & Posts)

This document outlines the roadmap and technical specifications for implementing the core CMS features: Database Schema for Posts and Supabase Storage for Media.

## 1. Database Schema (SQL)

We need to create a `posts` table in Supabase to store our content.

### **SQL Query to Run in Supabase SQL Editor:**

```sql
-- 1. Create Posts Table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null,
  content text,  -- Will store Markdown/HTML
  excerpt text,
  image_url text, -- URL from Supabase Storage
  published boolean default false,
  author_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table posts enable row level security;

-- 3. Create RLS Policies
-- Allow anyone to read published posts (for the public blog site later)
create policy "Public posts are viewable by everyone." 
  on posts for select 
  using ( published = true );

-- Allow authenticated users (dashboard access) to read all posts
create policy "Authenticated users can see all posts." 
  on posts for select 
  using ( auth.role() = 'authenticated' );

-- Allow authenticated users to insert posts (automatically assigned to them)
create policy "Users can insert their own posts." 
  on posts for insert 
  with check ( auth.uid() = author_id );

-- Allow authors to update their own posts
create policy "Users can update their own posts." 
  on posts for update 
  using ( auth.uid() = author_id );

-- Allow authors to delete their own posts
create policy "Users can delete their own posts." 
  on posts for delete 
  using ( auth.uid() = author_id );
```

## 2. Storage Setup (Media Bucket)

We need a storage bucket for uploading cover images and content media.

### **SQL Query to Run in Supabase SQL Editor:**

```sql
-- 1. Create a public bucket named 'media'
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 2. Storage Policies
-- Allow public access to view files
create policy "Media is publicly accessible." 
  on storage.objects for select 
  using ( bucket_id = 'media' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload media." 
  on storage.objects for insert 
  with check ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- Allow users to update/delete their own files (Optional, simplified for now)
create policy "Users can update their own media."
  on storage.objects for update
  using ( bucket_id = 'media' and auth.uid() = owner );
```

## 3. Implementation Steps (Frontend)

### Step 1: Backend Setup
- [ ] Run the SQL commands above in the Supabase Dashboard -> SQL Editor.

### Step 2: Media Upload Component
- [ ] Create `components/media-uploader.tsx`.
- [ ] Implement drag-and-drop or file selection.
- [ ] Use `supabase.storage.from('media').upload()` to handle uploads.
- [ ] Return the public URL for the post form to use.

### Step 3: Post Management (CRUD)
- [ ] **Read**: Create `apps/web/app/dashboard/posts/page.tsx` to list posts.
- [ ] **Create**: Create `apps/web/app/dashboard/posts/new/page.tsx` with a form (Title, Slug, Content, Image).
- [ ] **Update**: Create `apps/web/app/dashboard/posts/[id]/page.tsx` to edit existing posts.
- [ ] **Delete**: Add delete functionality to the list view.

## 4. Next Steps
Once you have run the SQL commands, we will start building the **Media Uploader** component first, as it is a dependency for creating rich posts.

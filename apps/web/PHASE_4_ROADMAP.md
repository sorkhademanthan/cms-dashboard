# Phase 4: Profiles & Engagement (Realtime & Relations)

We have the content (Posts) and the media (Storage). Now we need to handle the **People** (Profiles) and their **Interactions** (Comments). This phase unlocks the full power of Supabase: **Relational Data** and **Realtime**.

## 1. User Profiles (The "Identity" Layer)
Currently, our posts just have an `author_id`. We need a public-facing profile for each user to display their name, avatar, and bio on their blog posts.

### 1.1 Database Schema (SQL)
We need a `profiles` table that mirrors the `auth.users` table but is publicly readable.

```sql
-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  username text unique,
  avatar_url text,
  website text,
  bio text,
  updated_at timestamp with time zone
);

-- 2. Public Access Policies
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 3. Auto-create Profile on Signup (Trigger)
-- This ensures every new user gets a profile entry automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 1.2 Frontend Tasks
- [ ] **Settings Page** (`/dashboard/settings`): Form to update Name, Bio, Website, and Avatar.
- [ ] **Author Display**: Update the Blog Post page (`/blog/[slug]`) to fetch and display the actual author's name and avatar instead of static text.

## 2. Comments System (The "Realtime" Layer)
Supabase allows us to subscribe to database changes. We will build a comment section that updates in real-time when other users post.

### 2.1 Database Schema
```sql
create table comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime
alter publication supabase_realtime add table comments;
```

### 2.2 Frontend Tasks
- [ ] **Comment Component**: A specific component for the Blog Post page.
- [ ] **Realtime Subscription**: Use `supabase.channel` to listen for new comments and make them appear instantly without refreshing.

## 3. Post Analytics (Bonus)
- [ ] Add a `views` column to the `posts` table.
- [ ] Increment it every time someone visits a blog post.
- [ ] Display "Total Views" in the Dashboard.

## 4. Next Steps
We will start by running the **Profiles SQL** to set up our user system properly. Then we will build the **Settings Page**.

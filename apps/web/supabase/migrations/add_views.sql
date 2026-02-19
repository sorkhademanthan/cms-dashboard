-- Add views column to posts table
alter table public.posts 
add column if not exists views integer default 0;

-- Function to increment user view count safely
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update public.posts
  set views = views + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

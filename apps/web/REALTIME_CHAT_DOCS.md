# Realtime Chat Feature — Industry-Grade Architecture Documentation

## Overview
This document provides a step-by-step architectural breakdown of how to build a production-quality, realtime chat application on top of our existing Supabase + Next.js stack.

This is NOT a simple chatbox. This is a system modeled after how **Slack**, **Discord**, **WhatsApp Web**, and **Intercom** are built.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | Server + Client components, routing |
| **UI** | Shadcn UI + Tailwind CSS | Consistent design system |
| **Realtime Engine** | Supabase Realtime | WebSocket-based presence & messages |
| **Database** | Supabase (PostgreSQL) | Messages, rooms, participants stored in DB |
| **Auth** | Supabase Auth | User identity per message |
| **State** | React useState / useRef | Local message cache & scroll management |
| **Timestamps** | date-fns | Human-readable times |
| **File Uploads** | Supabase Storage | Image/file sharing in chat |
| **Notifications** | Browser Notification API | Desktop alerts for new messages |

---

## Part 1: How Industry-Grade Chat Works

### 1.1 The Core Problem: "Who said what, when, to whom?"

Every chat system, from WhatsApp to Slack, is built around answering that question. The solution always has these three layers:

```
┌─────────────┐      WebSocket      ┌─────────────┐
│   Browser A │ ◄──────────────────► │   Server    │
│   (User 1)  │                     │ (Supabase)  │
└─────────────┘                     │             │
                                    │             │
┌─────────────┐      WebSocket      │             │
│   Browser B │ ◄──────────────────► │             │
│   (User 2)  │                     └─────────────┘
└─────────────┘
```

- **HTTP** (what you use for normal webpages) is ONE-WAY: Browser asks → Server responds.
- **WebSockets** are TWO-WAY: The server can PUSH new messages to the browser without the browser asking.

Supabase Realtime is a WebSocket layer on top of PostgreSQL. When a row is inserted into the `messages` table, ALL connected browsers instantly receive the new message.

### 1.2 The Three Types of Realtime Events

Supabase supports these Postgres changes:

```
INSERT → A new message was sent
UPDATE → A message was edited / a user started typing
DELETE → A message was deleted
```

We subscribe to these in the browser like this:

```typescript
supabase.channel('room:abc')
  .on('postgres_changes', { event: 'INSERT', table: 'messages' }, (payload) => {
    // New message arrived instantly!
    appendMessage(payload.new)
  })
  .subscribe()
```

### 1.3 Presence (Who is Online?)

Supabase Presence is a special feature that tracks which users are currently connected to a channel. This powers the "🟢 Online" indicator you see in chat apps.

```typescript
channel.track({ user_id: user.id, online_at: new Date() })
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  // state contains all online users
})
```

---

## Part 2: Database Schema Design

### Tables Required

#### 2.1 `chat_rooms` — A conversations container
```sql
create table public.chat_rooms (
  id uuid default gen_random_uuid() primary key,
  name text,              -- "General", "Support", etc.
  type text default 'public',  -- 'public' | 'private' | 'direct'
  created_by uuid references auth.users(id),
  created_at timestamptz default now() not null
);
```

#### 2.2 `chat_participants` — Who is in which room
```sql
create table public.chat_participants (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(room_id, user_id)  -- Can't join same room twice
);
```

#### 2.3 `chat_messages` — The actual messages
```sql
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  file_url text,          -- Optional: attached image/file
  edited_at timestamptz,  -- If message was edited
  created_at timestamptz default now() not null
);

-- Enable Realtime!
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_participants;
```

#### 2.4 Row Level Security (RLS)
```sql
-- Messages are readable by room participants only
create policy "Participants can view messages"
  on chat_messages for select
  using (
    exists (
      select 1 from chat_participants
      where room_id = chat_messages.room_id
      and user_id = auth.uid()
    )
  );

-- Only authenticated users can send messages
create policy "Authenticated users can send messages"
  on chat_messages for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own messages  
create policy "Users delete own messages"
  on chat_messages for delete
  using (auth.uid() = user_id);
```

---

## Part 3: Frontend Architecture

### 3.1 Component Hierarchy

```
app/
  dashboard/
    chat/
      page.tsx            ← Server Component: Fetch rooms list
      [roomId]/
        page.tsx          ← Server Component: Fetch initial messages
  
components/
  chat/
    chat-layout.tsx       ← Main layout: sidebar + message area
    room-list.tsx         ← List of available chat rooms (sidebar)
    message-area.tsx      ← "use client" — realtime message list
    message-bubble.tsx    ← Individual message UI
    message-input.tsx     ← Textarea + send button + file upload
    online-indicator.tsx  ← Green dot + count of online users
    typing-indicator.tsx  ← "User is typing..." animation
```

### 3.2 The Message Area (Core Realtime Component)

```typescript
// components/chat/message-area.tsx
"use client"

export function MessageArea({ roomId, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null) // For auto-scroll
  const supabase = createClient()

  useEffect(() => {
    // 1. Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        scrollToBottom() // Auto-scroll on new message
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomId])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
      <div ref={bottomRef} /> {/* Invisible anchor for auto-scroll */}
    </div>
  )
}
```

### 3.3 Optimistic Updates (Industry Secret 🔥)

**The Problem:** When you send a message, there's a tiny delay before Supabase processes it and fires the Realtime event back. This makes the UI feel slow.

**The Solution (used by every major chat app):** Show the message IMMEDIATELY in the UI, then confirm with the real database ID when it arrives.

```typescript
const sendMessage = async (content: string) => {
  const optimisticMessage = {
    id: `temp-${Date.now()}`, // Fake ID
    content,
    user_id: user.id,
    created_at: new Date().toISOString(),
    pending: true // Show spinner/grey color
  }

  // 1. Immediately show in UI
  setMessages(prev => [...prev, optimisticMessage])
  
  // 2. Send to database
  const { data } = await supabase
    .from('chat_messages')
    .insert({ content, room_id: roomId, user_id: user.id })
    .select()
    .single()
  
  // 3. Replace optimistic message with real one
  setMessages(prev => prev.map(msg => 
    msg.id === optimisticMessage.id ? data : msg
  ))
}
```

### 3.4 Presence & Typing Indicators

```typescript
// Track who is typing
const handleTyping = () => {
  channel.track({ 
    user_id: user.id, 
    typing: true,
    last_typed: Date.now()
  })
  
  // Stop "typing" after 3 seconds of no keystrokes
  setTimeout(() => {
    channel.track({ user_id: user.id, typing: false })
  }, 3000)
}

// Listen to presence changes
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  const typingUsers = Object.values(state)
    .flat()
    .filter(p => p.typing && p.user_id !== user.id)
  
  setTypingUsers(typingUsers) // Shows "Manthan is typing..."
})
```

---

## Part 4: Build Order (Step-by-Step)

We will build this in 5 strict steps, one at a time:

### Step 1: Database Setup
- Run the SQL above to create `chat_rooms`, `chat_participants`, `chat_messages`.
- Enable Realtime on these tables.
- Add RLS policies.

### Step 2: Chat Layout + Room List
- Create `/dashboard/chat` page.
- Fetch and display the list of available chat rooms in a sidebar.
- Allow users to join a room.

### Step 3: Message Display (Static)
- Load the last 50 messages from `chat_messages` server-side (ISR).
- Display them in a styled message list with bubbles.
- Auto-scroll to the bottom.

### Step 4: Realtime Messages + Sending
- Subscribe to the Supabase channel for the current room.
- Implement the message input box and send button.
- Apply Optimistic Updates for instant feel.

### Step 5: Presence & Typing
- Show the "🟢 X online" indicator using Supabase Presence.
- Show "User is typing..." animation.

---

## Part 5: Industry Features (Phase 2 of Chat)

After the core works, these are what make it production-grade:

| Feature | Implementation |
|---|---|
| **Read Receipts** | `seen_at` column, update when user scrolls past message |
| **Message Reactions** | `reactions` JSONB column on messages |
| **File Uploads** | Supabase Storage upload, store URL in `file_url` |
| **Search** | Full-text search with PostgreSQL `tsquery` |
| **Notifications** | Browser Notification API, check `document.hidden` |
| **Message Threads** | `parent_message_id` FK on messages table |
| **Direct Messages** | `type = 'direct'` rooms with exactly 2 participants |

---

## Ready to Start?

When you say go, I will start with **Step 1: Database Setup**. I will give you the exact SQL to run, then build each component one at a time.

The entire feature will be live within 5 focused steps.

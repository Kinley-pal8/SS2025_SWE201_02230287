-- Create todos table
create table if not exists public.todos (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  completed boolean default false,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.todos enable row level security;

-- Create policies  
create policy "Users can only access their own todos" on public.todos
  for all using (auth.uid() = user_id);

-- Enable real-time
alter publication supabase_realtime add table todos;
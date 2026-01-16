-- Create Archived Tasks Table mirroring the tasks table
create table if not exists archived_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null,
  priority text not null,
  tag text,
  due_date timestamptz,
  created_at timestamptz default now() not null,
  completed_at timestamptz,
  is_archived boolean default true not null,
  subtasks jsonb default '[]'::jsonb,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table archived_tasks enable row level security;

-- RLS Policies for Archived Tasks
create policy "Users can view their own archived tasks"
  on archived_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own archived tasks"
  on archived_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own archived tasks"
  on archived_tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own archived tasks"
  on archived_tasks for delete
  using (auth.uid() = user_id);

-- Realtime setup
alter publication supabase_realtime add table archived_tasks;

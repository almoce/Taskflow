-- Migration: Move existing archived tasks from tasks to archived_tasks
-- This handles legacy data already on the server.

insert into archived_tasks (
  id, user_id, project_id, title, description, status, priority, tag, 
  due_date, created_at, completed_at, is_archived, subtasks, updated_at
)
select 
  id, user_id, project_id, title, description, status, priority, tag, 
  due_date, created_at, completed_at, is_archived, subtasks, updated_at
from tasks
where is_archived = true
on conflict (id) do nothing;

delete from tasks where is_archived = true;

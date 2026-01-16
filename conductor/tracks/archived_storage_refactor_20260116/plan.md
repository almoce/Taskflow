# Implementation Plan - Archived Tasks & IndexedDB

## Phase 1: IndexedDB Persistence Migration
- [x] Task: Install `idb-keyval` dependency [commit: e486060]
- [ ] Task: Create `src/lib/storage.ts` with Zustand IndexedDB adapter
    - [ ] Create unit tests for the storage adapter (mocking IndexedDB)
    - [ ] Implement `getItem`, `setItem`, `removeItem` using `idb-keyval`
- [ ] Task: Create LocalStorage to IndexedDB migration utility
    - [ ] Write tests ensuring data is correctly read from LS and written to IDB
    - [ ] Implement migration logic (run once on startup)
- [ ] Task: Update `src/store/useStore.ts` to use new persistence adapter
    - [ ] Verify store still initializes correctly
- [ ] Task: Conductor - User Manual Verification 'Phase 1: IndexedDB Persistence Migration' (Protocol in workflow.md)

## Phase 2: Local Archived State Separation
- [ ] Task: Create `createArchivedTaskSlice`
    - [ ] Write tests for `archivedTaskSlice` (add, remove, search)
    - [ ] Implement the slice with `archivedTasks` array
- [ ] Task: Refactor `createTaskSlice` archiving logic
    - [ ] Update tests: `archiveTask` should now remove from `tasks` and call `archivedSlice.add`
    - [ ] Implement `archiveTask` and `unarchiveTask` to move data between slices
- [ ] Task: Update UI Components
    - [ ] Update `ArchivedView.tsx` to consume `archivedTasks` from new slice
    - [ ] Update `TaskSearch.tsx` to search both slices
    - [ ] Update `Dashboard.tsx` stats calculations to include/exclude archived as needed
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Local Archived State Separation' (Protocol in workflow.md)

## Phase 3: Cloud Architecture (Supabase)
- [ ] Task: Create Supabase Migration for `archived_tasks` table
    - [ ] Create SQL file in `supabase/migrations` (mirror `tasks` schema)
    - [ ] Apply migration (or provide instructions)
- [ ] Task: Update `syncEngine.ts`
    - [ ] Write tests for `syncArchivedTasks`
    - [ ] Implement `syncArchivedTasks` (fetch only on demand/view)
    - [ ] Update `syncTasks` to strictly work with `tasks` table (active)
    - [ ] Implement "Move" logic in sync (delete from one table, insert into other)
- [ ] Task: Update `useRealtimeSync.ts`
    - [ ] Add subscription to `archived_tasks` table (optional, or only when view is open)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cloud Architecture (Supabase)' (Protocol in workflow.md)

## Phase 4: Data Migration & Cleanup
- [ ] Task: Implement "One-time" Data Migration (Logic)
    - [ ] Write logic to detect old "isArchived: true" tasks in `tasks` table and move them to `archived_tasks`
    - [ ] Ensure this runs safely for both Local and Cloud data
- [ ] Task: Verify Free-to-Pro Upgrade Sync
    - [ ] Ensure local archived tasks are uploaded to `archived_tasks` upon upgrade
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Data Migration & Cleanup' (Protocol in workflow.md)

# Implementation Plan - Archived Tasks & IndexedDB

## Phase 1: IndexedDB Persistence Migration [checkpoint: 38bb507]
- [x] Task: Install `idb-keyval` dependency [commit: e486060]
- [x] Task: Create `src/lib/storage.ts` with Zustand IndexedDB adapter [commit: 444f4cb]
    - [x] Create unit tests for the storage adapter (mocking IndexedDB)
    - [x] Implement `getItem`, `setItem`, `removeItem` using `idb-keyval`
- [x] Task: Create LocalStorage to IndexedDB migration utility [commit: 5e3ae82]
    - [x] Write tests ensuring data is correctly read from LS and written to IDB
    - [x] Implement migration logic (run once on startup)
- [x] Task: Update `src/store/useStore.ts` to use new persistence adapter [commit: 384d1be]
    - [x] Verify store still initializes correctly
- [x] Task: Conductor - User Manual Verification 'Phase 1: IndexedDB Persistence Migration' (Protocol in workflow.md) [commit: 38bb507]

## Phase 2: Local Archived State Separation [checkpoint: 75ca144]
- [x] Task: Create `createArchivedTaskSlice` [commit: de380a7, 96314e2]
    - [x] Write tests for `archivedTaskSlice` (add, remove, search)
    - [x] Implement the slice with `archivedTasks` array
- [x] Task: Refactor `createTaskSlice` archiving logic [commit: 109a99b]
    - [x] Update tests: `archiveTask` should now remove from `tasks` and call `archivedSlice.add`
    - [x] Implement `archiveTask` and `unarchiveTask` to move data between slices
- [x] Task: Update UI Components [commit: 9913f49, f641242]
    - [x] Update `ArchivedView.tsx` to consume `archivedTasks` from new slice
    - [x] Update `TaskSearch.tsx` to search both slices
    - [x] Update `Dashboard.tsx` stats calculations to include/exclude archived as needed
- [x] Task: Conductor - User Manual Verification 'Phase 2: Local Archived State Separation' (Protocol in workflow.md) [checkpoint: 75ca144]

## Phase 3: Cloud Architecture (Supabase) [checkpoint: 1b0ba00]
- [x] Task: Create Supabase Migration for `archived_tasks` table [commit: 6cd392e]
    - [x] Create SQL file in `supabase/migrations` (mirror `tasks` schema)
    - [x] Apply migration (or provide instructions)
- [x] Task: Update `syncEngine.ts` [commit: d28be47]
    - [x] Write tests for `syncArchivedTasks`
    - [x] Implement `syncArchivedTasks` (fetch only on demand/view)
    - [x] Update `syncTasks` to strictly work with `tasks` table (active)
    - [x] Implement "Move" logic in sync (delete from one table, insert into other)
- [x] Task: Update `useRealtimeSync.ts` [commit: 1557259]
    - [x] Add subscription to `archived_tasks` table (optional, or only when view is open)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Cloud Architecture (Supabase)' (Protocol in workflow.md) [checkpoint: 1b0ba00]

## Phase 4: Data Migration & Cleanup
- [ ] Task: Implement "One-time" Data Migration (Logic)
    - [ ] Write logic to detect old "isArchived: true" tasks in `tasks` table and move them to `archived_tasks`
    - [ ] Ensure this runs safely for both Local and Cloud data
- [ ] Task: Verify Free-to-Pro Upgrade Sync
    - [ ] Ensure local archived tasks are uploaded to `archived_tasks` upon upgrade
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Data Migration & Cleanup' (Protocol in workflow.md)

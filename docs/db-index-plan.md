# TaskFlow MongoDB Index Plan (VAN-7)

## Collections

### `users`
| Index | Type | Purpose |
|-------|------|---------|
| `{ email: 1 }` | unique | Login lookup; enforce one account per email |

`_id` is the implicit primary key; no other indexes for MVP.

### `tasks`
| Index | Type | Purpose |
|-------|------|---------|
| `{ userId: 1, isDeleted: 1, status: 1 }` | compound | Default list scope: a user's live tasks filtered by status (dashboard counts, `/tasks` filter dropdown) |
| `{ userId: 1, dueDate: 1 }` | compound | Sort/filter by due date; overdue calc in dashboard aggregation |
| `{ userId: 1, priority: 1 }` | compound | Filter by priority; supports "High priority" widget |
| `{ userId: 1, title: "text", description: "text" }` | text | Search box on `/tasks` (`q` query param) |
| `{ userId: 1 }` | single | Implicit via above; covers per-user scans |
| `{ isDeleted: 1 }` | single | Background sweeps over soft-deleted rows (future cleanup job) |

Each index is `userId`-prefixed so all reads are partitioned by tenant from the leftmost field. This keeps every list query bounded to a single user's working set and avoids collection scans as the table grows.

## Why these and not more
- No index on `category` or `createdAt` alone: read patterns always combine with `userId`; the compound prefixes already cover them via in-memory filter on the small per-user result set.
- No standalone `{ userId }` index defined — Mongoose creates it via `index: true` on the field; the compound `{ userId, isDeleted, status }` also serves prefix queries on `userId` alone.

## Aggregation: dashboard stats
Single pipeline groups counts per user — total / pending / inProgress / completed / overdue. See `src/lib/aggregations/dashboardStats.ts`. Driven off `{ userId, isDeleted, status }` and `{ userId, dueDate }` indexes.

```js
[
  { $match: { userId, isDeleted: false } },
  { $group: {
      _id: null,
      total: { $sum: 1 },
      pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
      inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
      completed:  { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
      overdue:    { $sum: { $cond: [{ $and: [
                      { $ne: ["$status", "Completed"] },
                      { $ne: ["$dueDate", null] },
                      { $lt: ["$dueDate", new Date()] }
                  ] }, 1, 0] } }
  } },
  { $project: { _id: 0, total: 1, pending: 1, inProgress: 1, completed: 1, overdue: 1 } }
]
```

## Connection helper
`src/lib/mongodb.ts` caches `mongoose.connect()` on `globalThis` so Next.js App Router (which hot-reloads route modules in dev) does not exhaust the connection pool. Pool size 10 fits Vercel/Node defaults; bump for production load.

## Migrations
MVP relies on Mongoose `autoIndex` (default `true` in non-production). For production, run `User.syncIndexes()` and `Task.syncIndexes()` once at boot or via a migration script — do NOT leave `autoIndex` enabled in prod.

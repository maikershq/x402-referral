# Database Configuration

## Automatic Database Detection

The app automatically selects the appropriate database based on your environment variables:

### PostgreSQL (Production) ✅
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

When `DATABASE_URL` is set, the app uses PostgreSQL with connection pooling (min: 2, max: 10).

**Recommended for:**
- Production deployments
- Neon, Supabase, Railway, Render
- AWS RDS, Google Cloud SQL
- Any PostgreSQL provider

### SQLite (Development)
```bash
DATABASE_PATH=./data/referrals.db
```

When `DATABASE_URL` is NOT set, the app uses SQLite.

**Recommended for:**
- Local development
- Testing
- Simple deployments

## Your Current Setup

You have Neon PostgreSQL configured:
```
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-sweet-bread-...neon.tech/neondb
```

✅ The app will automatically use PostgreSQL with your Neon database.

## Dependencies

The following packages are included:
- `pg` - PostgreSQL driver
- `better-sqlite3` - SQLite driver (fallback)
- `knex` - SQL query builder (works with both)

## Migration

To switch between databases:

**From SQLite to PostgreSQL:**
1. Set `DATABASE_URL` in `.env`
2. Remove or comment out `DATABASE_PATH`
3. Restart the app
4. Tables auto-initialize on first run

**From PostgreSQL to SQLite:**
1. Remove `DATABASE_URL` from `.env`
2. Set `DATABASE_PATH` (or use default)
3. Restart the app

## Connection Pooling (PostgreSQL only)

The PostgreSQL connection uses a pool:
- **Min connections**: 2
- **Max connections**: 10

Adjust in `app/lib/db/client.ts` if needed.

## Notes

- Tables auto-initialize on first API call
- Schema is identical for both databases
- No migration needed when switching
- Repository pattern abstracts database implementation


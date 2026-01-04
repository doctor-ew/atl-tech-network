# Database Setup Guide

## Vercel Postgres (Neon) Setup

### 1. Create Database on Vercel

1. Go to your Vercel dashboard: https://vercel.com/doctor-ew-labs/atl-tech-network
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., `atl-tech-network-db`)
6. Select your preferred region (choose closest to your users)
7. Click **Create**

### 2. Connect to Your Project

Vercel will automatically add the database environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Install Required Package

```bash
bun add @vercel/postgres
```

### 4. Run Migrations

Once connected, you need to run the SQL migrations:

#### Option A: Via Vercel Dashboard
1. Go to Storage → Your Database
2. Click on the **Query** tab
3. Copy and paste the contents of `db/migrations/001_initial_schema.sql`
4. Click **Run Query**
5. Then run `db/seed.sql` to add initial tags

#### Option B: Via CLI (if you have psql installed)
```bash
psql $POSTGRES_URL < db/migrations/001_initial_schema.sql
psql $POSTGRES_URL < db/seed.sql
```

#### Option C: Create a migration script
Add to `package.json`:
```json
{
  "scripts": {
    "db:migrate": "vercel env pull .env.local && psql $(grep POSTGRES_URL .env.local | cut -d '=' -f2-) < db/migrations/001_initial_schema.sql"
  }
}
```

### 5. Migrate Existing Data (Optional)

To migrate your existing hardcoded data from `lib/sample-data.ts` to the database, you can create a seed script:

```bash
# Create a script to migrate data
bun run scripts/migrate-data.ts
```

## Database Schema

### Tables

- **resources**: Main table for all resources (meetups, conferences, online resources, tech hubs)
- **tags**: Available tags
- **resource_tags**: Many-to-many relationship between resources and tags
- **submissions**: User submissions pending approval

### Resource Types
- `meetup`
- `conference`
- `online`
- `tech-hub`

### Resource Status
- `pending`: Awaiting approval
- `approved`: Visible on the site
- `rejected`: Not approved

## API Routes

### Submit a Resource
```
POST /api/submissions
```

**Body:**
```json
{
  "type": "meetup",
  "name": "New Tech Meetup",
  "description": "Description here",
  "link": "https://example.com",
  "image": "https://example.com/image.png",
  "tags": ["JavaScript", "React"],
  "submittedBy": "John Doe",
  "submitterEmail": "john@example.com"
}
```

### Get Submissions (Admin)
```
GET /api/submissions?status=pending
```

## Local Development

1. Copy `.env.local.example` to `.env.local`
2. Add your database credentials from Vercel
3. Run migrations
4. Start development server: `bun run dev`

## Production

The database is automatically connected to your Vercel deployment. No additional configuration needed!

## Next Steps

1. ✅ Set up Vercel Postgres database
2. ✅ Run migrations
3. 🔄 Migrate existing data (optional - can keep using sample-data.ts for now)
4. 🔄 Update pages to fetch from database instead of sample-data.ts
5. 🔄 Create admin panel to approve submissions
6. 🔄 Add email notifications for new submissions

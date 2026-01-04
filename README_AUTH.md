# Authentication Setup Guide

## Overview

This project uses **Auth.js (NextAuth.js v5)** with Vercel Postgres (Neon) for authentication.

**Features:**
- GitHub OAuth login
- Google OAuth login
- User profiles synced to Postgres
- Session management
- Protected routes

## Setup Steps

### 1. Generate Auth Secret

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
AUTH_SECRET=<your-generated-secret>
```

### 2. Run Auth Migrations

Run the auth schema migration in your Vercel Postgres database:

**Via Vercel Dashboard:**
1. Go to Storage → neon-pink-umbrella
2. Click **Query** tab
3. Copy and paste `db/migrations/002_auth_schema.sql`
4. Click **Run Query**

**Via CLI:**
```bash
psql $POSTGRES_URL < db/migrations/002_auth_schema.sql
```

### 3. Set Up GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Atlanta Tech Network
   - **Homepage URL**: `https://atl-tech-network.vercel.app` (or your domain)
   - **Authorization callback URL**: `https://atl-tech-network.vercel.app/api/auth/callback/github`
   - For local dev: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy **Client ID** and **Client Secret**
6. Add to `.env.local`:
   ```
   AUTH_GITHUB_ID=<your-client-id>
   AUTH_GITHUB_SECRET=<your-client-secret>
   ```

### 4. Set Up Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing)
3. Click **Create Credentials** → **OAuth client ID**
4. Configure consent screen if needed
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - `https://atl-tech-network.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
7. Click **Create**
8. Copy **Client ID** and **Client Secret**
9. Add to `.env.local`:
   ```
   AUTH_GOOGLE_ID=<your-client-id>
   AUTH_GOOGLE_SECRET=<your-client-secret>
   ```

### 5. Add to Vercel Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables**

Add these variables:
- `AUTH_SECRET`
- `AUTH_URL` (set to your production URL, e.g., `https://atl-tech-network.vercel.app`)
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

## Usage

### Sign In
Users can sign in at `/auth/signin` or by clicking the "Sign In" button in the navigation.

### Check Auth Status
```typescript
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    return <div>Not authenticated</div>
  }

  return <div>Welcome {session.user.name}!</div>
}
```

### Client-Side Auth
```typescript
"use client"

import { useSession } from "next-auth/react"

export function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Not logged in</div>

  return <div>Hello {session.user.name}</div>
}
```

### Protected API Routes
```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ data: "Protected data" })
}
```

## Database Schema

### Tables Created
- `users` - User accounts
- `accounts` - OAuth provider data
- `sessions` - Active sessions
- `verification_tokens` - Email verification tokens
- `user_profiles` - Extended user data (bio, company, social links, admin status)

### User Profile Fields
- `bio` - User biography
- `company` - Current company
- `location` - Location
- `website` - Personal website
- `github_username` - GitHub username
- `twitter_username` - Twitter/X username
- `linkedin_username` - LinkedIn username
- `is_admin` - Admin flag
- `can_approve_submissions` - Can approve resource submissions

## Next Steps

1. ✅ Run auth migrations
2. ✅ Set up GitHub OAuth
3. ✅ Set up Google OAuth
4. ✅ Add environment variables to Vercel
5. 🔄 Test sign in locally
6. 🔄 Deploy and test in production
7. 🔄 Create admin panel for user management
8. 🔄 Link submissions to user accounts

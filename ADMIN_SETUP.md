# Admin Setup Guide

## Overview

This application uses SQLite instead of Supabase and implements Google OAuth authentication for admin access. Admins can manage quote requests and MDX files through the `/admin` route.

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

Note: You may need to approve better-sqlite3 build scripts:
```bash
pnpm approve-builds better-sqlite3
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - Development: `http://localhost:3004/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Emails (comma-separated list)
# Users with these emails will automatically get admin access when they sign in
ADMIN_EMAILS=admin@ousamo.sarl,another@ousamo.sarl

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET=your-nextauth-secret-key-here-generate-a-random-string

# Email Configuration (optional - for quote notifications)
RESEND_API_KEY=your-resend-api-key-here
NEXT_PUBLIC_ADMIN_EMAIL=support@ousamo.sarl
```

**Important:** Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

### 4. Database

The SQLite database will be automatically created in `data/database.sqlite` when you first run the application. The database includes:

- `quote_requests` - All submitted quote requests
- `users` - User accounts (with admin flags)
- `sessions` - Active sessions
- `accounts` - OAuth account links

### 5. Running the Application

```bash
pnpm dev
```

The application will run on `http://localhost:3004`

## Admin Access

### First Time Login

1. Navigate to `/auth/signin` or try to access `/admin`
2. Click "Continue with Google"
3. Sign in with a Google account
4. If the email is in the `ADMIN_EMAILS` environment variable, you'll automatically have admin access

### Admin Features

Once logged in as an admin, you can access:

- `/admin` - Main dashboard
- `/admin/quotes` - View and manage all submitted quote requests
  - View all quotes with details
  - Update quote status (pending/completed)
  - Delete quotes
- `/admin/mdx` - Manage MDX realisation files
  - View all MDX files
  - Create new MDX files
  - Edit existing MDX files
  - Delete MDX files
  - View file content and frontmatter

## MDX File Structure

MDX files are stored in `content/realisations/` and follow this structure:

```mdx
---
title: "Project Title"
description: "Project description"
category: "Category Name"
year: 2024
image: "/placeholder.svg"
images:
  - "/image1.jpg"
  - "/image2.jpg"
stats:
  - label: "Stat Label"
    value: "Stat Value"
highlights:
  - "Highlight 1"
  - "Highlight 2"
---

Your markdown content here...
```

## API Routes

### Public Routes
- `POST /api/quote/submit` - Submit a quote request

### Admin Routes (Requires Authentication)
- `GET /api/admin/quotes` - Get all quote requests
- `GET /api/admin/quotes/[id]` - Get a specific quote
- `PATCH /api/admin/quotes/[id]` - Update quote status
- `DELETE /api/admin/quotes/[id]` - Delete a quote
- `GET /api/admin/mdx` - Get all MDX files
- `GET /api/admin/mdx/[slug]` - Get a specific MDX file
- `POST /api/admin/mdx` - Create a new MDX file
- `PUT /api/admin/mdx/[slug]` - Update an MDX file
- `DELETE /api/admin/mdx/[slug]` - Delete an MDX file

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Check that the `data/` directory exists and is writable
2. Delete `data/database.sqlite` to reset the database (you'll lose all data)
3. Restart the application to recreate the database

### Authentication Issues

- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify redirect URIs match in Google Cloud Console
- Check that `NEXTAUTH_URL` matches your current domain
- Make sure `NEXTAUTH_SECRET` is set and not empty

### Admin Access Issues

- Verify your email is in the `ADMIN_EMAILS` environment variable
- Check that the email in your Google account matches exactly (case-sensitive)
- Try signing out and signing back in

## Security Notes

- Never commit `.env.local` or `.env` files
- The database file (`data/database.sqlite`) is in `.gitignore`
- Admin access is determined by email matching in `ADMIN_EMAILS`
- All admin routes require authentication and admin status


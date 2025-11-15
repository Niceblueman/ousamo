# Copilot Instructions for OUSAMO

## Project Overview
Next.js 16 (App Router) industrial metalwork website with SQLite database, NextAuth Google OAuth admin system, bilingual (FR/EN) support, and MDX-based portfolio management. Core focus: quote request wizard, admin dashboard, and portfolio showcase.

## Tech Stack & Dependencies
- **Framework**: Next.js 16 with React 19, TypeScript, App Router
- **Database**: Prisma ORM with SQLite (file-based, `data/database.sqlite`)
- **Auth**: NextAuth 5.0 beta with Google OAuth provider + Prisma adapter
- **Styling**: Tailwind CSS 4 + shadcn/ui components (new-york style)
- **Content**: MDX files in `content/realisations/` for portfolio items
- **State**: React Context for theme/language (no Redux/Zustand)
- **Testing**: Jest + React Testing Library
- **Package Manager**: pnpm (port 3004 for dev server)

## Architecture Patterns

### Database Layer (`lib/db.ts` + `prisma/schema.prisma`)
- Prisma Client singleton pattern: `prisma` exported from `lib/db.ts`
- Schema-first approach: Models defined in `prisma/schema.prisma`
- Tables: `User`, `Account`, `Session`, `VerificationToken`, `QuoteRequest`, `NewsletterSubscription`
- Database migrations via `prisma db push` (development) or `prisma migrate` (production)
- Data directory created automatically at `data/`
- Logging enabled in development: `["query", "error", "warn"]`

### Authentication Flow
- `@auth/prisma-adapter` with custom wrapper in `app/api/auth/[...nextauth]/route.ts`
- Admin access controlled via `ADMIN_EMAILS` env var (comma-separated)
- `isAdmin` flag set on user creation based on email match
- Users auto-subscribed to newsletter on Google sign-in (async)
- Session checks: `requireAdmin()` in `lib/auth.ts` throws on unauthorized
- Admin routes protected in layout with `SessionProvider`

### Internationalization (i18n)
- Client-side only, Context-based (`components/language-provider.tsx`)
- Translations: `lib/translations/{fr,en}.json`
- Storage key: `ousamo-language` (localStorage)
- Access via `useLanguage()` hook → `t('key.path')`
- Default language: French (`fr`)

### Client/Server Component Split
- All interactive components marked `"use client"` (forms, theme switcher, animations)
- Server components for data fetching (admin pages, realisation loading)
- Providers (Theme, Language) wrap app in `app/layout.tsx`

## Critical Workflows

### Development
```bash
pnpm dev              # Port 3004
pnpm build            # Production build
pnpm test             # Run Jest tests
pnpm test:watch       # Watch mode
prisma studio         # GUI for database inspection
prisma db push        # Sync schema with database (dev)
prisma generate       # Regenerate Prisma Client
```

### Admin Setup
1. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS` in `.env.local`
2. Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
3. Run `pnpm prisma db push` to create database schema
4. Database file auto-created at `data/database.sqlite`
5. See `ADMIN_SETUP.md` for full OAuth setup

### Quote Submission Flow
1. Data loaded from `data/quote-options.json` via `/api/quote/data`
2. Wizard state managed in `quote-wizard-container.tsx` (client component)
3. Submission to `/api/quote/submit` → Prisma insert + optional Resend email
4. Validation: all steps + contact fields required
5. Admin views in `/admin/quotes` with status updates (Prisma queries)

### MDX Portfolio Management
- Files: `content/realisations/*.mdx`
- Frontmatter: title, description, category, year, image, images[], stats[], highlights[]
- Loader: `lib/mdx-loader.ts` with gray-matter + marked
- Admin CRUD at `/admin/mdx` (create/edit/delete files)
- Public view: `/realisations` with client-side filtering

## Project-Specific Conventions

### Styling
- Theme variants: `dark`, `dark-blue`, `dark-amber` (storage key: `ousamo-theme`)
- Component composition: shadcn/ui + Radix primitives
- Animations: Framer Motion for page transitions, cards, counters
- Utility function: `cn()` in `lib/utils.ts` for className merging

### API Routes
- All POST routes validate required fields explicitly (no middleware)
- Error responses: `{ error: string }` with appropriate status codes
- Success responses: `{ success: boolean, data?: any }`
- Logging prefix pattern: `[Module Name]` (e.g., `[Quote Submit]`)

### File Organization
- UI components: `components/ui/` (shadcn)
- Feature components: `components/` (business logic)
- API routes: `app/api/{feature}/{action}/route.ts`
- Admin pages: `app/admin/{feature}/page.tsx`

## Environment Variables
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAILS=admin@ousamo.sarl
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET=...
RESEND_API_KEY=...          # Optional for emails
NEXT_PUBLIC_ADMIN_EMAIL=support@ousamo.sarl
```

## Testing Patterns
- API tests: Mock Prisma Client using `jest.mock('@prisma/client')`
- Component tests: Wrap with providers (Theme, Language)
- Test files: `__tests__/{api,components,lib}/*.test.{ts,tsx}`
- Manual scripts: `scripts/test-quote-*.js` for integration testing
- Prisma mocking: Use `prismock` or manual mock with jest

## Common Pitfalls
- **Database**: Prisma Client auto-generated; run `prisma generate` after schema changes
- **Migrations**: Use `prisma db push` in dev; `prisma migrate dev` for production-ready migrations
- **Auth**: Check `(session.user as any).isAdmin` for admin flag (type assertion needed)
- **Newsletter**: `subscribeToNewsletter()` is async; must await in API routes
- **i18n**: Translation keys use dot notation (`hero.title`), fallback to French
- **MDX**: Ensure `content/realisations/` exists before `getRealisations()` call
- **Build**: ESLint/TypeScript errors ignored in `next.config.mjs` (fix before prod)
- **Port**: Dev server on 3004, update OAuth redirect URIs accordingly

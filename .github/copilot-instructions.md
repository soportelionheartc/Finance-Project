# Zupi Fintech - AI Coding Instructions

## Architecture Overview

Full-stack TypeScript monorepo: React (Vite) + Express backend, single server on port 5000.

```
client/src/         # React frontend with shadcn/ui
  pages/            # Route-level components (one per page)
  components/       # Reusable UI (ui/ for shadcn, finance/ for domain)
  hooks/            # Custom hooks (use-auth.tsx is the auth context)
  lib/              # Utilities (queryClient.ts, protected-route.tsx)
server/             # Express backend
  routes.ts         # Main API route registration
  auth.ts           # Passport.js setup (local + Google OAuth2)
  storage.ts        # Data access layer implementing IStorage interface
  db.ts             # Drizzle ORM connection
shared/             # Shared between client/server
  schema.ts         # Drizzle schema + Zod validation (source of truth)
```

## Key Development Commands

```bash
npm run dev          # Start dev server (tsx server/index.ts)
npm run db:push      # Push schema changes to PostgreSQL
npm run build        # Build for production (Vite + esbuild)
npm run check        # TypeScript type checking
```

## Database & Schema Patterns

- Schema defined in `shared/schema.ts` using Drizzle ORM with Zod validation
- Insert schemas generated via `createInsertSchema()` with `.omit()` for auto-fields
- Storage layer in `server/storage.ts` provides `IStorage` interface abstraction
- Migrations in `/migrations` folder, push changes via `npm run db:push`

Example pattern for new entity:
```typescript
// shared/schema.ts
export const myTable = pgTable("my_table", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  // fields...
  createdAt: timestamp("created_at").defaultNow(),
});
export const insertMyTableSchema = createInsertSchema(myTable).omit({ id: true, createdAt: true });
```

## API Patterns

- All API routes prefixed with `/api/`
- Authentication middleware: `ensureAuthenticated` guards protected endpoints
- Admin-only routes use `isAdmin` middleware from `server/auth.ts`
- Finance routes in `server/financeRoutes.ts`, forum in `server/forumRoutes.ts`

Client-side API calls:
```typescript
// Use apiRequest for mutations (handles JSON + credentials)
import { apiRequest } from "@/lib/queryClient";
const res = await apiRequest("POST", "/api/endpoint", data);

// Use TanStack Query for data fetching
const { data } = useQuery({ queryKey: ["/api/endpoint"] });
```

## Authentication Flow

- Session-based auth with Passport.js (local strategy + Google OAuth2)
- `useAuth()` hook provides: `user`, `isLoading`, `isAdmin`, login/logout mutations
- Route protection: `<ProtectedRoute>` for authenticated, `<AdminRoute>` for admin
- Special users: `jplhc` (admin), `juanpablo13` (blockchain features)

## UI Conventions

- shadcn/ui components in `client/src/components/ui/` - use existing components
- Dark theme with gold primary color (`#FFC107`) - Lion Heart Capital branding
- Routing via `wouter` library (not react-router)
- Icons from `lucide-react`
- Styling: Tailwind CSS with CSS variables for theming (see `theme.json`)

Component pattern:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
```

## Project-Specific Notes

- Bilingual support: Spanish (primary) and English
- Blockchain integration: Ethereum (MetaMask), Solana (Phantom) via `ethers` and `@solana/web3.js`
- OpenAI integration for financial advice (optional, requires `OPENAI_API_KEY`)
- Environment variables: `DATABASE_URL`, `SESSION_SECRET`, optional API keys in `.env`

## Common Pitfalls

- Import shared schema types from `@shared/schema` (path alias configured)
- Sessions require `credentials: "include"` on fetch calls
- Port 5000 serves both API and static files - no separate ports
- Use `real` type for monetary values in Drizzle (not `decimal`)

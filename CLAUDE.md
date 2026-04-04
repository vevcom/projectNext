# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Next is the website for Sanctus Omega Broderskab, built with Next.js 16, TypeScript, Prisma, and PostgreSQL. The application runs in Docker containers for both development and production.

## Development Commands

### Running the Application

```bash
npm run docker:dev
```
or
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Testing

Run all tests:
```bash
npm test
```

Tests use Jest with a custom Prisma test environment. The environment variable `IGNORE_SERVER_ONLY=true` is required for tests.

### Linting

```bash
npm run lint
```

Auto-fix linting errors:
```bash
npm run lint -- --fix
```

### Database Operations

Reseed the database (deletes all data and re-seeds):
```bash
npm run docker:seed
```

Regenerate Prisma client after schema changes:
```bash
npx prisma generate
```

Access Prisma Studio for database exploration:
```bash
npm run prisma-studio
```

Access the container shell:
```bash
docker exec -it -w /workspaces/projectNext pn-dev /bin/bash
```

## Architecture

### Service Layer Pattern

The codebase uses a ServiceOperation pattern for all business logic. Services are located in `src/services/` and organized by domain (e.g., `users`, `groups`, `cms`, `events`).

**Key concepts:**
- **ServiceOperation**: Core abstraction defined in `src/services/serviceOperation.ts`. All business logic is wrapped in ServiceOperations.
- **Server Actions**: Client-callable functions created by wrapping ServiceOperations with `makeAction()` from `src/services/serverAction.ts`.
- **Authorization**: Custom authorization system with Authorizer classes (see `src/auth/authorizer/`). Each ServiceOperation specifies its required permissions.
- **Transaction Management**: The `opensTransaction` flag signals that a ServiceOperation will open its own database transaction. Since transactions cannot be nested, this allows the type system and runtime validation to prevent calling such operations from within an existing transaction.

**Pattern example:**
```typescript
// Define a ServiceOperation
const myServiceOperation = defineOperation({
  paramsSchema: z.object({ id: z.number() }),
  dataSchema: z.object({ name: z.string() }),
  authorizer: ({ params }) => MyAuthorizer.dynamicFields({ id: params.id }),
  operation: async ({ params, data, session, prisma }) => {
    // Business logic here
  }
})

// Wrap it as a Server Action for client use
export const myAction = makeAction(myServiceOperation)
```

### Service Folder Structure

Each service domain follows a standard file layout. See `src/services/omegaquotes/` as the canonical example:

```
src/services/[domain]/
├── actions.ts      # 'use server' — makeAction() wrappers, one per operation
├── auth.ts         # Authorizer definitions (RequirePermission.staticFields etc.)
├── constants.ts    # Domain constants and config values (env vars, field selections)
├── operations.ts   # defineOperation() calls, exported as `{ ... } as const`
├── schemas.ts      # Plain Zod schemas (no ValidationBase)
└── types.ts        # TypeScript types specific to this domain (if needed)
```

Rules:
- **`constants.ts`** — not `ConfigVars.ts` or any other name
- **`operations.ts`** — the exported object must end with `as const`
- **`actions.ts`** — must have `'use server'` at the top; only calls `makeAction()`
- Sub-domains (e.g. `mail/alias/`) follow the same layout within their subfolder

### Prisma Schema Organization

Prisma schemas are split into multiple domain-specific files in `src/prisma/schema/`:
- `schema.prisma` - Main configuration (generator, datasource)
- `user.prisma`, `group.prisma`, `cms.prisma`, etc. - Domain models

The Prisma client is generated to `generated/pn-prisma/` outside the src folder.

### Authentication

- Uses NextAuth.js v4 with custom JWT tokens
- Auth configuration in `src/auth/nextAuth/`
- Session management via `ServerSession` and `Session` classes
- Custom visibility and authorization system

### Path Aliases

The project uses extensive TypeScript path aliases (see `tsconfig.json`):
- `@/lib/*` → `src/lib/*`
- `@/components/*` → `src/app/_components/*`
- `@/services/*` → `src/services/*`
- `@/prisma-pn-client-instance` → `src/prisma/client.ts`
- `@/prisma-generated-pn-client` → `generated/pn-prisma/client.ts`
- Many more domain-specific aliases

### Project Structure

```
src/
├── app/                    # Next.js app directory (pages, routes, layouts)
│   ├── _components/        # Shared React components
│   ├── api/                # API routes (NextAuth, etc.)
│   ├── admin/              # Admin pages
│   └── [feature]/          # Feature-specific pages
├── auth/                   # Authentication & authorization
│   ├── authorizer/         # Authorization classes
│   ├── session/            # Session management
│   └── nextAuth/           # NextAuth configuration
├── services/               # Business logic layer (ServiceOperations)
│   ├── users/
│   ├── groups/
│   ├── cms/
│   └── [domain]/           # Domain-specific services
├── prisma/                 # Database
│   ├── schema/             # Prisma schema files (split by domain)
│   ├── seeder/             # Database seeding
│   └── client.ts           # Prisma client instance
├── lib/                    # Utility libraries
│   ├── jwt/                # JWT token utilities
│   ├── dates/              # Date handling (Luxon)
│   └── paging/             # Pagination utilities
├── contexts/               # React contexts
├── hooks/                  # React hooks
├── styles/                 # Global SCSS styles
└── typings/                # TypeScript type definitions

generated/
└── pn-prisma/              # Generated Prisma client
```

### CMS System

The project includes a custom CMS for content management:
- CMS components in `src/app/_components/Cms/`
- CMS services in `src/services/cms/`
- Articles, sections, paragraphs, images, and links as composable content parts
- Edit mode for authorized users

## Important Patterns

### Server-Only Code

Files that must run only on the server import `'@pn-server-only'` at the top. This is enforced to prevent accidental client-side execution of sensitive code.

### Error Handling

- Service operations use custom error classes from `src/services/error.ts`
- `Smorekopp` - Base error class for service errors
- `ParseError` - Validation/parsing errors
- Error handling is managed internally by the ServiceOperation system via `makeAction()`

### Calling Actions from the Frontend

**IMPORTANT**: Frontend code (`src/app/`) must NEVER import from `operations.ts` directly. Always go through `actions.ts`. This applies to both server components (pages) and client components.

In server components (pages), use `unwrapActionReturn` from `@/app/redirectToErrorPage` to unwrap the result — it returns the data directly on success and redirects to the error page on failure:

```typescript
import { readMailAliasesAction } from '@/services/mail/alias/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'

const aliases = unwrapActionReturn(await readMailAliasesAction())
```

Action call signatures depend on whether the operation has `paramsSchema` and/or `dataSchema`:
- No schemas → `action()`
- `paramsSchema` only → `action({ params: { ... } })`
- `dataSchema` only → `action({ data: { ... } })` or `action(formData)`
- Both → `action({ params: { ... } }, { data: { ... } })`

### Authorization in Client Components

In `'use client'` components, use the `useAuthorizer` hook from `@/hooks/useAuthorizer` instead of calling `useSession()` and checking `session.loading` manually. It handles the loading state internally and returns an `AuthResult` with an `authorized` boolean:

```typescript
import useAuthorizer from '@/hooks/useAuthorizer'
import { someAuth } from '@/services/some/auth'

const canDoThing = useAuthorizer({ authorizer: someAuth.operation.dynamicFields({}) }).authorized
```

Never do this manually in client components:
```typescript
const session = useSession()
const canDoThing = !session.loading && someAuth.operation.dynamicFields({}).auth(session.session).authorized
```

### Form Handling

Forms typically use Server Actions with FormData:
1. Define a dataSchema using `zod-form-data` (`zfd`)
2. Create a ServiceOperation with the schema
3. Wrap it with `makeAction()`
4. Call from a client component with FormData

## Testing

- Tests located in `tests/` directory
- Custom Prisma test environment (`tests/PrismaTestEnvironment.ts`)
- Test setup in `tests/setup.ts`
- Use `IGNORE_SERVER_ONLY=true` environment variable when running tests
- Use full variable names in callbacks — no single-letter identifiers (ESLint `id-length` rule). Use the domain name itself (e.g. `group => group.id`, `user => user.id`) as long as there are no collisions.

## Migration from OmegaWeb Basic

The project includes migration tooling from an older system (OmegaWeb Basic):
- Schema in `src/prisma/owSchema/`
- Migration command: `npm run dobbelOmega:run`
- Only relevant for data migration tasks

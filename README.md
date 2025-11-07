# @raburski/next-api-middleware

Generic middleware utilities and types for Next.js API routes.

## Installation

```bash
npm install @raburski/next-api-middleware
```

## Features

- Generic TypeScript types for API handlers and middleware
- Reusable middleware utilities
- Type-safe API route composition

## Types

### `APIContext<T>`

Generic context type for API handlers that includes:
- `params`: Route parameters
- `session`: Optional session data
- `resource`: Optional resource data
- Additional custom properties

### `APIHandler<T>`

Generic handler function type for API endpoints.

### `Middleware`

Middleware function type that transforms a handler.

## Middleware

### `withResourceExists`

Generic middleware that ensures a resource exists and adds it to the context.

```typescript
import { withResourceExists } from "@raburski/next-api-middleware"
import { db } from "@/server/db"

// Simple usage
const withBuildingExists = withResourceExists(
	(id: string) => db.building.findUnique({ where: { id } }),
	"Building"
)

// With custom error message
const withUserExists = withResourceExists(
	(id: string) => db.user.findUnique({ where: { id } }),
	"User",
	{ errorMessage: "User not found" }
)

// With custom param name
const withCommentExists = withResourceExists(
	(id: string) => db.comment.findUnique({ where: { id } }),
	"Comment",
	{ paramName: "commentId" }
)

// Usage in API route
export const GET = compose(
	withBuildingExists,
	withAuth
)(getBuilding)
```

## License

MIT


import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { Middleware, APIHandler, APIContext } from "./types"

/**
 * Generic middleware that ensures a resource exists and adds it to the context.
 * 
 * @param finder - Function that takes an ID and returns the resource or null
 * @param resourceName - Name of the resource for error messages (e.g., "Building", "User")
 * @param options - Optional configuration
 * @returns Middleware function
 * 
 * @example
 * ```typescript
 * // Simple usage with a finder function
 * const withBuildingExists = withResourceExists(
 *   (id: string) => db.building.findUnique({ where: { id } }),
 *   "Building"
 * )
 * 
 * // Usage with custom error message
 * const withUserExists = withResourceExists(
 *   (id: string) => db.user.findUnique({ where: { id } }),
 *   "User",
 *   { errorMessage: "User not found" }
 * )
 * 
 * // Usage with custom param name
 * const withCommentExists = withResourceExists(
 *   (id: string) => db.comment.findUnique({ where: { id } }),
 *   "Comment",
 *   { paramName: "commentId" }
 * )
 * ```
 */
export function withResourceExists<TResource>(
	finder: (id: string) => Promise<TResource | null>,
	resourceName: string,
	options?: {
		errorMessage?: string
		paramName?: string
	}
): Middleware {
	return <T>(handler: APIHandler<T>): APIHandler<T> => {
		return async (request: NextRequest, context: APIContext<T>): Promise<NextResponse> => {
			const paramName = options?.paramName || "id"
			const params = await context.params
			const id = params[paramName]

			if (!id) {
				return NextResponse.json(
					{ message: `Missing ${paramName} parameter` },
					{ status: 400 }
				)
			}

			const resource = await finder(id)

			if (!resource) {
				return NextResponse.json(
					{ message: options?.errorMessage || `${resourceName} not found` },
					{ status: 404 }
				)
			}

			// Add the resource to the context
			const newContext: APIContext<T> = {
				...context,
				resource: resource as T
			}

			return handler(request, newContext)
		}
	}
}


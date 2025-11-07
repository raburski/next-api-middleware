import { NextRequest, NextResponse } from "next/server"

/**
 * Generic context type for API handlers
 */
export type APIContext<T = any> = {
	params: Promise<Record<string, string>>
	session?: any
	resource?: T
	[key: string]: any
}

/**
 * Generic handler function type for API endpoints
 */
export type APIHandler<T = any> = (
	request: NextRequest,
	context: APIContext<T>
) => Promise<NextResponse>

/**
 * Middleware function type that transforms a handler
 */
export type Middleware = <T = any>(
	handler: APIHandler<T>
) => APIHandler<T>


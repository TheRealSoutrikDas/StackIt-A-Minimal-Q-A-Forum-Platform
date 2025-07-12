import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define protected routes
const protectedRoutes = ["/ask", "/questions/new", "/profile", "/settings"];

// Define auth routes (login/register)
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Get the token from cookies
	const token = request.cookies.get("auth-token")?.value;

	// Check if the route is protected
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// If it's a protected route and no token, redirect to login
	if (isProtectedRoute && !token) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// If it's an auth route and user is already logged in, redirect to home
	if (isAuthRoute && token) {
		try {
			// Verify the token
			const secret = new TextEncoder().encode(
				process.env.JWT_SECRET || "fallback-secret"
			);
			await jwtVerify(token, secret);

			// Token is valid, redirect to home
			return NextResponse.redirect(new URL("/", request.url));
		} catch {
			// Token is invalid, clear it and continue to auth page
			const response = NextResponse.next();
			response.cookies.set("auth-token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 0,
			});
			return response;
		}
	}

	// For API routes that need authentication
	if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
		// Skip authentication for public API routes
		const publicApiRoutes = [
			"/api/tags",
			"/api/search",
			"/api/test",
			"/api/debug",
		];

		// Allow user registration (POST to /api/users) without authentication
		const isUserRegistration =
			pathname === "/api/users" && request.method === "POST";

		// Allow GET requests to questions without authentication (for viewing)
		const isPublicQuestionGet =
			pathname === "/api/questions" && request.method === "GET";

		const isPublicApiRoute = publicApiRoutes.some(
			(route) => pathname === route || pathname.startsWith(route + "/")
		);

		if (
			!isPublicApiRoute &&
			!isUserRegistration &&
			!isPublicQuestionGet &&
			!token
		) {
			return NextResponse.json(
				{
					success: false,
					message: "Authentication required",
				},
				{ status: 401 }
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/).*)",
	],
};

import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/logout - User logout
export async function POST(request: NextRequest) {
	try {
		// Create response
		const response = NextResponse.json(
			{
				success: true,
				message: "Logout successful",
			},
			{ status: 200 }
		);

		// Clear the auth cookie
		response.cookies.set("auth-token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 0, // Expire immediately
		});

		return response;
	} catch (error) {
		console.error("Error during logout:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to logout",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

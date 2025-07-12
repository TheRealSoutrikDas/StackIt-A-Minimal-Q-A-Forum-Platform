import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/Users";
import jwt from "jsonwebtoken";

// GET /api/auth/me - Get current user information
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		// Get the token from cookies
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "No authentication token found",
				},
				{ status: 401 }
			);
		}

		// Verify the token
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("JWT_SECRET not configured");
			return NextResponse.json(
				{
					success: false,
					message: "Server configuration error",
				},
				{ status: 500 }
			);
		}

		const decoded = jwt.verify(token, jwtSecret) as any;
		const userId = decoded.userId;

		// Find the user
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// Check if user is banned
		if (user.isBanned) {
			return NextResponse.json(
				{
					success: false,
					message: "Your account has been banned",
				},
				{ status: 403 }
			);
		}

		// Return user data
		const userData = {
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			isBanned: user.isBanned,
			reputation: user.reputation,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return NextResponse.json({
			success: true,
			data: userData,
		});
	} catch (error) {
		console.error("Error getting current user:", error);

		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid authentication token",
				},
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: "Failed to get user information",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

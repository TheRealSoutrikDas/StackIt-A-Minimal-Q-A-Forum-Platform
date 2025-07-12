import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/Users";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();

		// Validate request body
		const validationResult = loginSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid request data",
					errors: validationResult.error.issues,
				},
				{ status: 400 }
			);
		}

		const { email, password } = validationResult.data;

		// Find user by email
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid email or password",
				},
				{ status: 401 }
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

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid email or password",
				},
				{ status: 401 }
			);
		}

		// Generate JWT token
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

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				username: user.username,
				role: user.role,
			},
			jwtSecret,
			{ expiresIn: "7d" }
		);

		// Return user data without password
		const userWithoutPassword = {
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			isBanned: user.isBanned,
			reputation: user.reputation,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		// Set HTTP-only cookie
		const response = NextResponse.json(
			{
				success: true,
				message: "Login successful",
				data: {
					user: userWithoutPassword,
					token,
				},
			},
			{ status: 200 }
		);

		// Set secure HTTP-only cookie
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return response;
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to login",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

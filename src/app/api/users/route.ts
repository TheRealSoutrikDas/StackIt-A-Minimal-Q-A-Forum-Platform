import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/Users";
import { z } from "zod";
import bcrypt from "bcryptjs";

const createUserSchema = z.object({
	username: z.string().min(3).max(30),
	email: z.string().email(),
	password: z.string().min(6),
});

// GET /api/users - Get all users with pagination and search
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search");

		const skip = (page - 1) * limit;

		// Build filter object
		const filter: any = {};
		if (search) {
			filter.$or = [
				{ username: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		const users = await User.find(filter)
			.select("-password") // Exclude password from response
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await User.countDocuments(filter);

		return NextResponse.json({
			success: true,
			data: users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch users",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// POST /api/users - Create a new user (register)
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();

		// Validate request body
		const validationResult = createUserSchema.safeParse(body);
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

		const { username, email, password } = validationResult.data;

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email: email.toLowerCase() }, { username }],
		});
		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: "User with this email or username already exists",
				},
				{ status: 409 }
			);
		}

		// Hash the password
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create the user
		const user = await User.create({
			username,
			email: email.toLowerCase(),
			password: hashedPassword,
			role: "user",
			isBanned: false,
			reputation: 0,
		});

		// Return user without password
		const userWithoutPassword = {
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			isBanned: user.isBanned,
			reputation: user.reputation,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return NextResponse.json(
			{
				success: true,
				message: "User created successfully",
				data: userWithoutPassword,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create user",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

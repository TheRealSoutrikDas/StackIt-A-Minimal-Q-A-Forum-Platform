import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Tag } from "@/models/Tag";
import { User } from "@/models/Users";
import { createQuestionSchema } from "@/schemas/questionSchema";
import jwt from "jsonwebtoken";

// GET /api/questions - Get all questions with pagination and filtering
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") || "desc";
		const tag = searchParams.get("tag");
		const search = searchParams.get("search");

		const skip = (page - 1) * limit;
		const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 } as const;

		// Build filter object
		const filter: Record<string, unknown> = {};
		if (tag) {
			const tagDoc = await Tag.findOne({ name: tag });
			if (tagDoc) {
				filter.tags = tagDoc._id;
			}
		}
		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		const questions = await Question.find(filter)
			.populate("author", "username reputation")
			.populate("tags", "name")
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await Question.countDocuments(filter);

		return NextResponse.json({
			success: true,
			data: questions,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching questions:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch questions",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();

		// Validate request body
		const validationResult = createQuestionSchema.safeParse(body);
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

		const { title, description, tags } = validationResult.data;

		// Get current user from JWT token
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "Authentication required",
				},
				{ status: 401 }
			);
		}

		// Verify the token and get user ID
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

		const decoded = jwt.verify(token, jwtSecret) as { userId: string };
		const currentUserId = decoded.userId;

		// Verify user exists
		const user = await User.findById(currentUserId);
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// Process tags - create if they don't exist
		const tagIds = [];
		for (const tagName of tags) {
			let tag = await Tag.findOne({ name: tagName.toLowerCase() });
			if (!tag) {
				tag = await Tag.create({
					name: tagName.toLowerCase(),
					description: `Tag for ${tagName}`,
				});
			}
			tagIds.push(tag._id);
		}

		// Create the question
		const question = await Question.create({
			title,
			description,
			tags: tagIds,
			author: currentUserId,
			votes: 0,
			views: 0,
			answers: [],
			isClosed: false,
		});

		// Populate the created question with author and tags
		const populatedQuestion = await Question.findById(question._id)
			.populate("author", "username reputation")
			.populate("tags", "name")
			.lean();

		return NextResponse.json(
			{
				success: true,
				message: "Question created successfully",
				data: populatedQuestion,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating question:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create question",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { User } from "@/models/Users";
import { createAnswerSchema } from "@/schemas/answerSchema";

// GET /api/answers - Get all answers with pagination and filtering
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const questionId = searchParams.get("questionId");
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") || "desc";

		const skip = (page - 1) * limit;
		const sort: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

		// Build filter object
		const filter: any = {};
		if (questionId) {
			filter.question = questionId;
		}

		const answers = await Answer.find(filter)
			.populate("author", "username reputation")
			.populate("question", "title")
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await Answer.countDocuments(filter);

		return NextResponse.json({
			success: true,
			data: answers,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching answers:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch answers",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// POST /api/answers - Create a new answer
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();

		// Validate request body
		const validationResult = createAnswerSchema.safeParse(body);
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

		const { questionId, content } = validationResult.data;

		// TODO: Get current user from session/auth
		// For now, we'll use a placeholder user ID
		const currentUserId = "507f1f77bcf86cd799439011"; // This should come from auth

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

		// Verify question exists
		const question = await Question.findById(questionId);
		if (!question) {
			return NextResponse.json(
				{
					success: false,
					message: "Question not found",
				},
				{ status: 404 }
			);
		}

		// Create the answer
		const answer = await Answer.create({
			content,
			author: currentUserId,
			question: questionId,
			votes: 0,
		});

		// Add answer to question's answers array
		await Question.findByIdAndUpdate(questionId, {
			$push: { answers: answer._id },
		});

		// Populate the created answer with author and question
		const populatedAnswer = await Answer.findById(answer._id)
			.populate("author", "username reputation")
			.populate("question", "title")
			.lean();

		return NextResponse.json(
			{
				success: true,
				message: "Answer created successfully",
				data: populatedAnswer,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

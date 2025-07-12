import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { z } from "zod";

const voteSchema = z.object({
	vote: z.enum(["up", "down"]),
});

// POST /api/questions/[id]/vote - Vote on a question
export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await dbConnect();

		const { id } = params;
		const body = await request.json();

		if (!id) {
			return NextResponse.json(
				{
					success: false,
					message: "Question ID is required",
				},
				{ status: 400 }
			);
		}

		// Validate request body
		const validationResult = voteSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid vote data",
					errors: validationResult.error.issues,
				},
				{ status: 400 }
			);
		}

		const { vote } = validationResult.data;

		// Check if question exists
		const question = await Question.findById(id);
		if (!question) {
			return NextResponse.json(
				{
					success: false,
					message: "Question not found",
				},
				{ status: 404 }
			);
		}

		// TODO: Get current user from session/auth
		// For now, we'll use a placeholder user ID
		const currentUserId = "507f1f77bcf86cd799439011"; // This should come from auth

		// TODO: Check if user has already voted and handle vote changes
		// For now, we'll just increment/decrement the vote count

		const voteValue = vote === "up" ? 1 : -1;

		// Update the question's vote count
		const updatedQuestion = await Question.findByIdAndUpdate(
			id,
			{ $inc: { votes: voteValue } },
			{ new: true }
		)
			.populate("author", "username reputation")
			.populate("tags", "name")
			.lean();

		return NextResponse.json({
			success: true,
			message: `Question ${vote}d successfully`,
			data: updatedQuestion,
		});
	} catch (error) {
		console.error("Error voting on question:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to vote on question",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

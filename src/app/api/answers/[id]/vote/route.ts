import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Answer } from "@/models/Answer";
import { z } from "zod";

const voteSchema = z.object({
	vote: z.enum(["up", "down"]),
});

// POST /api/answers/[id]/vote - Vote on an answer
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
					message: "Answer ID is required",
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

		// Check if answer exists
		const answer = await Answer.findById(id);
		if (!answer) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer not found",
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

		// Update the answer's vote count
		const updatedAnswer = await Answer.findByIdAndUpdate(
			id,
			{ $inc: { votes: voteValue } },
			{ new: true }
		)
			.populate("author", "username reputation")
			.populate("question", "title")
			.lean();

		return NextResponse.json({
			success: true,
			message: `Answer ${vote}d successfully`,
			data: updatedAnswer,
		});
	} catch (error) {
		console.error("Error voting on answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to vote on answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

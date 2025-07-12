import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Answer } from "@/models/Answer";
import { z } from "zod";

const acceptAnswerSchema = z.object({
	answerId: z.string(),
});

// POST /api/questions/[id]/accept-answer - Accept an answer as the best answer
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
		const validationResult = acceptAnswerSchema.safeParse(body);
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

		const { answerId } = validationResult.data;

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

		// Check if answer exists and belongs to this question
		const answer = await Answer.findById(answerId);
		if (!answer) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer not found",
				},
				{ status: 404 }
			);
		}

		if (answer.question.toString() !== id) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer does not belong to this question",
				},
				{ status: 400 }
			);
		}

		// TODO: Check if user is authorized to accept answers
		// For now, we'll allow accepting (should check if current user is the question author)

		// Update the question to mark this answer as accepted
		const updatedQuestion = await Question.findByIdAndUpdate(
			id,
			{ acceptedAnswer: answerId },
			{ new: true }
		)
			.populate("author", "username reputation")
			.populate("tags", "name")
			.populate({
				path: "answers",
				populate: {
					path: "author",
					select: "username reputation",
				},
			})
			.lean();

		return NextResponse.json({
			success: true,
			message: "Answer accepted successfully",
			data: updatedQuestion,
		});
	} catch (error) {
		console.error("Error accepting answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to accept answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { User } from "@/models/Users";
import { z } from "zod";

const updateAnswerSchema = z.object({
	content: z.string().min(5),
});

// GET /api/answers/[id] - Get a specific answer by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await dbConnect();

		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer ID is required",
				},
				{ status: 400 }
			);
		}

		const answer = await Answer.findById(id)
			.populate("author", "username reputation")
			.populate("question", "title description")
			.lean();

		if (!answer) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: answer,
		});
	} catch (error) {
		console.error("Error fetching answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// PUT /api/answers/[id] - Update an answer
export async function PUT(
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
		const validationResult = updateAnswerSchema.safeParse(body);
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

		const { content } = validationResult.data;

		// Check if answer exists
		const existingAnswer = await Answer.findById(id);
		if (!existingAnswer) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer not found",
				},
				{ status: 404 }
			);
		}

		// TODO: Check if user is authorized to edit this answer
		// For now, we'll allow editing (should check if current user is the author)

		// Update the answer
		const updatedAnswer = await Answer.findByIdAndUpdate(
			id,
			{ content },
			{ new: true }
		)
			.populate("author", "username reputation")
			.populate("question", "title")
			.lean();

		return NextResponse.json({
			success: true,
			message: "Answer updated successfully",
			data: updatedAnswer,
		});
	} catch (error) {
		console.error("Error updating answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/answers/[id] - Delete an answer
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await dbConnect();

		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer ID is required",
				},
				{ status: 400 }
			);
		}

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

		// TODO: Check if user is authorized to delete this answer
		// For now, we'll allow deletion (should check if current user is the author or admin)

		// Remove answer from question's answers array
		await Question.findByIdAndUpdate(answer.question, {
			$pull: { answers: id },
		});

		// Delete the answer
		await Answer.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: "Answer deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete answer",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

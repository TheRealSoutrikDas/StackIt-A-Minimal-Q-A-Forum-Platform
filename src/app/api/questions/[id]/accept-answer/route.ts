import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Answer } from "@/models/Answer";
import { verifyToken } from "@/lib/utils";

// POST /api/questions/[id]/accept-answer - Accept an answer for a question
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();

		const { id } = await params;
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

		const { answerId } = body;

		if (!answerId) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer ID is required",
				},
				{ status: 400 }
			);
		}

		// Get current user from token
		const token = request.cookies.get("token")?.value;
		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "Authentication required",
				},
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid token",
				},
				{ status: 401 }
			);
		}

		const userId = decoded.userId;

		// Check if question exists and user is the author
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

		// Check if user is the question author
		if (question.author.toString() !== userId) {
			return NextResponse.json(
				{
					success: false,
					message: "Only the question author can accept answers",
				},
				{ status: 403 }
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

		// Update question to accept this answer
		await Question.findByIdAndUpdate(id, {
			acceptedAnswerId: answerId,
		});

		// Update answer to mark it as accepted
		await Answer.findByIdAndUpdate(answerId, {
			isAccepted: true,
		});

		return NextResponse.json({
			success: true,
			message: "Answer accepted successfully",
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

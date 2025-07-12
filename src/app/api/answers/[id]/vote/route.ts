import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Answer } from "@/models/Answer";
import { Vote } from "@/models/Vote";
import { verifyToken } from "@/lib/utils";

// POST /api/answers/[id]/vote - Vote on an answer
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
					message: "Answer ID is required",
				},
				{ status: 400 }
			);
		}

		const { value } = body;

		if (!value || ![1, -1].includes(value)) {
			return NextResponse.json(
				{
					success: false,
					message: "Vote value must be 1 (upvote) or -1 (downvote)",
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

		// Check if user has already voted
		let existingVote = await Vote.findOne({
			userId,
			targetId: id,
			targetType: "answer",
		});

		if (existingVote) {
			// Update existing vote
			if (existingVote.value === value) {
				// Remove vote if clicking the same button
				await Vote.findByIdAndDelete(existingVote._id);
				await Answer.findByIdAndUpdate(id, {
					$inc: { votes: -existingVote.value },
				});
				existingVote = null;
			} else {
				// Change vote
				const voteDiff = value - existingVote.value;
				await Vote.findByIdAndUpdate(existingVote._id, { value });
				await Answer.findByIdAndUpdate(id, {
					$inc: { votes: voteDiff },
				});
				existingVote.value = value;
			}
		} else {
			// Create new vote
			await Vote.create({
				userId,
				targetId: id,
				targetType: "answer",
				value,
			});
			await Answer.findByIdAndUpdate(id, { $inc: { votes: value } });
		}

		// Get updated answer
		const updatedAnswer = (await Answer.findById(id)
			.select("votes")
			.lean()) as { votes: number } | null;

		if (!updatedAnswer) {
			return NextResponse.json(
				{
					success: false,
					message: "Answer not found after vote",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Vote recorded successfully",
			data: {
				votes: updatedAnswer.votes,
				userVote: existingVote ? existingVote.value : 0,
			},
		});
	} catch (error) {
		console.error("Error voting on answer:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to record vote",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

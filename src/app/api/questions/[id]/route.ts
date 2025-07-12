import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Tag } from "@/models/Tag";
import { User } from "@/models/Users";
import { createQuestionSchema } from "@/schemas/questionSchema";

// GET /api/questions/[id] - Get a specific question by ID
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
					message: "Question ID is required",
				},
				{ status: 400 }
			);
		}

		const question = await Question.findById(id)
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

		if (!question) {
			return NextResponse.json(
				{
					success: false,
					message: "Question not found",
				},
				{ status: 404 }
			);
		}

		// Increment view count
		await Question.findByIdAndUpdate(id, { $inc: { views: 1 } });

		return NextResponse.json({
			success: true,
			data: question,
		});
	} catch (error) {
		console.error("Error fetching question:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch question",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// PUT /api/questions/[id] - Update a question
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
					message: "Question ID is required",
				},
				{ status: 400 }
			);
		}

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

		// Check if question exists
		const existingQuestion = await Question.findById(id);
		if (!existingQuestion) {
			return NextResponse.json(
				{
					success: false,
					message: "Question not found",
				},
				{ status: 404 }
			);
		}

		// TODO: Check if user is authorized to edit this question
		// For now, we'll allow editing (should check if current user is the author)

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

		// Update the question
		const updatedQuestion = await Question.findByIdAndUpdate(
			id,
			{
				title,
				description,
				tags: tagIds,
			},
			{ new: true }
		)
			.populate("author", "username reputation")
			.populate("tags", "name")
			.lean();

		return NextResponse.json({
			success: true,
			message: "Question updated successfully",
			data: updatedQuestion,
		});
	} catch (error) {
		console.error("Error updating question:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update question",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/questions/[id] - Delete a question
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
					message: "Question ID is required",
				},
				{ status: 400 }
			);
		}

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

		// TODO: Check if user is authorized to delete this question
		// For now, we'll allow deletion (should check if current user is the author or admin)

		// Delete the question
		await Question.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: "Question deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting question:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete question",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

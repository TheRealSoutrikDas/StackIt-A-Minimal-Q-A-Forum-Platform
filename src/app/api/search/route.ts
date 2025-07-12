import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Answer } from "@/models/Answer";
import { User } from "@/models/Users";
import { Tag } from "@/models/Tag";

// Utility: clean error response
function errorResponse(message: string, status = 500, error?: unknown) {
	console.error(message, error);
	return NextResponse.json(
		{
			success: false,
			message,
			error: error instanceof Error ? error.message : "Unknown error",
		},
		{ status }
	);
}

export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q")?.trim();
		const type = searchParams.get("type") || "all";
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		// Validate query
		if (!query) {
			return errorResponse("Search query is required", 400);
		}

		const allowedTypes = ["all", "questions", "answers", "users", "tags"];
		if (!allowedTypes.includes(type)) {
			return errorResponse("Invalid search type", 400);
		}

		const skip = (page - 1) * limit;
		const searchRegex = { $regex: query, $options: "i" };

		// Results object
		const results: Record<string, unknown> = {};
		let total = 0;

		// Questions
		if (type === "all" || type === "questions") {
			const [questions, questionCount] = await Promise.all([
				Question.find({
					$or: [{ title: searchRegex }, { description: searchRegex }],
				})
					.populate("author", "username reputation")
					.populate("tags", "name")
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				Question.countDocuments({
					$or: [{ title: searchRegex }, { description: searchRegex }],
				}),
			]);

			results.questions = questions;
			total += questionCount;
		}

		// Answers
		if (type === "all" || type === "answers") {
			const [answers, answerCount] = await Promise.all([
				Answer.find({ content: searchRegex })
					.populate("author", "username reputation")
					.populate("question", "title")
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				Answer.countDocuments({ content: searchRegex }),
			]);

			results.answers = answers;
			total += answerCount;
		}

		// Users
		if (type === "all" || type === "users") {
			const [users, userCount] = await Promise.all([
				User.find({
					$or: [{ username: searchRegex }, { email: searchRegex }],
				})
					.select("-password")
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				User.countDocuments({
					$or: [{ username: searchRegex }, { email: searchRegex }],
				}),
			]);

			results.users = users;
			total += userCount;
		}

		// Tags
		if (type === "all" || type === "tags") {
			const [tags, tagCount] = await Promise.all([
				Tag.find({
					$or: [{ name: searchRegex }, { description: searchRegex }],
				})
					.sort({ name: 1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				Tag.countDocuments({
					$or: [{ name: searchRegex }, { description: searchRegex }],
				}),
			]);

			results.tags = tags;
			total += tagCount;
		}

		// Final response
		return NextResponse.json({
			success: true,
			data: results,
			query,
			type,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		return errorResponse("Failed to perform search", 500, error);
	}
}

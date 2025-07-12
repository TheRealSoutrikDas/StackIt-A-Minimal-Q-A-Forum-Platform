import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Question } from "@/models/Question";
import { Answer } from "@/models/Answer";
import { User } from "@/models/Users";
import { Tag } from "@/models/Tag";

// GET /api/search - Global search across questions, answers, users, and tags
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const type = searchParams.get("type") || "all"; // all, questions, answers, users, tags
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		if (!query || query.trim().length === 0) {
			return NextResponse.json(
				{
					success: false,
					message: "Search query is required",
				},
				{ status: 400 }
			);
		}

		const skip = (page - 1) * limit;
		const searchRegex = { $regex: query.trim(), $options: "i" };

		let results: any = {};
		let total = 0;

		// Search questions
		if (type === "all" || type === "questions") {
			const questions = await Question.find({
				$or: [{ title: searchRegex }, { description: searchRegex }],
			})
				.populate("author", "username reputation")
				.populate("tags", "name")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();

			const questionCount = await Question.countDocuments({
				$or: [{ title: searchRegex }, { description: searchRegex }],
			});

			results.questions = questions;
			total += questionCount;
		}

		// Search answers
		if (type === "all" || type === "answers") {
			const answers = await Answer.find({
				content: searchRegex,
			})
				.populate("author", "username reputation")
				.populate("question", "title")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();

			const answerCount = await Answer.countDocuments({
				content: searchRegex,
			});

			results.answers = answers;
			total += answerCount;
		}

		// Search users
		if (type === "all" || type === "users") {
			const users = await User.find({
				$or: [{ username: searchRegex }, { email: searchRegex }],
			})
				.select("-password")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean();

			const userCount = await User.countDocuments({
				$or: [{ username: searchRegex }, { email: searchRegex }],
			});

			results.users = users;
			total += userCount;
		}

		// Search tags
		if (type === "all" || type === "tags") {
			const tags = await Tag.find({
				$or: [{ name: searchRegex }, { description: searchRegex }],
			})
				.sort({ name: 1 })
				.skip(skip)
				.limit(limit)
				.lean();

			const tagCount = await Tag.countDocuments({
				$or: [{ name: searchRegex }, { description: searchRegex }],
			});

			results.tags = tags;
			total += tagCount;
		}

		return NextResponse.json({
			success: true,
			data: results,
			query: query.trim(),
			type,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error performing search:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to perform search",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

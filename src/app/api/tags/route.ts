import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Tag } from "@/models/Tag";
import { z } from "zod";

const createTagSchema = z.object({
	name: z.string().min(2).max(50),
	description: z.string().min(5).max(200),
});

// GET /api/tags - Get all tags with pagination and search
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "20");
		const search = searchParams.get("search");

		const skip = (page - 1) * limit;

		// Build filter object
		const filter: any = {};
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		const tags = await Tag.find(filter)
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await Tag.countDocuments(filter);

		return NextResponse.json({
			success: true,
			data: tags,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching tags:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch tags",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();

		// Validate request body
		const validationResult = createTagSchema.safeParse(body);
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

		const { name, description } = validationResult.data;

		// Check if tag already exists
		const existingTag = await Tag.findOne({
			name: name.toLowerCase(),
		});
		if (existingTag) {
			return NextResponse.json(
				{
					success: false,
					message: "Tag already exists",
				},
				{ status: 409 }
			);
		}

		// Create the tag
		const tag = await Tag.create({
			name: name.toLowerCase(),
			description,
		});

		return NextResponse.json(
			{
				success: true,
				message: "Tag created successfully",
				data: tag,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating tag:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create tag",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

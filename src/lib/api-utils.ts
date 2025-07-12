import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
	errors?: unknown[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export class ApiError extends Error {
	statusCode: number;
	errors?: unknown[];

	constructor(message: string, statusCode: number = 500, errors?: unknown[]) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = "ApiError";
	}
}

export function successResponse<T>(
	data: T,
	message: string = "Success",
	statusCode: number = 200
): NextResponse<ApiResponse<T>> {
	return NextResponse.json(
		{
			success: true,
			message,
			data,
		},
		{ status: statusCode }
	);
}

export function errorResponse(
	message: string,
	statusCode: number = 500,
	error?: string,
	errors?: unknown[]
): NextResponse<ApiResponse> {
	return NextResponse.json(
		{
			success: false,
			message,
			error,
			errors,
		},
		{ status: statusCode }
	);
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
	console.error("API Error:", error);

	if (error instanceof ApiError) {
		return errorResponse(
			error.message,
			error.statusCode,
			error.message,
			error.errors
		);
	}

	if (error instanceof Error) {
		return errorResponse("Internal server error", 500, error.message);
	}

	return errorResponse(
		"Internal server error",
		500,
		"Unknown error occurred"
	);
}

export function validatePaginationParams(
	page: string | null,
	limit: string | null
): { page: number; limit: number } {
	const pageNum = parseInt(page || "1");
	const limitNum = parseInt(limit || "10");

	return {
		page: Math.max(1, pageNum),
		limit: Math.min(100, Math.max(1, limitNum)), // Cap at 100 items per page
	};
}

export function createPaginationInfo(
	page: number,
	limit: number,
	total: number
) {
	return {
		page,
		limit,
		total,
		pages: Math.ceil(total / limit),
	};
}

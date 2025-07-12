import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		success: true,
		message: "Debug info",
		hasJwtSecret: !!process.env.JWT_SECRET,
		hasMongoUri: !!process.env.MONGODB_URI,
		nodeEnv: process.env.NODE_ENV,
		timestamp: new Date().toISOString(),
	});
}

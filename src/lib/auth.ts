import { NextRequest } from "next/server";
import type { User } from "@/lib/types";
import jwt from "jsonwebtoken";

export interface JWTPayload {
	userId: string;
	email: string;
	username: string;
	role: string;
	iat: number;
	exp: number;
}

// Get user from request cookies
export async function getUserFromRequest(
	request: NextRequest
): Promise<User | null> {
	try {
		const token = request.cookies.get("auth-token")?.value;
		if (!token) return null;

		// For now, we'll use a simple approach
		// In production, you should verify the JWT token properly
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) return null;

		// This is a simplified version - in production use proper JWT verification
		// For now, we'll just check if the token exists and return a mock user
		// You should implement proper JWT verification here

		return null; // Placeholder - implement proper JWT verification
	} catch {
		console.error("Error getting user from request");
		return null;
	}
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
	try {
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) return null;

		const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
		return decoded;
	} catch {
		console.error("Error verifying token");
		return null;
	}
}

// Check if user is authenticated
export function isAuthenticated(request: NextRequest): boolean {
	const token = request.cookies.get("auth-token")?.value;
	return !!token;
}

// Check if user has required role
export function hasRole(user: User | null, requiredRole: string): boolean {
	if (!user) return false;
	return user.role === requiredRole || user.role === "admin";
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
	return hasRole(user, "admin");
}

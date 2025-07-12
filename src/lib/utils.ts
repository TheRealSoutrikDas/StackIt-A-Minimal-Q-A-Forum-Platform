import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function verifyToken(token: string) {
	try {
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("JWT_SECRET not configured");
			return null;
		}

		const decoded = jwt.verify(token, jwtSecret) as { userId: string };
		return decoded;
	} catch {
		console.error("Token verification failed");
		return null;
	}
}

"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			// Check if there's an auth token in cookies
			const hasToken = document.cookie.includes("auth-token");

			if (hasToken) {
				// Fetch current user information from the server
				const response = await fetch("/api/auth/me");
				if (response.ok) {
					const data = await response.json();
					if (data.success) {
						setUser(data.data);
					} else {
						// Token is invalid, clear it
						document.cookie =
							"auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
						setUser(null);
					}
				} else {
					// Token is invalid, clear it
					document.cookie =
						"auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
					setUser(null);
				}
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Error checking auth status:", error);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Login failed");

		setUser(data.data.user);
		return data.data;
	};

	const logout = async () => {
		const response = await fetch("/api/auth/logout", {
			method: "POST",
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.message || "Logout failed");
		}

		setUser(null);
	};

	const register = async (userData: {
		username: string;
		email: string;
		password: string;
	}) => {
		const response = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});

		const data = await response.json();
		if (!response.ok)
			throw new Error(data.message || "Registration failed");

		return data.data;
	};

	return {
		user,
		loading,
		login,
		logout,
		register,
	};
}

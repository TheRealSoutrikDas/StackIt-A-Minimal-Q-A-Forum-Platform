// API Client for interacting with backend endpoints
import type { Question, Answer, User, Tag } from "@/lib/types";

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
	errors?: { path: string[]; message: string }[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

// Re-export types from the main types file
export type { Question, Answer, User, Tag } from "@/lib/types";

// Transform MongoDB _id to id for frontend compatibility
function transformId(obj: unknown): unknown {
	if (obj === null || obj === undefined) return obj;

	if (Array.isArray(obj)) {
		return obj.map(transformId);
	}

	if (typeof obj === "object") {
		const transformed: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			if (key === "_id") {
				transformed.id = value;
			} else {
				transformed[key] = transformId(value);
			}
		}
		return transformed;
	}

	return obj;
}

// Base API functions
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
	const url = `${baseUrl}${endpoint}`;

	const defaultOptions: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	};

	try {
		const response = await fetch(url, defaultOptions);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data.message || `HTTP error! status: ${response.status}`
			);
		}

		// Transform _id to id in the response
		if (data.data) {
			data.data = transformId(data.data);
		}

		return data;
	} catch (error) {
		console.error("API request failed:", error);
		throw error;
	}
}

// Questions API
export const questionsApi = {
	// Get all questions
	getQuestions: async (params?: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
		tag?: string;
		search?: string;
	}) => {
		const searchParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, value.toString());
				}
			});
		}
		return apiRequest<Question[]>(
			`/api/questions?${searchParams.toString()}`
		);
	},

	// Get a specific question
	getQuestion: async (id: string) => {
		return apiRequest<Question>(`/api/questions/${id}`);
	},

	// Create a new question
	createQuestion: async (data: {
		title: string;
		description: string;
		tags: string[];
	}) => {
		return apiRequest<Question>("/api/questions", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	// Update a question
	updateQuestion: async (
		id: string,
		data: {
			title: string;
			description: string;
			tags: string[];
		}
	) => {
		return apiRequest<Question>(`/api/questions/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	// Delete a question
	deleteQuestion: async (id: string) => {
		return apiRequest(`/api/questions/${id}`, {
			method: "DELETE",
		});
	},

	// Vote on a question
	voteQuestion: async (id: string, vote: "up" | "down") => {
		return apiRequest<Question>(`/api/questions/${id}/vote`, {
			method: "POST",
			body: JSON.stringify({ vote }),
		});
	},

	// Accept an answer
	acceptAnswer: async (questionId: string, answerId: string) => {
		return apiRequest<Question>(
			`/api/questions/${questionId}/accept-answer`,
			{
				method: "POST",
				body: JSON.stringify({ answerId }),
			}
		);
	},
};

// Answers API
export const answersApi = {
	// Get all answers
	getAnswers: async (params?: {
		page?: number;
		limit?: number;
		questionId?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
	}) => {
		const searchParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, value.toString());
				}
			});
		}
		return apiRequest<Answer[]>(`/api/answers?${searchParams.toString()}`);
	},

	// Get a specific answer
	getAnswer: async (id: string) => {
		return apiRequest<Answer>(`/api/answers/${id}`);
	},

	// Create a new answer
	createAnswer: async (data: { questionId: string; content: string }) => {
		return apiRequest<Answer>("/api/answers", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	// Update an answer
	updateAnswer: async (id: string, data: { content: string }) => {
		return apiRequest<Answer>(`/api/answers/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	},

	// Delete an answer
	deleteAnswer: async (id: string) => {
		return apiRequest(`/api/answers/${id}`, {
			method: "DELETE",
		});
	},

	// Vote on an answer
	voteAnswer: async (id: string, vote: "up" | "down") => {
		return apiRequest<Answer>(`/api/answers/${id}/vote`, {
			method: "POST",
			body: JSON.stringify({ vote }),
		});
	},
};

// Users API
export const usersApi = {
	// Get all users
	getUsers: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
	}) => {
		const searchParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, value.toString());
				}
			});
		}
		return apiRequest<User[]>(`/api/users?${searchParams.toString()}`);
	},

	// Create a new user (register)
	register: async (data: {
		username: string;
		email: string;
		password: string;
	}) => {
		return apiRequest<User>("/api/users", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},
};

// Tags API
export const tagsApi = {
	// Get all tags
	getTags: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
	}) => {
		const searchParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					searchParams.append(key, value.toString());
				}
			});
		}
		return apiRequest<Tag[]>(`/api/tags?${searchParams.toString()}`);
	},

	// Create a new tag
	createTag: async (data: { name: string; description: string }) => {
		return apiRequest<Tag>("/api/tags", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},
};

// Search API
export const searchApi = {
	// Global search
	search: async (params: {
		q: string;
		type?: "all" | "questions" | "answers" | "users" | "tags";
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.append(key, value.toString());
			}
		});
		return apiRequest<{
			questions?: Question[];
			answers?: Answer[];
			users?: User[];
			tags?: Tag[];
		}>(`/api/search?${searchParams.toString()}`);
	},
};

// Authentication API
export const authApi = {
	// Login user
	login: async (
		email: string,
		password: string
	): Promise<{ user: User; token: string }> => {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.message || "Login failed");

		return data.data;
	},

	// Logout user
	logout: async (): Promise<void> => {
		const response = await fetch("/api/auth/logout", {
			method: "POST",
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.message || "Logout failed");
		}
	},

	// Get current user
	getCurrentUser: async (): Promise<User | null> => {
		const response = await fetch("/api/auth/me");
		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		if (!data.success) {
			return null;
		}

		return transformId(data.data) as User | null;
	},

	// Register user
	register: async (userData: {
		username: string;
		email: string;
		password: string;
	}): Promise<User | null> => {
		const response = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});

		const data = await response.json();
		if (!response.ok)
			throw new Error(data.message || "Registration failed");

		return transformId(data.data) as User | null;
	},
};

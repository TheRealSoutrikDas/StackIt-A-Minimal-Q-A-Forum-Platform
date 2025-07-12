"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username must be less than 30 characters")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain letters, numbers, and underscores"
			),
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const { register, user } = useAuth();

	const [formData, setFormData] = useState<RegisterFormData>({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [generalError, setGeneralError] = useState("");

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			router.push("/");
		}
	}, [user, router]);

	const validateForm = (): boolean => {
		try {
			registerSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<RegisterFormData> = {};
				error.issues.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof RegisterFormData] =
							err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setGeneralError("");

		if (!validateForm()) {
			return;
		}

		try {
			setIsLoading(true);
			await register({
				username: formData.username,
				email: formData.email,
				password: formData.password,
			});
			// Redirect to login page with success message
			router.push(
				"/login?message=Registration successful! Please log in."
			);
		} catch (error) {
			console.error("Registration error:", error);
			setGeneralError(
				error instanceof Error
					? error.message
					: "An error occurred during registration. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (
		field: keyof RegisterFormData,
		value: string
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear field-specific error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900">
						Create your account
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Join StackIt and start asking questions
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{generalError && (
							<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
								{generalError}
							</div>
						)}

						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700"
							>
								Username
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									value={formData.username}
									onChange={(e) =>
										handleInputChange(
											"username",
											e.target.value
										)
									}
									className={`appearance-none block w-72 pl-12 sm:text-sm ${
										errors.username
											? "border-red-300"
											: "border-gray-300"
									}`}
									placeholder="Choose a username"
								/>
							</div>
							{errors.username && (
								<p className="mt-1 text-sm text-red-600">
									{errors.username}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={(e) =>
										handleInputChange(
											"email",
											e.target.value
										)
									}
									className={`appearance-none block w-72 pl-12 sm:text-sm ${
										errors.email
											? "border-red-300"
											: "border-gray-300"
									}`}
									placeholder="Enter your email"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									required
									value={formData.password}
									onChange={(e) =>
										handleInputChange(
											"password",
											e.target.value
										)
									}
									className={`appearance-none block w-72 pl-12 sm:text-sm  ${
										errors.password
											? "border-red-300"
											: "border-gray-300"
									}`}
									placeholder="Create a password"
								/>
								<div className="absolute inset-y-0 right-0 pr-10 flex items-center">
									<Button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="border-none text-gray-400 bg-transparent hover:text-gray-800"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</Button>
								</div>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">
									{errors.password}
								</p>
							)}
							<p className="mt-1 text-xs text-gray-500">
								Must contain at least 6 characters with
								uppercase, lowercase, and number
							</p>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700"
							>
								Confirm Password
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									autoComplete="new-password"
									required
									value={formData.confirmPassword}
									onChange={(e) =>
										handleInputChange(
											"confirmPassword",
											e.target.value
										)
									}
									className={`appearance-none block w-72 pl-12 sm:text-sm ${
										errors.confirmPassword
											? "border-red-300"
											: "border-gray-300"
									}`}
									placeholder="Confirm your password"
								/>
								<div className="absolute inset-y-0 right-0 pr-8 flex items-center">
									<Button
										type="button"
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
										className="border-none bg-transparent text-gray-400 hover:text-gray-800"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</Button>
								</div>
							</div>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<div>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading
									? "Creating account..."
									: "Create account"}
							</Button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Already have an account?
								</span>
							</div>
						</div>

						<div className="mt-6">
							<Button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<Link
									href="/login"
									style={{ textDecoration: "None" }}
								>
									Sign in to your account
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

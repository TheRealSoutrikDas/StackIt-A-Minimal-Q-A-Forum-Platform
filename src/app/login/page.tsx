"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/";
	const { login, user } = useAuth();

	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [generalError, setGeneralError] = useState("");

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			router.push(redirectTo);
		}
	}, [user, router, redirectTo]);

	const validateForm = (): boolean => {
		try {
			loginSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<LoginFormData> = {};
				error.issues.forEach((err) => {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof LoginFormData] =
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
			await login(formData.email, formData.password);
			// Redirect will happen automatically via useEffect
		} catch (error) {
			console.error("Login error:", error);
			setGeneralError(
				error instanceof Error
					? error.message
					: "An error occurred during login. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
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
						Welcome back
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to your account to continue
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
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
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
									className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
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
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={(e) =>
										handleInputChange(
											"password",
											e.target.value
										)
									}
									className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
										errors.password
											? "border-red-300"
											: "border-gray-300"
									}`}
									placeholder="Enter your password"
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">
									{errors.password}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									href="/forgot-password"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Forgot your password?
								</Link>
							</div>
						</div>

						<div>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? "Signing in..." : "Sign in"}
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
									New to StackIt?
								</span>
							</div>
						</div>

						<div className="mt-6">
							<Link
								href="/register"
								className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Create an account
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}

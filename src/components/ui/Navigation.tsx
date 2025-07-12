"use client";

import { useState } from "react";
import { Bell, Search, User, Menu, X, LogOut } from "lucide-react";
import { User as UserType, Notification } from "@/lib/types";
import { Button } from "./button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "./input";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
	user?: UserType;
	notifications?: Notification[];
	onSearch?: (query: string) => void;
	onNotificationClick?: (notification: Notification) => void;
}

export default function Navigation({
	user,
	notifications = [],
	onSearch,
	onNotificationClick,
}: NavigationProps) {
	const { user: authUser, logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	// const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	// Use auth user if no user prop is provided
	const currentUser = user || authUser;

	const unreadNotifications = notifications.filter((n) => !n.isRead);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(searchQuery);
	};

	const handleNotificationClick = (notification: Notification) => {
		onNotificationClick?.(notification);
		setIsNotificationOpen(false);
	};

	const handleLogout = async () => {
		try {
			await logout();
			// setIsUserMenuOpen(false);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<Link href={"/"} style={{ textDecoration: "None" }}>
								<h1 className="text-2xl font-bold text-blue-600">
									StackIt
								</h1>
							</Link>
						</div>
					</div>

					{/* Search Bar */}
					<div className="hidden md:block flex-1 max-w-lg mx-8">
						<form onSubmit={handleSearch} className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<Input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search questions..."
								className="block w-full pl-10 pr-3 py-0 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
							/>
						</form>
					</div>

					{/* Right side */}
					<div className="flex items-center space-x-4">
						{/* Ask Question Button */}
						<Button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
							<Link
								href="/ask"
								style={{ textDecoration: "none" }}
								className="text-white"
							>
								Ask Question
							</Link>
						</Button>

						{/* Notifications */}
						{currentUser && (
							<div className="relative">
								<button
									onClick={() =>
										setIsNotificationOpen(
											!isNotificationOpen
										)
									}
									className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									<Bell className="h-6 w-6" />
									{unreadNotifications.length > 0 && (
										<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{unreadNotifications.length > 9
												? "9+"
												: unreadNotifications.length}
										</span>
									)}
								</button>

								{/* Notifications Dropdown */}
								{isNotificationOpen && (
									<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
										<div className="py-1">
											<div className="px-4 py-2 border-b border-gray-200">
												<h3 className="text-sm font-medium text-gray-900">
													Notifications
												</h3>
											</div>
											{notifications.length > 0 ? (
												notifications
													.slice(0, 5)
													.map((notification) => (
														<button
															key={
																notification.id
															}
															onClick={() =>
																handleNotificationClick(
																	notification
																)
															}
															className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none ${
																!notification.isRead
																	? "bg-blue-50"
																	: ""
															}`}
														>
															<div className="flex items-start">
																<div className="flex-1">
																	<p className="text-sm font-medium text-gray-900">
																		{
																			notification.title
																		}
																	</p>
																	<p className="text-sm text-gray-500 mt-1">
																		{
																			notification.message
																		}
																	</p>
																	<p className="text-xs text-gray-400 mt-1">
																		{new Date(
																			notification.createdAt
																		).toLocaleDateString()}
																	</p>
																</div>
																{!notification.isRead && (
																	<div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
																)}
															</div>
														</button>
													))
											) : (
												<div className="px-4 py-3 text-sm text-gray-500">
													No notifications
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						)}

						{/* User Menu */}
						{currentUser ? (
							<div className="relative">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="cursor-pointer">
											<User className="h-6 w-6" />
											<span className="hidden md:block text-sm font-medium text-gray-700">
												{currentUser.username}
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="bg-white"
									>
										<DropdownMenuLabel>
											My Account
										</DropdownMenuLabel>
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<Link
													href={"/profile"}
													className="text-black"
													style={{
														textDecoration: "None",
													}}
												>
													Profile
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Link
													href={"/settings"}
													className="text-black"
													style={{
														textDecoration: "None",
													}}
												>
													Settings
												</Link>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator className="border-black" />
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<Button
													onClick={handleLogout}
													className="cursor-pointer"
												>
													Logout
												</Button>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						) : (
							<div className="flex flex-row gap-2">
								<Button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
									<Link
										href={"/login"}
										style={{ textDecoration: "None" }}
										className="text-black"
									>
										Log in
									</Link>
								</Button>
								<Button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
									<Link
										href={"/register"}
										style={{ textDecoration: "None" }}
										className="text-white"
									>
										Sign up
									</Link>
								</Button>
							</div>
						)}
						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								{isMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
							<div className="px-3 py-2">
								<input
									type="text"
									placeholder="Search questions..."
									className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
								Ask Question
							</button>
							{!currentUser && (
								<>
									<Link href="/login">
										<button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
											Log in
										</button>
									</Link>
									<Link href="/register">
										<button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
											Sign up
										</button>
									</Link>
								</>
							)}
							{currentUser && (
								<button
									onClick={handleLogout}
									className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
								>
									<div className="flex items-center">
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</div>
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}

"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import QuestionCard from "@/components/ui/QuestionCard";
import AskQuestionForm from "@/components/forms/AskQuestionForm";
import { Question, User, Tag, Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { questionsApi, tagsApi } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

import "./globals.css";

// Mock notifications for demonstration (will be replaced with API calls)
const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "answer",
		title: "New answer to your question",
		message: "Someone answered your question about Next.js authentication",
		userId: "1",
		relatedId: "1",
		isRead: false,
		createdAt: new Date("2024-12-07T08:30:00"),
	},
	{
		id: "2",
		type: "comment",
		title: "New comment on your answer",
		message: "John commented on your answer about Tailwind CSS",
		userId: "1",
		relatedId: "answer1",
		isRead: true,
		createdAt: new Date("2024-12-06T16:45:00"),
	},
];

export default function HomePage() {
	const { user: currentUser, loading: authLoading } = useAuth();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAskForm, setShowAskForm] = useState(false);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Fetch questions and tags on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetch questions
				const questionsResponse = await questionsApi.getQuestions({
					page: currentPage,
					limit: 10,
					sortBy: "createdAt",
					sortOrder: "desc",
					search: searchQuery || undefined,
				});

				if (questionsResponse.success && questionsResponse.data) {
					// Convert string dates to Date objects for frontend compatibility
					const questionsWithDates = questionsResponse.data.map(
						(q) => ({
							...q,
							createdAt: new Date(q.createdAt),
							updatedAt: new Date(q.updatedAt),
							author: {
								...q.author,
								createdAt: new Date(q.author.createdAt),
							},
						})
					);
					setQuestions(questionsWithDates);
					if (questionsResponse.pagination) {
						setTotalPages(questionsResponse.pagination.pages);
					}
				}

				// Fetch tags
				const tagsResponse = await tagsApi.getTags({ limit: 100 });
				if (tagsResponse.success && tagsResponse.data) {
					setAvailableTags(tagsResponse.data);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [currentPage, searchQuery]);

	const handleVote = async (questionId: string, value: 1 | -1) => {
		try {
			const vote = value === 1 ? "up" : "down";
			const response = await questionsApi.voteQuestion(questionId, vote);

			if (response.success && response.data) {
				setQuestions((prev) =>
					prev.map((q) =>
						q.id === questionId
							? { ...q, votes: response.data!.votes }
							: q
					)
				);
			}
		} catch (error) {
			console.error("Error voting on question:", error);
		}
	};

	const handleQuestionClick = (questionId: string) => {
		// Navigate to the question detail page
		window.location.href = `/questions/${questionId}`;
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleNotificationClick = (notification: Notification) => {
		// Mark notification as read
		setNotifications((prev) =>
			prev.map((n) =>
				n.id === notification.id ? { ...n, isRead: true } : n
			)
		);

		// In a real app, this would navigate to the related content
		console.log("Notification clicked:", notification);
	};

	const handleAskQuestion = () => {
		setShowAskForm(true);
	};

	const handleCancelAsk = () => {
		setShowAskForm(false);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (showAskForm) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<Navigation
					user={currentUser || undefined}
					notifications={notifications}
					onSearch={handleSearch}
					onNotificationClick={handleNotificationClick}
				/>
				<AskQuestionForm onCancel={handleCancelAsk} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Navigation */}
			<Navigation
				user={currentUser || undefined}
				notifications={notifications}
				onSearch={handleSearch}
				onNotificationClick={handleNotificationClick}
			/>

			<div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-extrabold tracking-tight">
							Questions
						</h1>
						<p className="mt-2 text-muted-foreground text-lg">
							Find answers to your questions or help others by
							answering theirs.
						</p>
					</div>
					<Button
						onClick={handleAskQuestion}
						variant="default"
						className="rounded-lg px-5 py-2.5 text-base font-semibold shadow-sm hover:scale-105 transition"
					>
						Ask Question
					</Button>
				</div>

				{/* Questions List */}
				<div className="space-y-4">
					{isLoading ? (
						<div className="flex justify-center items-center py-8">
							<div className="text-lg">Loading questions...</div>
						</div>
					) : questions.length === 0 ? (
						<div className="text-center py-8">
							<div className="text-lg text-muted-foreground">
								No questions found.
							</div>
							{searchQuery && (
								<Button
									onClick={() => setSearchQuery("")}
									variant="outline"
									className="mt-4"
								>
									Clear search
								</Button>
							)}
						</div>
					) : (
						<>
							{questions.map((question) => (
								<QuestionCard
									key={question.id}
									question={question}
									currentUser={currentUser || undefined}
									onVote={handleVote}
									onQuestionClick={handleQuestionClick}
								/>
							))}

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-center items-center space-x-2 mt-8">
									<Button
										onClick={() =>
											handlePageChange(currentPage - 1)
										}
										disabled={currentPage === 1}
										variant="outline"
									>
										Previous
									</Button>
									<span className="px-4 py-2">
										Page {currentPage} of {totalPages}
									</span>
									<Button
										onClick={() =>
											handlePageChange(currentPage + 1)
										}
										disabled={currentPage === totalPages}
										variant="outline"
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

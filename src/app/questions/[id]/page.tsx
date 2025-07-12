"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import { Question, Notification, Answer } from "@/lib/types";
import { questionsApi, answersApi } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	Eye,
	Clock,
	User as UserIcon,
} from "lucide-react";

const mockNotifications: Notification[] = [];

export default function QuestionDetailPage() {
	const params = useParams();
	const questionId = params.id as string;
	const { user: currentUser } = useAuth();

	const [question, setQuestion] = useState<Question | null>(null);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
	const [notifications] = useState<Notification[]>(mockNotifications);
	const [newAnswer, setNewAnswer] = useState("");

	// Fetch question and answers on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setIsLoadingAnswers(true);

				// Fetch question
				const questionResponse = await questionsApi.getQuestion(
					questionId
				);
				if (questionResponse.success && questionResponse.data) {
					// Convert string dates to Date objects
					const questionWithDates = {
						...questionResponse.data,
						createdAt: new Date(questionResponse.data.createdAt),
						updatedAt: new Date(questionResponse.data.updatedAt),
						author: {
							...questionResponse.data.author,
							createdAt: new Date(
								questionResponse.data.author.createdAt
							),
						},
					};
					setQuestion(questionWithDates);
				}

				// Fetch answers
				const answersResponse = await answersApi.getAnswers({
					questionId,
					sortBy: "votes",
					sortOrder: "desc",
				});
				if (answersResponse.success && answersResponse.data) {
					// Convert string dates to Date objects
					const answersWithDates = answersResponse.data.map(
						(answer) => ({
							...answer,
							createdAt: new Date(answer.createdAt),
							updatedAt: new Date(answer.updatedAt),
							author: {
								...answer.author,
								createdAt: new Date(answer.author.createdAt),
							},
						})
					);
					setAnswers(answersWithDates);
				}
			} catch (error) {
				console.error("Error fetching question data:", error);
			} finally {
				setIsLoading(false);
				setIsLoadingAnswers(false);
			}
		};

		if (questionId) {
			fetchData();
		}
	}, [questionId]);

	const handleVoteQuestion = async (value: 1 | -1) => {
		if (!question) return;

		try {
			const vote = value === 1 ? "up" : "down";
			const response = await questionsApi.voteQuestion(question.id, vote);

			if (response.success && response.data) {
				setQuestion((prev) =>
					prev ? { ...prev, votes: response.data!.votes } : null
				);
			}
		} catch (error) {
			console.error("Error voting on question:", error);
		}
	};

	const handleVoteAnswer = async (answerId: string, value: 1 | -1) => {
		try {
			const vote = value === 1 ? "up" : "down";
			const response = await answersApi.voteAnswer(answerId, vote);

			if (response.success && response.data) {
				setAnswers((prev) =>
					prev.map((a) =>
						a.id === answerId
							? { ...a, votes: response.data!.votes }
							: a
					)
				);
			}
		} catch (error) {
			console.error("Error voting on answer:", error);
		}
	};

	const handleSubmitAnswer = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newAnswer.trim() || !question) return;

		try {
			const response = await answersApi.createAnswer({
				questionId: question.id,
				content: newAnswer.trim(),
			});

			if (response.success && response.data) {
				// Add the new answer to the list
				const newAnswerWithDates = {
					...response.data,
					createdAt: new Date(response.data.createdAt),
					updatedAt: new Date(response.data.updatedAt),
					author: {
						...response.data.author,
						createdAt: new Date(response.data.author.createdAt),
					},
				};
				setAnswers((prev) => [newAnswerWithDates, ...prev]);
				setNewAnswer("");
			}
		} catch (error) {
			console.error("Error creating answer:", error);
		}
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
		return date.toLocaleDateString();
	};

	const handleSearch = (query: string) => {
		console.log("Search query:", query);
	};

	const handleNotificationClick = (notification: Notification) => {
		console.log("Notification clicked:", notification);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<Navigation
					user={currentUser || undefined}
					notifications={notifications}
					onSearch={handleSearch}
					onNotificationClick={handleNotificationClick}
				/>
				<div className="max-w-4xl mx-auto px-4 py-10">
					<div className="flex justify-center items-center py-8">
						<div className="text-lg">Loading question...</div>
					</div>
				</div>
			</div>
		);
	}

	if (!question) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<Navigation
					user={currentUser || undefined}
					notifications={notifications}
					onSearch={handleSearch}
					onNotificationClick={handleNotificationClick}
				/>
				<div className="max-w-4xl mx-auto px-4 py-10">
					<div className="text-center py-8">
						<div className="text-lg text-muted-foreground">
							Question not found.
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navigation
				user={currentUser || undefined}
				notifications={notifications}
				onSearch={handleSearch}
				onNotificationClick={handleNotificationClick}
			/>

			<div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
				{/* Question */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex gap-4">
						{/* Vote Section */}
						<div className="flex flex-col items-center space-y-2">
							<Button
								onClick={() => handleVoteQuestion(1)}
								variant="ghost"
								size="sm"
								className="p-1 hover:bg-gray-100"
							>
								<ThumbsUp className="w-5 h-5 text-gray-400" />
							</Button>
							<span className="text-lg font-semibold text-gray-700">
								{question.votes}
							</span>
							<Button
								onClick={() => handleVoteQuestion(-1)}
								variant="ghost"
								size="sm"
								className="p-1 hover:bg-gray-100"
							>
								<ThumbsDown className="w-5 h-5 text-gray-400" />
							</Button>
						</div>

						{/* Question Content */}
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								{question.title}
							</h1>

							<div
								className="text-gray-700 mb-6 prose max-w-none"
								dangerouslySetInnerHTML={{
									__html: question.description,
								}}
							/>

							{/* Tags */}
							<div className="flex flex-wrap gap-2 mb-4">
								{question.tags.map((tag) => (
									<span
										key={tag.id}
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
									>
										{tag.name}
									</span>
								))}
							</div>

							{/* Meta Information */}
							<div className="flex items-center justify-between text-sm text-gray-500">
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-1">
										<UserIcon className="w-4 h-4" />
										<span>{question.author.username}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Clock className="w-4 h-4" />
										<span>
											{formatDate(question.createdAt)}
										</span>
									</div>
									<div className="flex items-center space-x-1">
										<MessageCircle className="w-4 h-4" />
										<span>{answers.length} answers</span>
									</div>
									<div className="flex items-center space-x-1">
										<Eye className="w-4 h-4" />
										<span>{question.views} views</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Answers Section */}
				<div className="space-y-6">
					<h2 className="text-xl font-semibold text-gray-900">
						{answers.length} Answer{answers.length !== 1 ? "s" : ""}
					</h2>

					{isLoadingAnswers ? (
						<div className="flex justify-center items-center py-8">
							<div className="text-lg">Loading answers...</div>
						</div>
					) : answers.length === 0 ? (
						<div className="text-center py-8 bg-gray-50 rounded-lg">
							<div className="text-lg text-muted-foreground mb-4">
								No answers yet. Be the first to answer!
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{answers.map((answer) => (
								<div
									key={answer.id}
									className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
								>
									<div className="flex gap-4">
										{/* Vote Section */}
										<div className="flex flex-col items-center space-y-2">
											<Button
												onClick={() =>
													handleVoteAnswer(
														answer.id,
														1
													)
												}
												variant="ghost"
												size="sm"
												className="p-1 hover:bg-gray-100"
											>
												<ThumbsUp className="w-5 h-5 text-gray-400" />
											</Button>
											<span className="text-lg font-semibold text-gray-700">
												{answer.votes}
											</span>
											<Button
												onClick={() =>
													handleVoteAnswer(
														answer.id,
														-1
													)
												}
												variant="ghost"
												size="sm"
												className="p-1 hover:bg-gray-100"
											>
												<ThumbsDown className="w-5 h-5 text-gray-400" />
											</Button>
										</div>

										{/* Answer Content */}
										<div className="flex-1 min-w-0">
											<div
												className="text-gray-700 mb-4 prose max-w-none"
												dangerouslySetInnerHTML={{
													__html: answer.content,
												}}
											/>

											{/* Meta Information */}
											<div className="flex items-center justify-between text-sm text-gray-500">
												<div className="flex items-center space-x-4">
													<div className="flex items-center space-x-1">
														<UserIcon className="w-4 h-4" />
														<span>
															{
																answer.author
																	.username
															}
														</span>
													</div>
													<div className="flex items-center space-x-1">
														<Clock className="w-4 h-4" />
														<span>
															{formatDate(
																answer.createdAt
															)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Answer Form */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Your Answer
						</h3>
						<form
							onSubmit={handleSubmitAnswer}
							className="space-y-4"
						>
							<textarea
								value={newAnswer}
								onChange={(e) => setNewAnswer(e.target.value)}
								placeholder="Write your answer here..."
								className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={!newAnswer.trim()}
								>
									Post Answer
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

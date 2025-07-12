"use client";

import { useState } from "react";
import Navigation from "@/components/ui/Navigation";
import QuestionCard from "@/components/ui/QuestionCard";
import AskQuestionForm from "@/components/forms/AskQuestionForm";
import { Question, User, Tag, Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import "./globals.css";

// Mock data for demonstration
const mockUser: User = {
	id: "1",
	username: "john_doe",
	email: "john@example.com",
	role: "user",
	createdAt: new Date("2024-01-01"),
	reputation: 1250,
};

const mockTags: Tag[] = [
	{
		id: "1",
		name: "React",
		description: "A JavaScript library for building user interfaces",
	},
	{
		id: "2",
		name: "TypeScript",
		description: "Typed superset of JavaScript",
	},
	{ id: "3", name: "Next.js", description: "React framework for production" },
	{
		id: "4",
		name: "Tailwind CSS",
		description: "Utility-first CSS framework",
	},
	{ id: "5", name: "JavaScript", description: "Programming language" },
	{ id: "6", name: "Node.js", description: "JavaScript runtime" },
	{ id: "7", name: "Python", description: "Programming language" },
	{ id: "8", name: "Django", description: "Python web framework" },
];

const mockQuestions: Question[] = [
	{
		id: "1",
		title: "How to implement authentication in Next.js with TypeScript?",
		description:
			"I'm building a web application using Next.js and TypeScript, and I need to implement user authentication. What are the best practices for handling authentication in this stack? I've heard about NextAuth.js but I'm not sure if it's the right choice for my use case.",
		author: mockUser,
		tags: [mockTags[0], mockTags[1], mockTags[2]],
		votes: 15,
		views: 234,
		answers: [],
		createdAt: new Date("2024-12-06T10:30:00"),
		updatedAt: new Date("2024-12-06T10:30:00"),
		isClosed: false,
	},
	{
		id: "2",
		title: "Best practices for responsive design with Tailwind CSS",
		description:
			"I'm new to Tailwind CSS and want to learn the best practices for creating responsive designs. What are some common patterns and approaches you use when building responsive layouts?",
		author: mockUser,
		tags: [mockTags[3], mockTags[4]],
		votes: 8,
		views: 156,
		answers: [],
		acceptedAnswerId: "answer1",
		createdAt: new Date("2024-12-05T14:20:00"),
		updatedAt: new Date("2024-12-05T14:20:00"),
		isClosed: true,
	},
	{
		id: "3",
		title: "Setting up a development environment for React + TypeScript",
		description:
			"I want to start a new project with React and TypeScript. What tools and configurations do you recommend for the development environment? Should I use Create React App or Vite?",
		author: mockUser,
		tags: [mockTags[0], mockTags[1]],
		votes: 12,
		views: 189,
		answers: [],
		createdAt: new Date("2024-12-04T09:15:00"),
		updatedAt: new Date("2024-12-04T09:15:00"),
		isClosed: false,
	},
];

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
	const [questions, setQuestions] = useState<Question[]>(mockQuestions);
	// const [showAskForm, setShowAskForm] = useState(false);
	const [currentUser] = useState<User | undefined>(mockUser);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);

	const handleVote = (questionId: string, value: 1 | -1) => {
		setQuestions((prev) =>
			prev.map((q) =>
				q.id === questionId ? { ...q, votes: q.votes + value } : q
			)
		);
	};

	const handleQuestionClick = (questionId: string) => {
		// In a real app, this would navigate to the question detail page
		console.log("Navigate to question:", questionId);
	};

	const handleSearch = (query: string) => {
		// In a real app, this would filter questions based on search query
		console.log("Search query:", query);
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

	const handleAskQuestion = (data: {
		title: string;
		description: string;
		tags: Tag[];
	}) => {
		const newQuestion: Question = {
			id: Date.now().toString(),
			title: data.title,
			description: data.description,
			author: currentUser!,
			tags: data.tags,
			votes: 0,
			views: 0,
			answers: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			isClosed: false,
		};

		setQuestions((prev) => [newQuestion, ...prev]);
		// setShowAskForm(false);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation
				user={currentUser}
				notifications={notifications}
				onSearch={handleSearch}
				onNotificationClick={handleNotificationClick}
			/>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Questions
							</h1>
							<p className="mt-2 text-gray-600">
								Find answers to your questions or help others by
								answering theirs
							</p>
						</div>
						<Button variant={"outline"} className="btn">
							<Link href="/ask">Ask Question</Link>
						</Button>
					</div>

					{/* Questions List */}
					<div className="space-y-4">
						{questions.map((question) => (
							<QuestionCard
								key={question.id}
								question={question}
								currentUser={currentUser}
								onVote={handleVote}
								onQuestionClick={handleQuestionClick}
							/>
						))}
					</div>

					{questions.length === 0 && (
						<div className="text-center py-12">
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No questions yet
							</h3>
							<p className="text-gray-600 mb-4">
								Be the first to ask a question and start the
								discussion!
							</p>
							<Button variant={"outline"} className="btn">
								<Link href="/ask">Ask Question</Link>
							</Button>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

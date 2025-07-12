"use client";

import AskQuestionForm from "@/components/forms/AskQuestionForm";

import { Notification, Tag, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navigation from "@/components/ui/Navigation";
import "../globals.css";

const mockUser: User = {
	id: "1",
	username: "John Doe",
	email: "john.doe@example.com",
	role: "user",
	createdAt: new Date(),
	avatar: "https://via.placeholder.com/150",
	reputation: 100,
};

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
// Dummy placeholder available tags — replace with actual fetch or props
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

export default function AskPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [currentUser] = useState<User | undefined>(mockUser);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);

	const handleSubmit = (data: {
		title: string;
		description: string;
		tags: Tag[];
	}) => {
		setLoading(true);

		// TODO: replace with actual API call
		console.log("Submitted question:", data);

		// Simulate post + redirect
		setTimeout(() => {
			setLoading(false);
			router.push("/"); // or to the question detail page
		}, 1000);
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
	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navigation
				user={currentUser}
				notifications={notifications}
				onSearch={handleSearch}
				onNotificationClick={handleNotificationClick}
			/>
			<AskQuestionForm
				availableTags={mockTags}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={loading}
			/>
		</div>
	);
}

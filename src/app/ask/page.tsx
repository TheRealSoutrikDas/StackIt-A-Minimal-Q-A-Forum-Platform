"use client";

import AskQuestionForm from "@/components/forms/AskQuestionForm";

import { Notification, User } from "@/lib/types";
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

export default function AskPage() {
	const router = useRouter();

	const [currentUser] = useState<User | undefined>(mockUser);
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);

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
			<AskQuestionForm onCancel={handleCancel} />
		</div>
	);
}

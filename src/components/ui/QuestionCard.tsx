"use client";

import { useState } from "react";
import {
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	Eye,
	Clock,
	User,
	CheckCircle,
} from "lucide-react";
import { Question, User as UserType } from "@/lib/types";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

interface QuestionCardProps {
	question: Question;
	currentUser?: UserType;
	onVote?: (questionId: string, value: 1 | -1) => void;
	onQuestionClick?: (questionId: string) => void;
}

export default function QuestionCard({
	question,
	currentUser,
	onVote,
	onQuestionClick,
}: QuestionCardProps) {
	const [userVote, setUserVote] = useState<1 | -1 | 0>(0);

	const handleVote = (value: 1 | -1) => {
		if (!currentUser) return;

		const newVote = userVote === value ? 0 : value;
		setUserVote(newVote);
		onVote?.(question.id, newVote as 1 | -1);
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
		return new Date(date).toLocaleDateString();
	};

	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	};

	return (
		<Card
			className="hover:shadow-md transition-shadow cursor-pointer"
			onClick={() => onQuestionClick?.(question.id)}
		>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
							{question.title}
						</CardTitle>
						<CardDescription className="mt-2 text-gray-600 line-clamp-3">
							{truncateText(
								question.description.replace(/<[^>]*>/g, ""),
								200
							)}
						</CardDescription>
					</div>

					{/* Vote Section */}
					<CardAction className="flex flex-col items-center space-y-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								handleVote(1);
							}}
							disabled={!currentUser}
							className={`p-1 h-auto disabled:opacity-50 disabled:cursor-not-allowed ${
								userVote === 1
									? "text-green-600"
									: "text-gray-400"
							}`}
						>
							<ThumbsUp className="w-5 h-5" />
						</Button>
						<span className="text-lg font-semibold text-gray-700">
							{question.votes}
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								handleVote(-1);
							}}
							disabled={!currentUser}
							className={`p-1 h-auto disabled:opacity-50 disabled:cursor-not-allowed ${
								userVote === -1
									? "text-red-600"
									: "text-gray-400"
							}`}
						>
							<ThumbsDown className="w-5 h-5" />
						</Button>
					</CardAction>
				</div>
			</CardHeader>

			<CardContent>
				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-4">
					{question.tags.map((tag) => (
						<Badge
							key={tag.id}
							variant="secondary"
							className="text-xs"
						>
							{tag.name}
						</Badge>
					))}
				</div>
			</CardContent>

			<CardFooter className="flex items-center justify-between text-sm text-gray-500">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-1">
						<User className="w-4 h-4" />
						<span>{question.author.username}</span>
					</div>
					<div className="flex items-center space-x-1">
						<Clock className="w-4 h-4" />
						<span>{formatDate(question.createdAt)}</span>
					</div>
					<div className="flex items-center space-x-1">
						<MessageCircle className="w-4 h-4" />
						<span>{question.answers.length} answers</span>
					</div>
					<div className="flex items-center space-x-1">
						<Eye className="w-4 h-4" />
						<span>{question.views} views</span>
					</div>
				</div>

				{/* Accepted Answer Badge */}
				{question.acceptedAnswerId && (
					<div className="flex items-center space-x-1 text-green-600">
						<CheckCircle className="w-4 h-4" />
						<span className="text-xs font-medium">Solved</span>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}

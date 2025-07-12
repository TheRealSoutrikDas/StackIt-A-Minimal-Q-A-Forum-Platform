"use client";

import { useState } from "react";
import {
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	Eye,
	Clock,
	User,
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
		// <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
		//   <div className="flex gap-4">
		//     {/* Vote Section */}
		//     <div className="flex flex-col items-center space-y-2">
		//       <button
		//         onClick={() => handleVote(1)}
		//         disabled={!currentUser}
		//         className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
		//           userVote === 1 ? 'text-green-600' : 'text-gray-400'
		//         }`}
		//       >
		//         <ThumbsUp className="w-5 h-5" />
		//       </button>
		//       <span className="text-lg font-semibold text-gray-700">{question.votes}</span>
		//       <button
		//         onClick={() => handleVote(-1)}
		//         disabled={!currentUser}
		//         className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
		//           userVote === -1 ? 'text-red-600' : 'text-gray-400'
		//         }`}
		//       >
		//         <ThumbsDown className="w-5 h-5" />
		//       </button>
		//     </div>

		//     {/* Question Content */}
		//     <div className="flex-1 min-w-0">
		//       {/* Title */}
		//       <h3
		//         className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2"
		//         onClick={() => onQuestionClick?.(question.id)}
		//       >
		//         {question.title}
		//       </h3>

		//       {/* Description */}
		//       <p className="text-gray-600 mb-4 line-clamp-3">
		//         {truncateText(question.description.replace(/<[^>]*>/g, ''), 200)}
		//       </p>

		//       {/* Tags */}
		//       <div className="flex flex-wrap gap-2 mb-4">
		//         {question.tags.map((tag) => (
		//           <span
		//             key={tag.id}
		//             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
		//           >
		//             {tag.name}
		//           </span>
		//         ))}
		//       </div>

		//       {/* Meta Information */}
		//       <div className="flex items-center justify-between text-sm text-gray-500">
		//         <div className="flex items-center space-x-4">
		//           <div className="flex items-center space-x-1">
		//             <User className="w-4 h-4" />
		//             <span>{question.author.username}</span>
		//           </div>
		//           <div className="flex items-center space-x-1">
		//             <Clock className="w-4 h-4" />
		//             <span>{formatDate(question.createdAt)}</span>
		//           </div>
		//           <div className="flex items-center space-x-1">
		//             <MessageCircle className="w-4 h-4" />
		//             <span>{question.answers.length} answers</span>
		//           </div>
		//           <div className="flex items-center space-x-1">
		//             <Eye className="w-4 h-4" />
		//             <span>{question.views} views</span>
		//           </div>
		//         </div>

		//         {/* Accepted Answer Badge */}
		//         {question.acceptedAnswerId && (
		//           <div className="flex items-center space-x-1 text-green-600">
		//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
		//             <span className="text-xs font-medium">Solved</span>
		//           </div>
		//         )}
		//       </div>
		//     </div>
		//   </div>
		// </div>
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
				<CardAction>Card Action</CardAction>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	);
}

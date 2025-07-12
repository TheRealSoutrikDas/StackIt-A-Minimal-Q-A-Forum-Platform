"use client";

import AskQuestionForm from "@/components/forms/AskQuestionForm";
import { Tag } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<AskQuestionForm
				availableTags={mockTags}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={loading}
			/>
		</div>
	);
}

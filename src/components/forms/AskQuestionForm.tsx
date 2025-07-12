"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagInput from "@/components/forms/TagInput";
import { Button } from "@/components/ui/button";
import { questionsApi, tagsApi } from "@/lib/api-client";
import { Tag } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AskQuestionFormProps {
	onCancel: () => void;
}

export default function AskQuestionForm({ onCancel }: AskQuestionFormProps) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingTags, setIsLoadingTags] = useState(true);
	const [errors, setErrors] = useState<{
		title?: string;
		description?: string;
		tags?: string;
	}>({});

	// Fetch available tags on component mount
	useEffect(() => {
		const fetchTags = async () => {
			try {
				setIsLoadingTags(true);
				const response = await tagsApi.getTags({ limit: 100 });
				if (response.success && response.data) {
					setAvailableTags(response.data);
				}
			} catch (error) {
				console.error("Error fetching tags:", error);
			} finally {
				setIsLoadingTags(false);
			}
		};

		fetchTags();
	}, []);

	const validateForm = () => {
		const newErrors: {
			title?: string;
			description?: string;
			tags?: string;
		} = {};

		if (!title.trim()) {
			newErrors.title = "Title is required";
		} else if (title.length < 10) {
			newErrors.title = "Title must be at least 10 characters long";
		} else if (title.length > 150) {
			newErrors.title = "Title must be less than 150 characters";
		}

		if (!description.trim()) {
			newErrors.description = "Description is required";
		} else if (description.length < 20) {
			newErrors.description =
				"Description must be at least 20 characters long";
		}

		if (selectedTags.length === 0) {
			newErrors.tags = "At least one tag is required";
		} else if (selectedTags.length > 5) {
			newErrors.tags = "Maximum 5 tags allowed";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			setIsLoading(true);
			const response = await questionsApi.createQuestion({
				title: title.trim(),
				description: description.trim(),
				tags: selectedTags.map((tag) => tag.name),
			});

			if (response.success && response.data) {
				// Redirect to the question page
				router.push(`/questions/${response.data.id}`);
			} else {
				// Handle API errors
				if (response.errors) {
					const newErrors: Record<string, string> = {};
					response.errors.forEach(
						(error: { path: string[]; message: string }) => {
							if (error.path) {
								newErrors[error.path[0]] = error.message;
							}
						}
					);
					setErrors(newErrors);
				}
			}
		} catch (error) {
			console.error("Error creating question:", error);
			// Handle network errors or other issues
			setErrors({
				title: "Failed to create question. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h1 className="text-2xl font-bold text-gray-900">
						Ask a Question
					</h1>
					<Button
						onClick={onCancel}
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100"
					>
						<X className="w-5 h-5 text-gray-500" />
					</Button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Title */}
					<div className="w-full">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="What's your question? Be specific."
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.title
									? "border-red-300"
									: "border-gray-300"
							}`}
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-600">
								{errors.title}
							</p>
						)}
						<p className="mt-1 text-sm text-gray-500">
							{title.length}/150 characters
						</p>
					</div>

					{/* Description */}
					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<RichTextEditor
							content={description}
							onChange={setDescription}
							placeholder="Provide all the information someone would need to answer your question..."
							className={
								errors.description ? "border-red-300" : ""
							}
						/>

						{errors.description && (
							<p className="mt-1 text-sm text-red-600">
								{errors.description}
							</p>
						)}
					</div>

					{/* Tags */}
					<div className="w-full">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tags
						</label>
						<TagInput
							selectedTags={selectedTags}
							availableTags={availableTags}
							onTagsChange={setSelectedTags}
							placeholder="Add up to 5 tags..."
							maxTags={5}
							className={errors.tags ? "border-red-300" : ""}
						/>
						{errors.tags && (
							<p className="mt-1 text-sm text-red-600">
								{errors.tags}
							</p>
						)}
						<p className="mt-1 text-sm text-gray-500">
							Add up to 5 tags to describe what your question is
							about
						</p>
					</div>

					{/* Submit Buttons */}
					<div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
						<Button
							type="button"
							onClick={onCancel}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || isLoadingTags}
						>
							{isLoading
								? "Posting Question..."
								: "Post Question"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

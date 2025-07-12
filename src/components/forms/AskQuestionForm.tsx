"use client";

import { useState } from "react";
import { X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TiptapEditor from "@/components/editor/TiptapEditor";
import TagInput from "@/components/forms/TagInput";
import { Tag } from "@/lib/types";

interface AskQuestionFormProps {
	availableTags: Tag[];
	onSubmit: (data: {
		title: string;
		description: string;
		tags: Tag[];
	}) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function AskQuestionForm({
	availableTags,
	onSubmit,
	onCancel,
	isLoading = false,
}: AskQuestionFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [errors, setErrors] = useState<{
		title?: string;
		description?: string;
		tags?: string;
	}>({});

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit({
				title: title.trim(),
				description: description.trim(),
				tags: selectedTags,
			});
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
					<button
						onClick={onCancel}
						className="p-2 hover:bg-gray-100 rounded-full"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Title */}
					<div>
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
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						{/* <TiptapEditor
							content={description}
							onChange={setDescription}
							placeholder="Provide all the information someone would need to answer your question..."
							className={
								errors.description ? "border-red-300" : ""
							} */}
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
					<div>
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
						<button
							type="button"
							onClick={onCancel}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading
								? "Posting Question..."
								: "Post Question"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

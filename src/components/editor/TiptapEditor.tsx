"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";

interface TiptapEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	className?: string;
}

export default function TiptapEditor({
	content,
	onChange,
	placeholder,
	className,
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({}),
			Bold,
			Italic,
			Strike,
			BulletList,
			OrderedList,
			Paragraph,
			Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
			Link.configure({ openOnClick: false }),
			Image,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({
				placeholder: placeholder || "Start typing...",
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) return null;

	return (
		<div className={`border rounded-md p-2 bg-white ${className}`}>
			{/* Toolbar */}
			<div className="flex flex-wrap gap-2 mb-2">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className="btn"
				>
					B
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className="btn"
				>
					I
				</button>
				<button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className="btn"
				>
					S
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					className="btn"
				>
					• List
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					className="btn"
				>
					1. List
				</button>
				<button
					onClick={() => editor.chain().focus().setParagraph().run()}
					className="btn"
				>
					P
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className="btn"
				>
					H2
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className="btn"
				>
					H3
				</button>
				<button
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
					className="btn"
				>
					←
				</button>
				<button
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
					className="btn"
				>
					↔
				</button>
				<button
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
					className="btn"
				>
					→
				</button>
				<button
					onClick={() => {
						const url = prompt("Enter URL");
						if (url)
							editor.chain().focus().setLink({ href: url }).run();
					}}
					className="btn"
				>
					🔗
				</button>
				<button
					onClick={() => editor.chain().focus().unsetLink().run()}
					className="btn"
				>
					❌🔗
				</button>
				<button
					onClick={() =>
						navigator.clipboard.writeText(editor.getHTML())
					}
					className="btn"
				>
					📋
				</button>
			</div>

			{/* Editor */}
			<EditorContent editor={editor} />
		</div>
	);
}

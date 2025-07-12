"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Emoji from "@tiptap/extension-emoji";
import {
	Bold,
	Italic,
	Strikethrough,
	List,
	ListOrdered,
	Link as LinkIcon,
	Image as ImageIcon,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Smile,
	Heading1,
	Heading2,
	Quote,
	Code,
	Undo,
	Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedRichTextEditorProps {
	content?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	className?: string;
	error?: boolean;
}

const ToolbarButton = ({
	onClick,
	isActive,
	children,
	title,
	disabled = false,
}: {
	onClick: () => void;
	isActive?: boolean;
	children: React.ReactNode;
	title: string;
	disabled?: boolean;
}) => (
	<Button
		type="button"
		variant={isActive ? "secondary" : "ghost"}
		size="sm"
		onClick={onClick}
		disabled={disabled}
		className={cn(
			"h-8 w-8 p-0",
			isActive && "bg-secondary text-secondary-foreground"
		)}
		title={title}
	>
		{children}
	</Button>
);

const ToolbarSeparator = () => <div className="w-px h-6 bg-border mx-1" />;

const Toolbar = ({ editor }: { editor: Editor }) => {
	if (!editor) {
		return null;
	}

	const addImage = () => {
		const url = window.prompt("Enter image URL");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const setLink = () => {
		const url = window.prompt("Enter URL");
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	const addEmoji = () => {
		const emoji = window.prompt("Enter emoji");
		if (emoji) {
			editor.chain().focus().insertContent(emoji).run();
		}
	};

	return (
		<div className="border-b border-border bg-muted/50 p-2 flex flex-wrap gap-1 items-center">
			{/* Text Formatting */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					title="Bold"
				>
					<Bold className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					title="Italic"
				>
					<Italic className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
					title="Strikethrough"
				>
					<Strikethrough className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* Headings */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					title="Heading 1"
				>
					<Heading1 className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					title="Heading 2"
				>
					<Heading2 className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* Lists */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					isActive={editor.isActive("bulletList")}
					title="Bullet List"
				>
					<List className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					isActive={editor.isActive("orderedList")}
					title="Numbered List"
				>
					<ListOrdered className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* Block Elements */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					isActive={editor.isActive("blockquote")}
					title="Quote"
				>
					<Quote className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleCodeBlock().run()
					}
					isActive={editor.isActive("codeBlock")}
					title="Code Block"
				>
					<Code className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* Text Alignment */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
					isActive={editor.isActive({ textAlign: "left" })}
					title="Align Left"
				>
					<AlignLeft className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
					isActive={editor.isActive({ textAlign: "center" })}
					title="Align Center"
				>
					<AlignCenter className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
					isActive={editor.isActive({ textAlign: "right" })}
					title="Align Right"
				>
					<AlignRight className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* Media */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={setLink}
					isActive={editor.isActive("link")}
					title="Add Link"
				>
					<LinkIcon className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton onClick={addImage} title="Add Image">
					<ImageIcon className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton onClick={addEmoji} title="Add Emoji">
					<Smile className="w-4 h-4" />
				</ToolbarButton>
			</div>

			<ToolbarSeparator />

			{/* History */}
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
					title="Undo"
				>
					<Undo className="w-4 h-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
					title="Redo"
				>
					<Redo className="w-4 h-4" />
				</ToolbarButton>
			</div>
		</div>
	);
};

export default function EnhancedRichTextEditor({
	content = "",
	onChange,
	placeholder = "Start writing...",
	className = "",
	error = false,
}: EnhancedRichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-primary underline",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class: "max-w-full h-auto rounded-md",
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Emoji,
		],
		content,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 prose-headings:font-semibold prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
			},
		},
	});

	return (
		<div
			className={cn(
				"border rounded-lg bg-background overflow-hidden",
				error ? "border-destructive" : "border-input",
				className
			)}
		>
			{editor && <Toolbar editor={editor} />}
			<div className="relative">
				{editor && <EditorContent editor={editor} />}
				{!editor?.getText() && (
					<div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
						{placeholder}
					</div>
				)}
			</div>
		</div>
	);
}

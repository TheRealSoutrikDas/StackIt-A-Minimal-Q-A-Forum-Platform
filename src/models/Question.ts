import { Schema, model, models, Document, Types } from "mongoose";

export interface IQuestion extends Document {
	title: string;
	description: string;
	tags: Types.ObjectId[];
	author: Types.ObjectId;
	acceptedAnswer?: Types.ObjectId;
	votes: number;
	views: number;
	answers: Types.ObjectId[];
	isClosed: boolean;
}

const QuestionSchema = new Schema<IQuestion>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },
		votes: { type: Number, default: 0 },
		views: { type: Number, default: 0 },
		answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
		isClosed: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Question =
	models.Question || model<IQuestion>("Question", QuestionSchema);

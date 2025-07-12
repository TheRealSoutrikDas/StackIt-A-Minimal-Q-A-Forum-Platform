import { Schema, model, models, Document, Types } from "mongoose";

export interface IAnswer extends Document {
	content: string;
	author: Types.ObjectId;
	question: Types.ObjectId;
	votes: number;
}

const AnswerSchema = new Schema<IAnswer>(
	{
		content: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		question: {
			type: Schema.Types.ObjectId,
			ref: "Question",
			required: true,
		},
		votes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

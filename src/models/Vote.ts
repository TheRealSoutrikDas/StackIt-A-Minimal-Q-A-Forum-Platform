import mongoose, { Schema, Document } from "mongoose";

export interface IVote extends Document {
	userId: mongoose.Types.ObjectId;
	targetId: mongoose.Types.ObjectId;
	targetType: "question" | "answer";
	value: 1 | -1; // 1 for upvote, -1 for downvote
	createdAt: Date;
	updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		targetId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		targetType: {
			type: String,
			enum: ["question", "answer"],
			required: true,
		},
		value: {
			type: Number,
			enum: [1, -1],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure one vote per user per target
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Vote =
	mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

import { Schema, model, models, Document, Types } from "mongoose";

export interface INotification extends Document {
	recipient: Types.ObjectId;
	title: string;
	type: "answer" | "comment" | "mention";
	message: string;
	isRead: boolean;
	relatedId: Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>(
	{
		recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		type: {
			type: String,
			enum: ["answer", "comment", "mention"],
			required: true,
		},
		message: { type: String, required: true },
		isRead: { type: Boolean, default: false },
		relatedId: { type: Schema.Types.ObjectId, required: true },
	},
	{ timestamps: true }
);

export const Notification =
	models.Notification ||
	model<INotification>("Notification", NotificationSchema);

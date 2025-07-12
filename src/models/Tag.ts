import { Schema, model, models, Document } from "mongoose";

export interface ITag extends Document {
	name: string;
	description: string;
}

const TagSchema = new Schema<ITag>({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
});

export const Tag = models.Tag || model<ITag>("Tag", TagSchema);

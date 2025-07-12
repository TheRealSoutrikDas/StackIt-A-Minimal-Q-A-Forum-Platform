import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	role: "guest" | "user" | "admin";
	isBanned: boolean;
	reputation: number;
}

const UserSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["guest", "user", "admin"],
			default: "user",
		},
		isBanned: { type: Boolean, default: false },
		reputation: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);

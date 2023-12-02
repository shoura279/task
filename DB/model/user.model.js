import mongoose, { Schema, model } from "mongoose";
import { roles } from "../../src/utils/roles.js";

// schema
const userSchema = Schema(
	{
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(roles),
		},
	},
	{
		timestamps: true,
	}
);
// model
export const userModel = model("User", userSchema);

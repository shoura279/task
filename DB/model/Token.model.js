import { Schema, Types, model } from "mongoose";

// schema
const tokenSchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: String,
    isValid:{
      type:Boolean
    }
	},
	{ timestamps: true }
);
// model
export const tokenModel = model("Token", tokenSchema);

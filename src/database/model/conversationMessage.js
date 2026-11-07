import mongoose, { Schema, Types } from "mongoose";

const conversationMessageSchema = new Schema(
  {
    conversationId: {
      type: Types.ObjectId,
      required: true,
      ref: "conversation",
    },
    senderId: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const conversationMessageModel = mongoose.model(
  "conversationMessage",
  conversationMessageSchema,
);

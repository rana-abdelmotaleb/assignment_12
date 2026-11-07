import mongoose, { Schema, Types } from "mongoose";

const conversationSchema = Schema(
  {
    requestId: {
      type: Types.ObjectId,
      required: true,
      ref: "request",
      unique: true,
    },
    messageId: {
      type: Types.ObjectId,
      required: true,
      ref: "message",
    },
    participants: {
      type: [Types.ObjectId],
      ref: "user",
      default: [],
    },
  },
  { timestamps: true },
);

export const conversationModel = mongoose.model(
  "conversation",
  conversationSchema,
);

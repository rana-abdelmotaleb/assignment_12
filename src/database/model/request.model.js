import mongoose, { Schema, Types } from "mongoose";

const requestSchema = Schema(
  {
    messageId: {
      type: Types.ObjectId,
      required: true,
      ref: "message",
    },
    reciverId: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    senderId: {
      type: Types.ObjectId,
      ref: "user",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const requestModel = mongoose.model("request", requestSchema);

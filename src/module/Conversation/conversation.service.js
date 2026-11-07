import { BadRequestException } from "../../common/exciptions/error.exciptions.js";
import { conversationModel } from "../../database/model/conversation.model.js";
import { conversationMessageModel } from "../../database/model/conversationMessage.js";
import { requestModel } from "../../database/model/request.model.js";

export const createConversation = async (body, user) => {
  let { requestId } = body;
  let data = await requestModel.findById(requestId);
  if (!data) {
    return BadRequestException({ message: "Request Not Found" });
  }
  if (data.status !== "accepted") {
    return BadRequestException({ message: "request not accepted" });
  }
  let conversation = await conversationModel.findOne({ requestId });

  if (conversation) {
    return BadRequestException({
      message: "Conversation already exists",
    });
  }

  let create = await conversationModel.create({
    requestId,
    messageId: data.messageId,
    participants: [data.reciverId, data.senderId],
  });

  return create;
};

export const getConversations = async (user) => {
  let data = await conversationModel
    .find({ participants: user.id })
    .populate("messageId", "content");
  if (data.length === 0) {
    return BadRequestException({
      message: "No Conversations Found",
    });
  }
  return data;
};

export const sendMessage = async (body, user) => {
  let { conversationId, content } = body;

  let conversation = await conversationModel.findOne({
    _id: conversationId,
    participants: user.id,
  });

  if (!conversation) {
    return BadRequestException({ message: "Conversation Not Found" });
  }

  let message = await conversationMessageModel.create({
    conversationId,
    senderId: user.id,
    content,
  });

  return message;
};

export const getMessages = async (conversationId, user) => {
  let conversation = await conversationModel.findOne({
    _id: conversationId,
    participants: user.id,
  });

  if (!conversation) {
    return BadRequestException({ message: "Conversation Not Found" });
  }

  let messages = await conversationMessageModel.find({ conversationId });

  return messages;
};

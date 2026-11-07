import { BadRequestException } from "../../common/exciptions/error.exciptions.js";
import { messageModel } from "../../database/model/message.model.js";
import { requestModel } from "../../database/model/request.model.js";
import { userModel } from "../../database/model/user.model.js";

export const requestIdentity = async (body, user) => {
  let { messageId } = body;

  // check message
  let message = await messageModel.findById(messageId);

  if (!message) {
    return BadRequestException({ message: "Message Not Found" });
  }

  // check message owner
  if (message.reciverId.toString() !== user.id.toString()) {
    return BadRequestException({
      message: "You are not the owner of this message",
    });
  }

  // check sender
  if (!message.senderId) {
    return BadRequestException({
      message: "Cannot identify anonymous sender",
    });
  }

  // check existing request
  let exits = await requestModel.findOne({ messageId });

  if (exits) {
    return BadRequestException({
      message: "Request already exists",
    });
  }

  // create request
  let request = await requestModel.create({
    messageId,
    reciverId: user.id,
    senderId: message.senderId,
  });

  return {
    message: "Identity request created successfully",
    data: request,
  };
};

export const requests = async (user) => {
  let requests = await requestModel
    .find({ reciverId: user.id })
    .populate("messageId", "content");
  if (requests.length === 0) {
    return BadRequestException({
      message: "No requests found",
    });
  }
  return requests;
};

export const updateRequestStatus = async (body, user) => {
  let { requestId, status } = body;
  let request = await requestModel.findById(requestId);
  if (!request) {
    return BadRequestException({
      message: "Request Not Found",
    });
  }
  if (!["accepted", "rejected"].includes(status)) {
    return BadRequestException({
      message: "Invalid status",
    });
  }

  if (request.status !== "pending") {
    return BadRequestException({
      message: "Request already processed",
    });
  }

  request.status = status;
  await request.save();

  if (request.status === "accepted") {
    let senderData = await userModel.findById(request.senderId);

    return {
      message: "Request accepted successfully",
      data: senderData,
    };
  }

  return {
    message: "Request rejected successfully",
    data: null,
  };
};

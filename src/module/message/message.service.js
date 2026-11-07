import { BadRequestException } from "../../common/exciptions/error.exciptions.js";
import { messageModel } from "../../database/model/message.model.js";
import { userModel } from "../../database/model/user.model.js";
//get all messages
export const getAllMessages = async () => {
  let data = await messageModel.find();
  if (data.length > 0) {
    return { message: "all Messages", data };
  } else {
    return BadRequestException({
      message: "No Messages found",
    });
  }
};
//create messages
export const createMessages = async (body, file, user) => {
  let { content, reciverId } = body;
  let messageImage;
  let senderId = user?.id || null;
  let exits = await userModel.findById(reciverId);
  if (!exits) {
    return BadRequestException({ message: "user Not Found " });
  }
  if (file) {
    messageImage = file.path;
  }
  let createMessage = await messageModel.insertOne({
    content,
    reciverId,
    senderId,
    messageImage,
  });
  if (createMessage) {
    return createMessage;
  } else {
    return BadRequestException({ message: "messagee not send" });
  }
};

export const userUrl = async (user) => {
  let data = await userModel.findById(user.id);
  console.log(user);

  const url = `https://sara7a/${data.uniqueName}`;
  return url;
};
export const user = async (body) => {
  let { url } = body;
  let uniqueName = url.split("/").at(-1);
  let userData = await userModel.findOne({ uniqueName });
  if (!userData) {
    return BadRequestException({ message: "user Not Found" });
  } else {
    return userData;
  }
};
export const getMessage = async (user) => {
  let exit = user.id;
  let messages = await messageModel.find({ reciverId: exit });
  if (messages.length == 0) {
    return BadRequestException({ message: "No Messages Found" });
  } else {
    return {
      data: messages,
    };
  }
};

import { Router } from "express";

import { auth } from "../../common/middleware/auth.middleware.js";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "./conversation.service.js";

const router = Router();

router.post("/create-conversation", auth, async (req, res) => {
  let data = await createConversation(req.body, req.user);

  res.json(data);
});
router.get("/get-conversation", auth, async (req, res) => {
  let data = await getConversations(req.user);

  res.json(data);
});
router.post("/send-message", auth, async (req, res) => {
  let data = await sendMessage(req.body, req.user);
  res.json(data);
});
router.get("/get-messages/:conversationId", auth, async (req, res) => {
  let data = await getMessages(req.params.conversationId, req.user);
  res.json(data);
});

export default router;

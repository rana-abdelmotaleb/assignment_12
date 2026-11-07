import { Router } from "express";

import { auth } from "../../common/middleware/auth.middleware.js";
import {
  requestIdentity,
  requests,
  updateRequestStatus,
} from "./request.service.js";
const router = Router();
// request identity
router.post("/request-identity", auth, async (req, res) => {
  let data = await requestIdentity(req.body, req.user);
  res.json(data);
});
// Get Request
router.get("/requests", auth, async (req, res) => {
  let data = await requests(req.user);
  res.json(data);
});
router.post("/update-Request-Status", auth, async (req, res) => {
  let data = await updateRequestStatus(req.body, req.user);
  res.json(data);
});

export default router;

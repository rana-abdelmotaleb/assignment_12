import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
import { BadRequestException } from "../exciptions/error.exciptions.js";

export const optionalAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }

    let [flag, token] = req.headers.authorization.split(" ");

    if (flag === "Bearer") {
      let deCoded = jwt.decode(token);
      let sign;

      switch (deCoded?.aud) {
        case "user":
          sign = env.accessSignUser;
          break;
        case "admin":
          sign = env.accessSignAdmin;
          break;
        default:
          return BadRequestException({ message: "Invalid token" });
      }

      let verify = await jwt.verify(token, sign);

      if (verify) {
        req.user = verify;
        return next();
      }
    }

    return BadRequestException({ message: "Invalid token" });
  } catch (error) {
    next(error);
  }
};

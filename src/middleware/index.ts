import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "config";
import Request from "../types/Request";
import Payload from "../types/Payload";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
    req.userId = payload.userId;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
};

export const schema = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(",");

      console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
};

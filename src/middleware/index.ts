import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "config";
import Request from "../types/Request";
import Payload from "../types/Payload";
import Profile from "../models/Profile";
import { IProfile } from "../models/Profile";

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

export const checkAuth = (provider: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const profile: IProfile = await Profile.findOne({ provider });
    const isAuthExists = profile && profile.accessToken.length > 0;

    if (!isAuthExists) {
      next();
    } else {
      res.status(422).json({ error: `Already authenticated for ${provider}` });
    }
  };
};

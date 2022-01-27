import { Response } from "express";
import bcrypt from "bcryptjs";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "config";
import gravatar from "gravatar";
import Payload from "../types/Payload";
import User, { IUser } from "../models/User";
import Request from "../types/Request";

const getAuthUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let user: IUser = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    const payload: Payload = {
      userId: user.id,
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("jwtExpiration") },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    let user: IUser = await User.findOne({ email });

    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User already exists",
          },
        ],
      });
    }

    const options: gravatar.Options = {
      s: "200",
      r: "pg",
      d: "mm",
    };

    const avatar = gravatar.url(email, options);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Build user object based on IUser
    const userFields = {
      email,
      name,
      password: hashed,
      avatar,
    };

    user = new User(userFields);

    await user.save();

    const payload: Payload = {
      userId: user.id,
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("jwtExpiration") },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

export default {
  getAuthUser,
  login,
  register,
};

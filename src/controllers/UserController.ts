import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import Request from "../types/Request";
import User, { IUser } from "../models/User";

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
// router.get("/me", auth, async (req: Request, res: Response) => {
//   try {
//     const profile: IProfile = await Profile.findOne({
//       user: req.userId,
//     }).populate("user", ["avatar", "email"]);
//     if (!profile) {
//       return res.status(HttpStatusCodes.BAD_REQUEST).json({
//         errors: [
//           {
//             msg: "There is no profile for this user",
//           },
//         ],
//       });
//     }

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

const create = async (req: Request, res: Response) => {
  const { name, userId } = req.body;

  // Build profile object based on IProfile
  const userFields = {
    profileId: userId,
    name
  };

  try {
    let user: IUser = await User.findOne({ profileId: userId });

    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User already exists",
          },
        ],
      });
    }

    // Update
    const result = await User.create(userFields);

    return res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

// // @route   GET api/profile
// // @desc    Get all profiles
// // @access  Public
// router.get("/", async (_req: Request, res: Response) => {
//   try {
//     const profiles = await Profile.find().populate("user", ["avatar", "email"]);
//     res.json(profiles);
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

// // @route   GET api/profile/user/:userId
// // @desc    Get profile by userId
// // @access  Public
// router.get("/user/:userId", async (req: Request, res: Response) => {
//   try {
//     const profile: IProfile = await Profile.findOne({
//       user: req.params.userId,
//     }).populate("user", ["avatar", "email"]);

//     if (!profile)
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ msg: "Profile not found" });

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === "ObjectId") {
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ msg: "Profile not found" });
//     }
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

// // @route   DELETE api/profile
// // @desc    Delete profile and user
// // @access  Private
// router.delete("/", auth, async (req: Request, res: Response) => {
//   try {
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.userId });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.userId });

//     res.json({ msg: "User removed" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

// export default router;

export default {
    create
}
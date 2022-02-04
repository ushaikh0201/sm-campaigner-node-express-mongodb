import { Router } from "express";
import { auth, schema } from "../../middleware";
import schemas from "../schemas";
import AuthController from "../../controllers/AuthController";
import passportFacebook, {
  facebookMeCallback,
  facebookMePostsCallback,
  facebookMeVideosCallback,
} from "../../providers/passportFacebook";

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth, AuthController.getAuthUser);

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post("/", schema(schemas.auth.login), AuthController.login);

// @route   POST api/register
// @desc    Register user and get token
// @access  Public
router.post(
  "/register",
  schema(schemas.auth.register),
  AuthController.register
);

/* START: FACEBOOK ROUTER */
router.get(
  "/facebook",
  passportFacebook.authenticate("facebook", {
    scope: [
      "user_friends",
      "user_posts",
      "user_videos",
      "pages_show_list",
      "instagram_basic",
    ],
  })
);
router.get(
  "/facebook/callback",
  passportFacebook.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/")
);

router.get("/facebook/me", facebookMeCallback);

router.get("/facebook/me/posts", facebookMePostsCallback);

router.get("/facebook/me/videos", facebookMeVideosCallback);

/* END: FACEBOOK ROUTER */

export default router;

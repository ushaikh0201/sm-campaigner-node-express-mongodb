import { Router } from "express";
import { auth, schema, checkAuth } from "../../middleware";
import schemas from "../schemas";
import AuthController from "../../controllers/AuthController";
import passportFacebook, {
  facebookMeCallback,
  facebookMePostsCallback,
  facebookMeVideosCallback,
} from "../../providers/passportFacebook";
import passportTwitter, {getTwitterBearerToken, twitterAllTweetsCallback} from "../../providers/passportTwitter";

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
  checkAuth("fb"),
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

router.get("/facebook/me", auth, facebookMeCallback);

router.get("/facebook/me/posts", auth, facebookMePostsCallback);

router.get("/facebook/me/videos", auth, facebookMeVideosCallback);

/* END: FACEBOOK ROUTER */

/* START: TWITTER ROUTER */
router.get(
  "/twitter",
  checkAuth("twitter"),
  passportTwitter.authenticate("twitter")
);
router.get(
  "/twitter/callback",
  passportTwitter.authenticate("twitter", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);
router.get("/twitter/tweets", auth, twitterAllTweetsCallback);
/* END: TWITTER ROUTER */

export default router;

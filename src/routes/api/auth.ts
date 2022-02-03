import { Response, Router } from "express";

import { auth, schema } from "../../middleware";
import schemas from "../schemas";
import AuthController from "../../controllers/AuthController";
import passportFacebook from "../../providers/passportFacebook";
import fs from "fs";
import Profile from "../../models/Profile";
import axios from "../../axios.config";
import config from "config";
import querystring from 'querystring';
import { getAccessTokenByProvider } from "../../controllers/ProfileController";

const FB = config.get('fbGraphURI');
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

/* FACEBOOK ROUTER */
router.get(
  "/facebook",
  passportFacebook.authenticate("facebook", {
    scope: ["user_friends", "user_posts", "user_videos", "pages_show_list", "instagram_basic"],
  })
);
router.get(
  "/facebook/callback",
  passportFacebook.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    Profile.create(
      { displayName: 'temp', providerId: '123145', accessToken:'dsfj23', response: res },
      function (err, user) {
        if (err) {
          console.error(err);
        }
        return user;
      }
    );
    res.redirect("/");
  }
);

router.get("/facebook/me",async(req, res) => {
  const access_token = await getAccessTokenByProvider('fb');
  const query = querystring.stringify({fields: 'id,name', access_token });
  
  try {
    // const isValid = await validateAccessToken(access_token);
    const result = await axios.get(`${FB}/me?${query}`);
    if(result.data){
      return res.json({...result.data});
    }
    return new Error('No data found');
  } catch (error) {
    res.json(error);
  }
});

router.get("/facebook/me/posts",async(req, res) => {
  const access_token = await getAccessTokenByProvider('fb');
  const query = querystring.stringify({access_token });
  
  try {
    const result = await axios.get(`${FB}/me/posts?${query}`);
    if(result.data){
      return res.json({...result.data});
    }
    return new Error('No data found');
  } catch (error) {
    res.json(error);
  }
});

router.get("/facebook/me/videos",async(req, res) => {
  const access_token = await getAccessTokenByProvider('fb');
  const query = querystring.stringify({access_token });
  
  try {
    const result = await axios.get(`${FB}/me/videos?${query}`);
    if(result.data){
      return res.json({...result.data});
    }
    return new Error('No data found');
  } catch (error) {
    res.json(error);
  }
});


export default router;

import passport from "passport";
import config from "config";
import { Strategy as FacebookStrategy } from "passport-facebook";
import Profile from "../models/Profile";
import querystring from "querystring";
import axios from "../axios.config";
import { getAccessTokenByProvider } from "../controllers/ProfileController";
import { Response } from "express";
import Request from "../types/Request";

const FB = config.get("providers.fb.graphURI");

export default passport.use(
  new FacebookStrategy(
    {
      clientID: config.get("providers.fb.clientAppId"),
      clientSecret: config.get("providers.fb.clientSecret"),
      callbackURL: config.get("providers.fb.callbackURL"),
    },
    function (accessToken, refreshToken, profile, done) {
      Profile.create(
        {
          displayName: profile.displayName,
          providerId: profile.id,
          provider: "fb",
          accessToken,
          response: profile,
        },
        function (err, user) {
          if (err) {
            return done(err);
          }
          done(null, user);
        }
      );
    }
  )
);

export const facebookMeCallback = async (req: Request, res: Response) => {
  const access_token = await getAccessTokenByProvider("fb");
  const query = querystring.stringify({ fields: "id,name", access_token });

  try {
    // const isValid = await validateAccessToken(access_token);
    const result = await axios.get(`${FB}/me?${query}`);
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    res.json(error);
  }
};

export const facebookMePostsCallback = async (req: Request, res: Response) => {
  const access_token = await getAccessTokenByProvider("fb");
  const query = querystring.stringify({ access_token });

  try {
    const result = await axios.get(`${FB}/me/posts?${query}`);
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    res.json(error);
  }
};

export const facebookMeVideosCallback = async (req: Request, res: Response) => {
  const access_token = await getAccessTokenByProvider("fb");
  const query = querystring.stringify({ access_token });

  try {
    const result = await axios.get(`${FB}/me/videos?${query}`);
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    res.json(error);
  }
};

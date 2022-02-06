import passport from "passport";
import config from "config";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import Profile from "../models/Profile";
import querystring from "querystring";
import axios from "../axios.config";
import { getAccessTokenByProvider, getBearerTokenByProvider, getProviderIdByProvider } from "../controllers/ProfileController";
import { Response } from "express";
import Request from "../types/Request";
import { isEmpty } from "lodash";

const TW_ENDPOINT_URI = config.get("providers.linkedin.endpoint_url");
// const TW_OAUTH_URI = config.get("providers.linkedin.oauth_uri");

export default passport.use(
  new LinkedInStrategy(
    {
      clientID: config.get("providers.linkedin.clientID"),
      clientSecret: config.get("providers.linkedin.clientSecret"),
      callbackURL: config.get("providers.linkedin.callbackURL"),
      scope: ["r_ads", "r_ads_reporting"]
    },
    async function (accessToken, refreshToken, profile, done) {
      if(!isEmpty(profile)){
        Profile.create(
          {
            displayName: profile.displayName,
            providerId: profile.id,
            provider: "linkedin",
            accessToken,
            response: {}
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            done(null, user);
          }
        );
      }
    }
  )
);

export const lnAdCampaignCallback = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const access_token = await getAccessTokenByProvider("linkedin");
    const result = await axios.post(`${TW_ENDPOINT_URI}/adCampaignsV2`, data, {headers: {Authentication: `Bearer ${access_token}`}});
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    res.json(error);
  }
};

export const lnShareCallback = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const access_token = await getAccessTokenByProvider("linkedin");
    const result = await axios.post(`${TW_ENDPOINT_URI}/shares`, data, {headers: {Authentication: `Bearer ${access_token}`, 'Content-Type': 'application/json'}});
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    console.error(error);
    res.json(error.message);
  }
};
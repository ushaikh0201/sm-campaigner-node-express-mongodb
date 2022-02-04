import passport from "passport";
import config from "config";
import { Strategy as TwitterStrategy } from "passport-twitter";
import Profile from "../models/Profile";
import querystring from "querystring";
import axios from "../axios.config";
import { getBearerTokenByProvider, getProviderIdByProvider } from "../controllers/ProfileController";
import { Response } from "express";
import Request from "../types/Request";
import { isEmpty } from "lodash";

const TW_ENDPOINT_URI = config.get("providers.twitter.endpoint_uri");
const TW_OAUTH_URI = config.get("providers.twitter.oauth_uri");

export default passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.get("providers.twitter.consumerKey"),
      consumerSecret: config.get("providers.twitter.consumerSecret"),
      callbackURL: config.get("providers.twitter.callbackURL"),
    },
    async function (accessToken, refreshToken, profile, done) {
      if(!isEmpty(profile)){
        const bearerToken = await getTwitterBearerToken();
        Profile.create(
          {
            displayName: profile.displayName,
            providerId: profile.id,
            provider: "twitter",
            accessToken,
            response: {bearerToken}
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

export const getTwitterBearerToken = async () => {
  try {
    const apiKey = config.get('providers.twitter.consumerKey');
    const apiSecret = config.get('providers.twitter.consumerSecret');
    const query = querystring.stringify({ grant_type: "client_credentials"});
    const auth = "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const result = await axios.post(`${TW_OAUTH_URI}?${query}`, null,{ headers: { Authorization: auth}});
    if (result.status === 200) {
      return result.data.access_token;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const twitterAllTweetsCallback = async (req: Request, res: Response) => {
  const bearer_token = await getBearerTokenByProvider("twitter");
  const providerId = await getProviderIdByProvider("twitter");
  try {
    const result = await axios.get(`${TW_ENDPOINT_URI}/users/${providerId}/tweets`, { headers: { Authorization: `Bearer ${bearer_token}`}});
    if (result.data) {
      return res.json({ ...result.data });
    }
    return new Error("No data found");
  } catch (error) {
    res.json(error);
  }
};
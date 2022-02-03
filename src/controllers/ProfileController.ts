import { IProfile } from "../models/Profile";
import Profile from "../models/Profile";
import isEmpty from "lodash/isEmpty";

export const getAccessTokenByProvider = async (provider: string): Promise<string> => {
  try {
    let profile: IProfile = await Profile.findOne({ provider });

    return !isEmpty(profile) && profile.accessToken || null;
  } catch (err) {
    console.error(err.message);
  }
};
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

export const getBearerTokenByProvider = async (provider: string): Promise<string> => {
  try {
    let profile: IProfile = await Profile.findOne({ provider });

    return !isEmpty(profile) && !isEmpty(profile.response) && profile.response.bearerToken || null;
  } catch (err) {
    console.error(err.message);
  }
};

export const getProviderIdByProvider = async (provider: string): Promise<string> => {
  try {
    let profile: IProfile = await Profile.findOne({ provider });

    return !isEmpty(profile) && profile.providerId || null;
  } catch (err) {
    console.error(err.message);
  }
};
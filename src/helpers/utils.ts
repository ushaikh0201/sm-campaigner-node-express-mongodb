import isEmpty from "lodash/isEmpty";
import axios from "../axios.config";
import querystring from "querystring";

export const validateAccessToken = async (access_token: string) => {
  const BASE_URI = "https://graph.facebook.com";
  const query1 = querystring.stringify({
    input_token: access_token,
    access_token,
  });
  const url = `${BASE_URI}/debug_token?${query1}`;

  const result = await axios.get(url);
  return !isEmpty(result.data) && !isEmpty(result.data.data)
    ? result.data.data.is_valid
    : false;
};

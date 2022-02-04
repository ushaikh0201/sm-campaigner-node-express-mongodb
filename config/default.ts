import 'dotenv/config'

export default {
  "mongoURI": process.env.MONGO_DB_URL,
  "jwtSecret": process.env.JWT_SECRET,
  "jwtExpiration": 360000,
  "providers": {
    "fb": {
      "base_uri": "https://graph.facebook.com",
      "version": "v12.0",
      "clientAppId": process.env.FB_CLIENT_APP_ID,
      "clientSecret": process.env.FB_CLIENT_SECRET,
      "callbackURL": "https://localhost:5000/api/auth/facebook/callback",
      "graphURI":  "https://graph.facebook.com/v12.0"
    },
    "twitter":{
      "oauth_uri": "https://api.twitter.com/oauth2/token",
      "endpoint_uri": "https://api.twitter.com/2",
      "consumerKey": process.env.TW_CONSUMER_KEY,
      "consumerSecret": process.env.TW_CONSUMER_SECRET,
      "callbackURL": "http://127.0.0.1:3000/api/auth/twitter/callback",
      "bearerToken": process.env.TW_BEARER_TOKEN
    }
  }
}

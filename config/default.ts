import 'dotenv/config'

export default {
  "mongoURI": process.env.MONGO_DB_URL,
  "jwtSecret": process.env.JWT_SECRET,
  "jwtExpiration": 360000,
  "fbClientAppId": process.env.FB_CLIENT_APP_ID,
  "fbClientSecret": process.env.FB_CLIENT_SECRET,
  "facebookRedirectURI": "https://localhost:5000/api/auth/facebook/callback",
  "fbGraphURI":  "https://graph.facebook.com/v12.0",
  "providers": {
    "fb": {
      "base_uri": "https://graph.facebook.com",
      "version": "v12.0"  
    }
  }
}

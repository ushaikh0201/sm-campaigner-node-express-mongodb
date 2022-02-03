import passport from "passport";
import config from "config";
import { Strategy as FacebookStrategy } from "passport-facebook";
import Profile from "../models/Profile";

export default passport.use(
  new FacebookStrategy(
    {
      clientID: "434024488458713",
      clientSecret: "2deccfd2f1c3d11f56664b0de43bf54d",
      callbackURL: config.get("facebookRedirectURI"),
    },
    function (accessToken, refreshToken, profile, done) {
      Profile.create(
        { displayName: profile.displayName, providerId: profile.id, provider: 'fb', accessToken, response: profile },
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

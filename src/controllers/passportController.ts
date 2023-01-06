import passport from "passport";
import bcrypt from "bcrypt";
import { User, UserDocument } from "../models/user";
import { Request } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";

// import Logger from "../lib/logger";
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req: Request, username: string, password: string, done) => {
      User.findOne(
        { username: username },
        (err: Error | undefined, user: UserDocument) => {
          if (err) return done(err);

          if (!user) {
            return done(null, false, { message: "User not found in Mongo" });
          }
          console.log(password);
          console.log(user.password);
          bcrypt.compare(
            password,
            user.password,
            (err: Error | undefined, match: boolean) => {
              if (err) {
                console.log("this is passport err path");
                return done(err);
              }

              if (match) {
                //passwords match
                console.log("bcrypt response was truthy");
                console.log(user);
                return done(null, user);
              } else {
                //passwords do not match
                console.log("this is passwords do not match path");
                return done(null, false, { message: "Incorrect password" });
              }
            }
          );
        }
      );
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
    },
    async function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return await User.findById(jwtPayload.sub)
        .then((user) => {
          if (user) {
            return cb(null, user);
          }
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

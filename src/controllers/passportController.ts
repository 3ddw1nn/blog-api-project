import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import { User, UserDocument } from "../models/user";
import passportJWT from "passport-jwt";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// import jwt from "jsonwebtoken";

// const SECRETS = {
//   jwt: process.env.JWT_SECRET || "secret",
//   jwtExp: "6h",
// };

const LocalStrategy = passportLocal.Strategy;

// export const newToken = (user: UserDocument) => {
//   return jwt.sign({ username: user.username }, SECRETS.jwt, {
//     expiresIn: SECRETS.jwtExp,
//   });
// };

// export const verifyToken = (token: string) =>
//   new Promise((resolve, reject) => {
//     jwt.verify(token, SECRETS.jwt, (err, payload) => {
//       if (err) return reject(err);
//       resolve(payload);
//     });
//   });

passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: UserDocument) => {
      if (err) return done(err);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(
        password,
        user.password,
        (err: Error | undefined, res: boolean) => {
          if (err) {
            return done(err);
          }
          if (res) {
            //passwords match
            return done(null, user);
          } else {
            //passwords do not match
            return done(null, false, { message: "Incorrect password" });
          }
        }
      );
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
    },
    function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user!);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

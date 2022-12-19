"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
// import jwt from "jsonwebtoken";
// const SECRETS = {
//   jwt: process.env.JWT_SECRET || "secret",
//   jwtExp: "6h",
// };
const LocalStrategy = passport_local_1.default.Strategy;
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
passport_1.default.use(new LocalStrategy((username, password, done) => {
    user_1.User.findOne({ username: username }, (err, user) => {
        if (err)
            return done(err);
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        bcrypt_1.default.compare(password, user.password, (err, res) => {
            if (err) {
                return done(err);
            }
            if (res) {
                //passwords match
                return done(null, user);
            }
            else {
                //passwords do not match
                return done(null, false, { message: "Incorrect password" });
            }
        });
    });
}));
passport_1.default.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env.JWT_SECRET}`,
}, function (jwtPayload, cb) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return user_1.User.findById(jwtPayload.id)
        .then((user) => {
        return cb(null, user);
    })
        .catch((err) => {
        return cb(err);
    });
}));

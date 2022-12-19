import express, { Application, Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import morganMiddleware from "./config/morganMiddleware";
// import bodyParser from "body-parser";
import indexRouter from "./routes/index";
import passport from "passport";
import compression from "compression";
import helmet from "helmet";

// import Logger from "./lib/logger";
import { User, UserDocument } from "./models/user";

import "./controllers/passportController";
dotenv.config();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(`${mongoDB}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app: Application = express();

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.locals.currentUser = req.user;
  next();
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: UserDocument) => done(err, user));
});

//View Engine setup
app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");

app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "../src/public")));
app.use(cookieParser());
app.use(morganMiddleware);
app.use(session({ secret: "monkeys", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(process.env.PORT, () => console.log("Server running"));

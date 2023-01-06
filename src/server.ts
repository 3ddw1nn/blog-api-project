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
import protectedRouter from "./routes/protectedRoutes";
import cors from "cors";

// import Logger from "./lib/logger";
import { User, UserDocument } from "./models/user";

dotenv.config();
import "./controllers/passportController";

import refreshRouter from "./routes/refresh";
import logoutRouter from "./routes/logout";
// import { verifyJWT } from "./middleware/verifyJWT";

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(`${mongoDB}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app: Application = express();

//View Engine setup
app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: `${process.env.JWT_SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);

//* passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  User.findById(user, (err: Error, user: UserDocument) => {
    if (err) return done(err);
    done(null, user);
  });
});

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../src/public")));
app.use(morganMiddleware);

//current user middleware
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.locals.currentUser = req.user;
  next();
});

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: [
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    ],
  })
);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });
app.options("*", cors());

app.use("/", indexRouter);
app.use("/user", protectedRouter);
app.use("/refresh", refreshRouter);
app.use("/log-out", logoutRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);

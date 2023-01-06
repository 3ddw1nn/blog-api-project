"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const morganMiddleware_1 = __importDefault(require("./config/morganMiddleware"));
// import bodyParser from "body-parser";
const index_1 = __importDefault(require("./routes/index"));
const passport_1 = __importDefault(require("passport"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
// import Logger from "./lib/logger";
const user_1 = require("./models/user");
require("./controllers/passportController");
dotenv_1.default.config();
const mongoDB = process.env.MONGODB_URI;
mongoose_1.default.connect(`${mongoDB}`);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const app = (0, express_1.default)();
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.User.findById(id, (err, user) => done(err, user));
});
//View Engine setup
app.set("views", path_1.default.join(__dirname, "../src/views"));
app.set("view engine", "pug");
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../src/public")));
app.use((0, cookie_parser_1.default)());
app.use(morganMiddleware_1.default);
app.use((0, express_session_1.default)({ secret: "monkeys", resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", index_1.default);
app.use("/user", passport_1.default.authenticate("jwt", { session: false }), protectedRoutes_1.default);
app.listen(process.env.PORT, () => console.log("Server running"));

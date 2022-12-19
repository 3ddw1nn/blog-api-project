"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_signup_post = exports.forgot_password_submit_get = exports.forgot_password_post = exports.forgot_password_get = exports.user_admin_post = exports.user_admin_get = exports.user_signup_get = exports.user_login_post = exports.user_logout_get = exports.user_login_get = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const post_1 = require("../models/post");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const user_login_get = (req, res) => {
    res.render("log-in-form", {
        title: "Log In",
        user: req.user,
    });
};
exports.user_login_get = user_login_get;
const user_logout_get = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
exports.user_logout_get = user_logout_get;
exports.user_login_post = [
    (0, express_validator_1.body)("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        passport_1.default.authenticate("local", (err, user) => {
            if (err || !user) {
                if (!errors.isEmpty()) {
                    res.render("log-in-form", {
                        title: "Log In",
                        user: req.user,
                        errors: errors.array(),
                    });
                }
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                const payload = { user };
                const token = jsonwebtoken_1.default.sign(payload, `${process.env.JWT_SECRET}`, {
                    expiresIn: "2s",
                });
                post_1.Post.find()
                    .populate("user")
                    .exec((err, posts) => {
                    if (err) {
                        return next(err);
                    }
                    //Successful, so render
                    res.render("index", {
                        title: "Welcome to Send Moods",
                        user: req.user,
                        posts,
                        token,
                    });
                });
            });
            return;
        })(req, res);
    },
];
const user_signup_get = (req, res) => {
    res.render("sign-up-form", {
        title: "Sign Up",
        user: req.user,
    });
};
exports.user_signup_get = user_signup_get;
const user_admin_get = (req, res) => {
    res.render("admin-join", {
        user: req.user,
    });
};
exports.user_admin_get = user_admin_get;
exports.user_admin_post = [
    // Validate and sanitize fields.
    (0, express_validator_1.body)("admin_code", "Admin Code must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (req, res, next) => {
        var _a;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("admin-join", {
                title: "Enter Admin Code",
                errors: errors.array(),
            });
            return;
        }
        else {
        }
        if (req.body.admin_code !== process.env.ADMIN_CODE) {
            res.render("admin-join", {
                title: " Enter Admin Code",
                errors: "Wrong Code",
            });
        }
        else {
            user_1.User.findOneAndUpdate({ username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username }, { admin_status: true }, {}, function (err, result) {
                if (err)
                    return next(err);
                res.redirect("/");
            });
        }
    },
];
const forgot_password_get = (req, res) => {
    res.render("forgot-password-form", {
        title: "Forgot Your Password?",
        user: req.user,
    });
};
exports.forgot_password_get = forgot_password_get;
exports.forgot_password_post = [
    // Validate and sanitize fields.
    (0, express_validator_1.body)("email", "Email address must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("forgot-password-form", {
                title: "Forgot Your Password?",
                errors: errors.array(),
            });
            return;
        }
        else {
            res.redirect("/forgot-password-submission");
        }
    },
];
const forgot_password_submit_get = (req, res) => {
    res.render("forgot-password-submission", {
        title: "Email Sent",
        user: req.user,
    });
};
exports.forgot_password_submit_get = forgot_password_submit_get;
exports.user_signup_post = [
    // Validate and sanitize fields.
    (0, express_validator_1.body)("first_name", "First name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("last_name", "Last name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("job_title", "Job Title must not be empty ")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)("username", "username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("password", "Password must be at least 6 characters. ")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (req.file) {
            const receivedPath = req.file.path;
            const cleanedPath = receivedPath.slice(10);
            if (!errors.isEmpty()) {
                res.render("sign-up-form", {
                    title: "Sign Up",
                    errors: errors.array(),
                    user: req.user,
                });
                return;
            }
            else {
                bcrypt_1.default.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err)
                        return next(err);
                    const user = new user_1.User({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        job_title: req.body.job_title,
                        email: req.body.email,
                        username: req.body.username,
                        password: hashedPassword,
                        admin_status: false,
                        image: cleanedPath,
                    });
                    user.save((err) => (err ? next(err) : res.redirect("/log-in")));
                });
            }
        }
        else {
            throw new Error("No req.file found");
        }
    },
];

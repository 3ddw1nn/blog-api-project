"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_post_post = exports.create_post_get = exports.index = void 0;
// import { CallbackError } from "mongoose";
// import Logger from "../lib/logger";
const post_1 = require("../models/post");
const express_validator_1 = require("express-validator");
const index = (req, res, next) => {
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
        });
    });
};
exports.index = index;
const create_post_get = (req, res) => {
    res.render("create-post-form", {
        title: "Create a Post",
        user: req.user,
        // posts,
    });
};
exports.create_post_get = create_post_get;
exports.create_post_post = [
    (0, express_validator_1.body)("post_title")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Title must not be empty"),
    (0, express_validator_1.body)("text")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Text must not be empty"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("create-post-form", {
                title: "Create a Post",
                user: req.user,
                errors: errors.array(),
            });
        }
        const post = new post_1.Post({
            user: req.user,
            post_title: req.body.post_title,
            text: req.body.text,
            timestamp: Date.now(),
        });
        post.save((err) => {
            if (err)
                return next(err);
            res.redirect("/");
        });
    },
];

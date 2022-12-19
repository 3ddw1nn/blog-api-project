// import express from "express";
import { NextFunction, Request, Response } from "express";
// import { CallbackError } from "mongoose";
// import Logger from "../lib/logger";
import { Post } from "../models/post";
import { body, validationResult } from "express-validator";

export const index = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
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

export const create_post_get = (req: Request, res: Response) => {
  res.render("create-post-form", {
    title: "Create a Post",
    user: req.user,
    // posts,
  });
};

export const create_post_post = [
  body("post_title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not be empty"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text must not be empty"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("create-post-form", {
        title: "Create a Post",
        user: req.user,
        errors: errors.array(),
      });
    }

    const post = new Post({
      user: req.user,
      post_title: req.body.post_title,
      text: req.body.text,
      timestamp: Date.now(),
    });

    post.save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
];

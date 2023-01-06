import { NextFunction, Request, Response } from "express";
import { Post } from "../models/post";
import { User, UserDocument } from "../models/user";
import { body, validationResult } from "express-validator";

export const index = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
    .populate("user")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      User.find().exec((err, users) => {
        if (err) {
          return next(err);
        }
        res.json({
          user: req.user,
          posts,
          users,
        });
      });
    });
};

export const create_post_get = (req: Request, res: Response) => {
  res.json({
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
      return res.json({
        user: req.user,
        errors: errors.array(),
      });
    }

    User.findOne(
      { username: req.user?.username },
      (err: Error, foundUser: UserDocument) => {
        if (err) {
          return next(err);
        }

        const post = new Post({
          user: foundUser,
          post_title: req.body.post_title,
          text: req.body.text,
          timestamp: Date.now(),
        });

        post.save((err) => {
          if (err) return next(err);
          return res.sendStatus(200);
        });
      }
    );
    return;
  },
];

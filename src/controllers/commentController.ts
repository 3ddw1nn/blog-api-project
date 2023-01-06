import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { Comment } from "../models/comment";
import { Post } from "../models/post";

export const post_comment_index = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Post.findById(req.params.id)
    .populate("user")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      Comment.find({
        post: req.params.id,
      })
        .populate("user")
        .populate("post")
        .exec((err, comments) => {
          if (err) {
            return next(err);
          }

          //Successful, so render
          res.json({
            user: req.user,
            post,
            comments,
          });
        });
    });
};

export const comment_create_post = [
  body("comment_text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must not be empty"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        user: req.user,
        errors: errors.array(),
      });
    }

    const comment = new Comment({
      user: req.user,
      post: req.params.id,
      comment_text: req.body.comment_text,
      timestamp: Date.now(),
    });

    comment.save((err) => {
      if (err) return next(err);
      Comment.find({
        post: req.params.id,
      })
        .populate("user")
        .populate("post")
        .exec((err, comments) => {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ comments: comments });
        });
    });
  },
];

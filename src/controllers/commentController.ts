import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { Comment } from "../models/comment";
import { Post } from "../models/post";

// import jwt from "jsonwebtoken";
// import passport from "passport";
// import { UserPostRequest } from "../types";
// import { IPostRequest } from "../types";

// export const post_comment_index = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   passport.authenticate("local", { session: false }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: "Something is not right",
//         user: user,
//       });
//     }
//     req.login(user, { session: false }, (err) => {
//       if (err) {
//         return next(err);
//       }
//       const payload = { user };
//       const token = jwt.sign(payload, `${process.env.JWT_SECRET}`);
//       return Post.findById(req.params.id)
//         .populate("user")
//         .exec((err, post) => {
//           if (err) {
//             return next(err);
//           }
//           Comment.find({
//             post: req.params.id,
//           })
//             .populate("user")
//             .populate("post")
//             .exec((err, comments) => {
//               if (err) {
//                 return next(err);
//               }

//               //Successful, so render
//               res.render("post-detail", {
//                 title: "Welcome to Send Moods",
//                 user: req.user,
//                 post,
//                 comments,
//                 token,
//               });
//             });
//         });
//     });
//   })(req, res);
// };

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
          res.render("post-detail", {
            title: "Welcome to Send Moods",
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
      res.render("post-detail", {
        title: "Comment on Post",
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
      res.redirect(`/posts/${req.params.id}`);
    });
  },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment_create_post = exports.post_comment_index = void 0;
const express_validator_1 = require("express-validator");
const comment_1 = require("../models/comment");
const post_1 = require("../models/post");
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
const post_comment_index = (req, res, next) => {
    post_1.Post.findById(req.params.id)
        .populate("user")
        .exec((err, post) => {
        if (err) {
            return next(err);
        }
        comment_1.Comment.find({
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
exports.post_comment_index = post_comment_index;
exports.comment_create_post = [
    (0, express_validator_1.body)("comment_text")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Comment must not be empty"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.render("post-detail", {
                title: "Comment on Post",
                user: req.user,
                errors: errors.array(),
            });
        }
        const comment = new comment_1.Comment({
            user: req.user,
            post: req.params.id,
            comment_text: req.body.comment_text,
            timestamp: Date.now(),
        });
        comment.save((err) => {
            if (err)
                return next(err);
            res.redirect(`/posts/${req.params.id}`);
        });
    },
];

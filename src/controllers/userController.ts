import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { User } from "../models/user";
import { Post } from "../models/post";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const user_login_get = (req: Request, res: Response) => {
  res.render("log-in-form", {
    title: "Log In",
    user: req.user,
  });
};

export const user_logout_get = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export const user_login_post = [
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    passport.authenticate("local", (err, user) => {
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
        const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
          expiresIn: "2s",
        });

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
              token,
            });
          });
      });

      return;
    })(req, res);
  },
];

export const user_signup_get = (req: Request, res: Response) => {
  res.render("sign-up-form", {
    title: "Sign Up",
    user: req.user,
  });
};

export const user_admin_get = (req: Request, res: Response) => {
  res.render("admin-join", {
    user: req.user,
  });
};

export const user_admin_post = [
  // Validate and sanitize fields.
  body("admin_code", "Admin Code must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("admin-join", {
        title: "Enter Admin Code",
        errors: errors.array(),
      });
      return;
    } else {
    }
    if (req.body.admin_code !== process.env.ADMIN_CODE) {
      res.render("admin-join", {
        title: " Enter Admin Code",
        errors: "Wrong Code",
      });
    } else {
      User.findOneAndUpdate(
        { username: req.user?.username },
        { admin_status: true },
        {},
        function (err, result) {
          if (err) return next(err);
          res.redirect("/");
        }
      );
    }
  },
];

export const forgot_password_get = (req: Request, res: Response) => {
  res.render("forgot-password-form", {
    title: "Forgot Your Password?",
    user: req.user,
  });
};

export const forgot_password_post = [
  // Validate and sanitize fields.
  body("email", "Email address must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("forgot-password-form", {
        title: "Forgot Your Password?",
        errors: errors.array(),
      });
      return;
    } else {
      res.redirect("/forgot-password-submission");
    }
  },
];

export const forgot_password_submit_get = (req: Request, res: Response) => {
  res.render("forgot-password-submission", {
    title: "Email Sent",
    user: req.user,
  });
};

export const user_signup_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("job_title", "Job Title must not be empty ")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
  body("username", "username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 6 characters. ")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
      } else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) return next(err);

          const user = new User({
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
    } else {
      throw new Error("No req.file found");
    }
  },
];

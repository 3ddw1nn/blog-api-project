import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { User, UserDocument } from "../models/user";
// import { Post } from "../models/post";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

import dotenv from "dotenv";
dotenv.config();

// export const user_logout_get = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("http://localhost:3000/");
//   });
// };

export const user_login_get = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};

export const user_login_post = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", (err, user) => {
    console.log("this is user " + user);
    if (err) {
      return res
        .status(400)
        .json({ message: "Something went wrong with passport..." });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found with these credentials" });
    }

    req.login(user, (err) => {
      // * LOGIN FAILED
      if (err) {
        console.log("login failed");
        return res.send(err);
      }

      // * LOGIN SUCCESSFUL
      const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        job_title: user.job_title,
        email: user.email,
        username: user.username,
        roles: user.roles,
      };

      const accessToken = jwt.sign(
        payload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "15s",
        }
      );
      const refreshToken = jwt.sign(
        payload,
        `${process.env.REFRESH_TOKEN_SECRET}`,
        {
          expiresIn: "1d",
        }
      );

      User.findOneAndUpdate(
        { username: req.user?.username },
        { refreshToken: refreshToken },
        (err: Error, user: UserDocument) => {
          if (err) return next(err);

          return res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ accessToken, roles: user.roles });
        }
      );
      return;
    });
    return;
  })(req, res, next);
};

export const user_signup_get = (req: Request, res: Response) => {
  res.json({
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
  body("email", "Email must not be empty")
    .exists()
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      return await User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
        return;
      });
    })
    .escape(),
  body("username", "Invalid username").trim().escape(),
  body("password", "Password must be at least 6 characters. ")
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

    if (!req.file) {
      return console.error("Please upload a file");
    }

    if (req.file) {
      const receivedPath = req.file.path;
      const cleanedPath = receivedPath.slice(10);

      if (!errors.isEmpty()) {
        return res.json({
          message: errors.array(),
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);

        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          job_title: req.body.job_title,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          image: cleanedPath,
        });

        user.save((err) => {
          if (err) {
            next(err);
          }
          return res.status(200).json({ message: "User Created!" });
        });
      });
      return;
    } else {
      throw new Error("No req.file found");
    }
  },
];

export const user_admin_get = (req: Request, res: Response) => {
  res.json({
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
    console.log(req.body.admin_code);
    const errors = validationResult(req);

    // * errors in validation
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
      return;
    }

    // * admin code incorrect
    if (req.body.admin_code !== process.env.ADMIN_CODE) {
      res.json({
        errors: "Wrong Code",
      });
    }

    if (req.user) {
      // * no validation errors and admin code is correct
      console.log("Finding user and updating role");
      User.findOne(
        { username: req.user?.username },
        (err: Error, foundUser: UserDocument) => {
          if (err) {
            return console.error(err);
          }

          if (foundUser.roles.includes("5051")) {
            res.sendStatus(409);
          }

          User.findOneAndUpdate(
            { username: req.user?.username },
            { $push: { roles: "5051" } },
            { new: true },
            (err: Error, updatedUser: UserDocument) => {
              if (err) return next(err);

              return res.status(200).json({
                roles: updatedUser.roles,
                message: "user role updated",
              });
            }
          );
        }
      );
    }
  },
];

// app.options("*",cors())

export const forgot_password_get = (req: Request, res: Response) => {
  res.json({
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
      res.json({
        errors: errors.array(),
      });
      return;
    } else {
      res.redirect("/forgot-password-submission");
    }
  },
];

export const forgot_password_submit_get = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};

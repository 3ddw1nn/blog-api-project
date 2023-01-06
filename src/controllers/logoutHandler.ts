import { NextFunction, Request, Response } from "express";

import { User, UserDocument } from "../models/user";

import dotenv from "dotenv";
dotenv.config();

export const handleLogOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //on client, also delete the access token
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    console.log("cookies dont exist");
    console.log(cookies.refreshToken);
    return res.sendStatus(204); // no content to send back
  }

  //is refresh token in DB

  const refreshToken = cookies.refreshToken;
  console.log(refreshToken);

  req.logOut((err) => {
    if (err) {
      next(err);
    }
    User.findOneAndUpdate(
      { username: req.user?.username },
      { refreshToken: "" },
      (err: Error, foundUser: UserDocument) => {
        if (err) return res.sendStatus(403);

        if (!foundUser) {
          res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          return res.sendStatus(204); //
        }
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        console.log(req.user);
        console.log("refresh token removed from mongo");
        //* Find User and update refresh token
        //delete refreshtoken in Mongo
        return res.sendStatus(200);
      }
    );
  });

  return;
};

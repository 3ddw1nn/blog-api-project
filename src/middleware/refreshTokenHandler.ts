import { Request, Response } from "express";

import { User, UserDocument } from "../models/user";
// import { Post } from "../models/post";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const handleRefreshToken = (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.refreshToken) return res.sendStatus(401); // Unauthorized
  // console.log(cookies.refresh_token);

  const refreshToken = cookies.refreshToken;

  //* Find User and update refresh token
  User.findOne(
    { refreshToken: refreshToken },
    (err: Error, foundUser: UserDocument) => {
      if (err) return res.sendStatus(403);

      if (!foundUser) {
        return res
          .status(403) // Forbidden
          .json({ message: "No user found with this username" });
      }

      interface MyToken {
        first_name: string;
        last_name: string;
        job_title: string;
        email: string;
        username: string;
        roles: object;
        admin_status: boolean;
      }

      // decode refreshtoken
      const decodedToken = jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`
      );

      if (decodedToken instanceof Error) {
        throw new Error(`jwt.verify decoded object: ${decodedToken}`);
      }

      // Type checking function
      function verifyDecodedToken(data: unknown): asserts data is MyToken {
        if (!(data instanceof Object))
          throw new Error("Decoded token error. Token must be an object");
        if (!("username" in data))
          throw new Error(
            'Decoded token error. Missing required field "username"'
          );
        // other necessary checks
      }
      verifyDecodedToken(decodedToken);

      // now we know that "decodedToken" is of type MyToken

      // did the decoded username not match the username found in MongoDB?
      if (foundUser.username !== decodedToken.username) {
        return res.status(403).json({
          message: "decoded username did not match the username in Mongo",
        });
      }

      // SUCCESS - decoded username matches username found in MongoDB. RefreshToken is still valid so assign a new accessToken

      const payload = {
        username: decodedToken.username,
      };

      const accessToken = jwt.sign(
        payload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        { expiresIn: "15s" }
      );

      return res.json({ accessToken });
    }
  );
  return;
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { UserDocument } from "../models/user";
import { VerifyErrors, Jwt } from "jsonwebtoken";
// import { UserDocument } from "../models/user";
dotenv.config();

interface MyToken {
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
  roles: string[];
  username: string;
  admin_status: boolean;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log("1 One- authHeader exists in header  " + authHeader);

  //* Check if authHeader is typeof string
  const authHeaderString = authHeader?.toString();
  if (typeof authHeaderString !== "string") {
    console.log("2 Two- authHeader not typeof string  " + authHeaderString);
    return res
      .status(401)
      .json({ message: "req.headers.authorization is not type String" }); //Unauthorized
  }

  //* Check to see starts with Bearer
  if (!authHeaderString.startsWith("Bearer")) {
    console.log("3 Three - authHeaderString does not start with Bearer  ");
    authHeaderString;
    return res.sendStatus(401);
  }

  //* OK - All Checks Passed
  console.log(
    "OK - 4 Four- authHeaderString exists and is of type string " +
      authHeaderString
  );

  const token = authHeaderString.split(" ")[1];
  console.log("OK- 5 Five - this is the split token value " + token);

  jwt.verify(
    token,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    { complete: true },
    (err: VerifyErrors | null, decoded: Jwt | undefined) => {
      if (err) {
        return res.status(403).json({ message: "403 error: did not verify" });
      }

      if (!decoded) {
        throw new Error("decoded object is undefined");
      }

      if (typeof decoded?.payload === "string") {
        const decodedObject = JSON.parse(decoded.payload) as MyToken;

        req.user = {
          first_name: decodedObject.first_name,
          last_name: decodedObject.last_name,
          job_title: decodedObject.job_title,
          email: decodedObject.email,
          roles: decodedObject.roles,
          username: decodedObject.username,
          admin_status: decodedObject.admin_status,
        };
        next();
      } else {
        //* decoded.payload is type Jwt.jwtPayload
        const payload = decoded?.payload;
        req.user = {
          first_name: payload?.first_name,
          last_name: payload?.last_name,
          job_title: payload?.job_title,
          email: payload?.email,
          roles: payload?.roles,
          username: payload?.username,
          admin_status: payload?.admin_status,
        };
        next();
      }
    }
  );
};

// const decodedToken: unknown = jwt.verify(
//   token,
//   `${process.env.ACCESS_TOKEN_SECRET}`,
//   { complete: true },
//   (err: VerifyErrors | null, decoded: Jwt | undefined) => {
//     if (err) return res.status(403).json({ message: "invalid Token" }); //invalid token
//     req.user = {
//       first_name: decoded.first_name,
//       last_name: decoded.last_name,
//       job_title: decoded.job_title,
//       email: decoded.email,
//       roles: decoded.roles,
//       username: decoded.username,
//       admin_status: decoded.admin_status,
//     };
//     return;
//   }
// );

//   const decodedToken: unknown = jwt.verify(
//     token,
//     `${process.env.ACCESS_TOKEN_SECRET}`
//   );

//   verifyDecodedToken(decodedToken);

//   req.user = {
//     first_name: decodedToken.first_name,
//     last_name: decodedToken.last_name,
//     job_title: decodedToken.job_title,
//     email: decodedToken.email,
//     roles: decodedToken.roles,
//     username: decodedToken.username,
//     admin_status: decodedToken.admin_status,
//   };
// }

// next

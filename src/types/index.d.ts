// import { UserDocument } from "../models/user";
import { Request } from "express";
import { PostDocument } from "../models/post";

// interface IUserRequest extends Request {
//   user: UserDocument;
// }

export {};

declare global {
  namespace Express {
    interface User {
      first_name: string;
      last_name: string;
      job_title: string;
      email: string;
      username: string;
      password: string;
      admin_status: boolean;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      file: Express.Multer.File;
    }
  }
}
// export interface fileRequest extends Request {
//   file: Express.Multer.File;
// }

// interface IPostRequest extends Request {
//   post: PostDocument;
// }
// interface UserPostRequest extends Request {
//   user: UserDocument;
//   post: PostDocument;
// }

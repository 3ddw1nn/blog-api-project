import express from "express";
import { Request } from "express";
import * as user_controller from "../controllers/userController";
import * as post_controller from "../controllers/postController";
import * as comment_controller from "../controllers/commentController";

import multer from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// import path from "path";

const router = express.Router();

export const fileStorage = multer.diskStorage({
  destination: (
    request: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    const path = `src/public/images`;
    callback(null, path);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    console.log(file);
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: fileStorage,
});

router.get("/", post_controller.index);

router.get("/log-in", user_controller.user_login_get);
router.post("/log-in", user_controller.user_login_post);

router.get("/log-out", user_controller.user_logout_get);

router.get("/sign-up", user_controller.user_signup_get);
router.post(
  "/sign-up",
  upload.single("image"),
  user_controller.user_signup_post
);

router.get("/join-admin", user_controller.user_admin_get);
router.post("/join-admin", user_controller.user_admin_post);

router.get("/create-post", post_controller.create_post_get);
router.post("/create-post", post_controller.create_post_post);

router.get("/forgot-password", user_controller.forgot_password_get);
router.post("/forgot-password", user_controller.forgot_password_post);

router.get(
  "/forgot-password-submission",
  user_controller.forgot_password_submit_get
);
router.get("/posts/:id", comment_controller.post_comment_index);
router.post("/posts/:id", comment_controller.comment_create_post);

export default router;

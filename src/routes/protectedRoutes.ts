import express from "express";

import * as user_controller from "../controllers/userController";
import * as post_controller from "../controllers/postController";
// import path from "path";
import verifyRoles from "../middleware/verifyRoles";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.get("/join-admin", verifyRoles("2001"), user_controller.user_admin_get);
router.post(
  "/join-admin",
  verifyRoles("2001"),
  user_controller.user_admin_post
);

router.get(
  "/create-post",
  verifyRoles("5051"),
  post_controller.create_post_get
);
router.post(
  "/create-post",
  verifyRoles("5051"),
  verifyJWT,
  post_controller.create_post_post
);

export default router;

import express from "express";
import { handleLogOut } from "../controllers/logoutHandler";
const router = express.Router();

router.get("/", handleLogOut);

export default router;

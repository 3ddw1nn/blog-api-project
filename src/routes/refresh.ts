import express from "express";
import { handleRefreshToken } from "../middleware/refreshTokenHandler";
const router = express.Router();

router.get("/", handleRefreshToken);

export default router;

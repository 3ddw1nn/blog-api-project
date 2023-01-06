"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorage = void 0;
const express_1 = __importDefault(require("express"));
const user_controller = __importStar(require("../controllers/userController"));
const post_controller = __importStar(require("../controllers/postController"));
const comment_controller = __importStar(require("../controllers/commentController"));
const multer_1 = __importDefault(require("multer"));
// import path from "path";
const router = express_1.default.Router();
exports.fileStorage = multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        const path = `src/public/images`;
        callback(null, path);
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage: exports.fileStorage,
});
router.get("/", post_controller.index);
router.get("/log-in", user_controller.user_login_get);
router.post("/log-in", user_controller.user_login_post);
router.get("/log-out", user_controller.user_logout_get);
router.get("/sign-up", user_controller.user_signup_get);
router.post("/sign-up", upload.single("image"), user_controller.user_signup_post);
router.get("/join-admin", user_controller.user_admin_get);
router.post("/join-admin", user_controller.user_admin_post);
router.get("/forgot-password-submission", user_controller.forgot_password_submit_get);
router.get("/posts/:id", comment_controller.post_comment_index);
router.post("/posts/:id", comment_controller.comment_create_post);
exports.default = router;

import express from "express";
import {
  // forgotPassword,
  login,
  register,
  // resetPassword,
  // updatePassword,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
// router.post("/register",register);
// router.post("/forgotPassword", forgotPassword);
// router.patch("/resetPassword/:token", resetPassword);
// router.post("/updatePassword", verifyToken, updatePassword);

export default router;

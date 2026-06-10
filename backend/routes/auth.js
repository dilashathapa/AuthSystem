import express from "express";
import { login, logout, register, refreshToken } from "../controllers/authController.js";

const router = express.Router();
//===AUTH ROUTES===
router.post("/register", register);// Route to register a new user
router.post("/login", login);// Route to log in an existing user
router.get("/refresh", refreshToken);// Route to generate a new access token using refresh token
router.post("/logout", logout);// Route to log out user and clear refresh token cookie

export default router;// Export router for use in the main application
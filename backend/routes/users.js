import express from "express";
import {verifyRole, verifyToken} from "../middleware/authMiddleware.js";
import {deleteUser, getProfile, getUsers} from "../controllers/userController.js";

const router = express.Router(); // Create a new Express router instance
//===USER ROUTES===

// Accessible only by authenticated users with admin role
router.get("/", verifyToken, verifyRole("admin"), getUsers);// Route to fetch all users with pagination
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser); // Route to delete a user by ID
router.get("/me", verifyToken, getProfile);// Route to fetch the currently logged-in user's profile

export default router;
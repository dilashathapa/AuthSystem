import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config(); // Load environment variables
const PORT = process.env.PORT || 5000;// Get port from environment variables or use 5000 as default
const app = express();// Create Express application

//===MIDDLEWARE===
app.use(express.json());// Parse incoming JSON requests
// Enable CORS for frontend application
app.use(cors({
    origin: "http://localhost:5173",// Frontend URL
    credentials: true,// Allow cookies and credentials

}))
app.use(cookieParser());// Parse cookies from incoming requests

//===ROUTES===
app.use('/api/auth', authRoutes);// Authentication routes
app.use('/api/users', userRoutes);// User management routes

//===DATABASE CONNECTION===
connectDB();

// Start server and listen on specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
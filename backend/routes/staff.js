import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get staff profile
router.get('/staff/profile', verifyToken, async (req, res) => {
  try {
    // Get user ID from the token (req.user contains the decoded token)
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has STAFF or ADMIN role
    if (user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Staff only.' });
    }
    
    res.json({ data: user });
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

export default router;
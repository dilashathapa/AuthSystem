// routes/admin.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get admin stats
router.get('/admin/stats', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    const staffCount = await User.countDocuments({ role: 'STAFF' });
    const customerCount = await User.countDocuments({ role: 'CUSTOMER' });

    res.json({
      data: {
        totalUsers,
        adminCount,
        staffCount,
        customerCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// List all users
router.get('/admin/users', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Change user role
router.put('/admin/users/:id/role', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const { role } = req.query;
    const userId = req.params.id;

    if (userId === req.user?.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const validRoles = ['ADMIN', 'STAFF', 'CUSTOMER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    console.error('Error changing role:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// Toggle user status
router.put('/admin/users/:id/status', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user?.id) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.enabled = !user.enabled;
    await user.save();

    res.json({ data: { id: user._id, enabled: user.enabled } });
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Failed to toggle status' });
  }
});

// Delete user
router.delete('/admin/users/:id', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user?.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// CREATE STAFF - Main endpoint
router.post('/admin/staff', verifyToken, verifyRole('ADMIN'), async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;

    console.log('Creating staff with data:', { username, email, fullName });

    // Validate required fields
    if (!username || !email || !fullName || !password) {
      return res.status(400).json({ 
        message: 'All fields are required: username, email, fullName, password' 
      });
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create staff user
    const staff = new User({
      username,
      email,
      fullName,
      password: hashedPassword,
      role: 'STAFF',
      enabled: true
    });

    await staff.save();

    // Return staff without password
    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.status(201).json({
      message: 'Staff user created successfully',
      data: staffResponse
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ 
      message: 'Failed to create staff user',
      error: error.message 
    });
  }
});

export default router;
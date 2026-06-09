import User from "../models/User.js";

//Controller to fetch users with pagination
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default is 1
        const limit = parseInt(req.query.limit) || 2;  // Get limit from query parameter, default is 2 users per page
        const skip = (page - 1) * limit; // Calculate number of documents to skip
        const total = await User.countDocuments();  // Count total number of users in the database
        const users = await User.find().skip(skip).limit(limit).select("-password");  // Fetch users with pagination and exclude password field

        // Send paginated users and pagination details
        res.status(200).json({
            users, total, totalPages: Math.ceil(total / limit), currentPage: page 
        })
    } catch (error) {
        console.error("Error fetching users:", error); //Log error
        return res.status(500).json({message: "Server error"}); //Return server error response
        
    }
}
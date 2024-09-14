const express = require("express");
const { registerUser, authUser, getAllUsers, editProfile, deleteAccount,getUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user authentication/login
router.post("/login", authUser);

// Route for fetching all users (protected)
router.get("/allusers", protect, getAllUsers);

//
// Route for fetching all users (protected)
router.get("/", protect, getUser);
//
router.put('/editProfile',protect, editProfile);

//
router.delete("/deleteAccount",protect, deleteAccount);

module.exports = router;

import express from "express";
import {registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay} from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router(); // Create a new router instance
userRouter.post("/register", registerUser); // Route for user registration
userRouter.post("/login", loginUser); // Route for user login
userRouter.get("/credits", userAuth, userCredits); // Route to get user credits
userRouter.post("/pay-razor", userAuth, paymentRazorpay); // Route to get user credits
userRouter.post("/verify-razor", userAuth, verifyRazorpay); // Route to get user credits

export default userRouter; // Export the router for use in the main server file
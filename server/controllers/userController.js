// what is this file about?
// This file contains the user controller for handling user-related operations.
// what is mean by user controller?
// A user controller is a part of the MVC (Model-View-Controller) architecture that manages user-related logic, such as creating, updating, and deleting users, as well as handling authentication and authorization.

import userModel from '../models/userModal.js'; // Import the User model
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token generation
import razorpay from 'razorpay';
import transactionModel from '../models/transactionModal.js';
import crypto from 'crypto';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructure the request body to get user details
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' }); // Check if all fields are provided
        }

        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing the password // Salt is a random value added to the password before hashing to ensure that the same password does not always produce the same hash.
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt

        // const userData = new userModel({ // Create a new user instance
        //     name,
        //     email,
        //     password: hashedPassword // Store the hashed password instead of the plain text password
        // });

        const userData = { // Create a new user instance
            name,
            email,
            password: hashedPassword // Store the hashed password instead of the plain text password
        };

        const newUser = new userModel(userData); // Save the user to the database
        const user = await newUser.save(); // Save the user instance to the database

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Generate a JWT token for the user // Sign the token with the user's ID and a secret key from environment variables, setting it to expire in 30 days

        res.json({ success: true, token, user: { name: user.name } })
    }

    catch (error) {
        console.error('Error registering user:', error); // Log the error for debugging
        res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure the request body to get email and password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' }); // Check if all fields are provided
        }

        const user = await userModel.findOne({ email }); // Find the user by email in the database
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' }); // If user not found, respond with an error
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the stored hashed password
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Generate a JWT token for the user // Sign the token with the user's ID and a secret key from environment variables, setting it to expire in 30 days
            res.json({ success: true, token, user: { name: user.name } })
        }
        else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' }); // If password does not match, respond with an error
        }
    }

    catch (error) {
        console.error('Error logging in user:', error); // Log the error for debugging
        res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
    }
}

const userCredits = async (req, res) => {
    try {
        // const {userId} = req.body; // Get the user ID from the request body
        const userId = req.userId; // Get the user ID from the request body
        const user = await userModel.findById(userId); //
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } }); // Respond with the user's credits

        // if (!user) {
        //     return res.status(404).json({ success: false, message: "User not found" });
        // }

        // res.json({
        //     success: true,
        //     credits: user.creditBalance, // assuming this field exists in DB
        //     user: { name: user.name }
        // });
    }
    catch (error) {
        console.error('Error fetching user credits:', error.message); // Log the error for debugging
        res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});


// const paymentRazorpay = async (req, res) => {
//     try {
//         // const {userId, planId} = req.body; // Get the user ID and plan ID from the request body
//         // const userData = await userModel.findById(userId); // Find the user by ID in the database

//         const userId = req.userId; // ✅ From token via auth middleware
//         const { planId } = req.body;
//         const userData = await userModel.findById(userId);


//         if (!userId || !planId) {
//             return res.status(400).json({ success: false, message: 'Missing Details' }); // Check if user ID and plan ID are provided
//         }

//         // const userData = await userModel.findById(userId);
//         if (!userData) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         let credits, plan, amount, data

//         switch (planId) {
//             case 'Basic':
//                 plan = 'Basic'
//                 credits = 100
//                 amount = 10
//                 break;
//             case 'Advanced':
//                 plan = 'Advanced'
//                 credits = 500
//                 amount = 50
//                 break;
//             case 'Business':
//                 plan = 'Business'
//                 credits = 5000
//                 amount = 250
//                 break;

//             default:
//                 return res.status(400).json({ success: false, message: 'Invalid Plan' }); // Check if the plan ID is valid
//         }

//         const date = Date.now(); // Get the current date and time

//         const transactionData = {
//             userId, plan, amount, credits, date // Create a transaction data object
//         }

//         const newTransaction = await transactionModel.create(transactionData); // Create a new transaction in the database

//         const options = {
//             amount: amount * 100, // Amount in paise (Razorpay requires the amount in paise)
//             currency: process.env.CURRENCY, // Currency code
//             // receipt: newTransaction._id, // Use the transaction ID as the receipt
//             receipt: newTransaction._id.toString(), // Use the transaction ID as the receipt
//             // notes: {
//             //     userId, // Include user ID in notes
//             //     planId // Include plan ID in notes
//             // }
//         }

//         // await razorpayInstance.orders.create(options, (error, order) => {
//         razorpayInstance.orders.create(options, (error, order) => {
//             if (error) {
//                 console.log(error.message); // Log the error for debugging
//                 return res.status(500).json({ success: false, message: error.message }); //
//             }
//             res.json({ success: true, order }); // Respond with the order ID and other details
//         })
//     }
//     catch (error) {
//         console.log(error.message)
//         res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
//     }
// }


const paymentRazorpay = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.userId;

        // Validate input
        if (!['Basic', 'Advanced', 'Business'].includes(planId)) {
            return res.status(400).json({ success: false, message: 'Invalid plan selected' });
        }

        // Get user and validate
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Plan configuration
        const planConfig = {
            'Basic': { credits: 100, amount: 10 },
            'Advanced': { credits: 500, amount: 50 },
            'Business': { credits: 5000, amount: 250 }
        };

        // Create transaction
        const transaction = await transactionModel.create({
            userId,
            plan: planId,
            amount: planConfig[planId].amount,
            credits: planConfig[planId].credits,
            date: new Date()
        });

        // Razorpay order options
        const options = {
            amount: planConfig[planId].amount * 100,
            currency: 'INR',
            receipt: transaction._id.toString(),
            payment_capture: 1,
            notes: {
                userId: userId.toString(),
                transactionId: transaction._id.toString()
            }
        };

        // Create order
        const order = await razorpayInstance.orders.create(options);
        
        return res.json({ 
            success: true, 
            order,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.error?.description || 'Payment processing failed' 
        });
    }
}


// const verifyRazorpay = async (req, res) => {
//     try{
//         const {razorpay_order_id} = req.body; // Get the Razorpay order ID from the request body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id); // Fetch the order details from Razorpay

//         if(orderInfo.status === 'paid') { // Check if the order status is 'paid'
//             const transactionData = await transactionModel.findOne(orderInfo.receipt); // Find the transaction in the database using the Razorpay order ID
//             if(transactionData.payment){
//                 return res.status(400).json({ success: false, message: 'Payment failed' }); // If payment is already verified, respond with an error
//             }
//             const userData = await userModel.findById(transactionData.userId); // Find the user by ID in the database
//             const creditBalance = userData.creditBalance + transactionData.credits; // Calculate the new credit balance
//             // await userModel.findByIdAndUpdate(userData._id, { creditBalance }, { new: true }); // Update the user's credit balance in the database
//             await userModel.findByIdAndUpdate(userData._id, { creditBalance }); // Update the user's credit balance in the database

//             await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true }, {new: true}); // Update the transaction status to 'paid' in the database

//             res.json({ success: true, message: 'Payment verified successfully', credits: transactionData.credits }); // Respond with a success message and the number of credits purchased

//         }
//         else {
//             return res.status(400).json({ success: false, message: 'Payment not successful' }); // If payment is not successful, respond with an error
//         }
//     }
//     catch (error) {
//         console.error('Error verifying Razorpay payment:', error.message); // Log the error for debugging
//         res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
//     }
// }



const verifyRazorpay = async (req, res) => {
  try {
    // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // // 1. Verify payment with Razorpay
    // const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    
    // if (payment.status !== 'captured') {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Payment not captured' 
    //   });
    // }

    // // 2. Verify the signature
    // const generatedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');

    // if (generatedSignature !== razorpay_signature) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Invalid signature' 
    //   });
    // }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // 1. Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 2. Verify payment status
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (payment.status !== 'captured') {
      return res.status(400).json({ success: false, message: 'Payment not captured' });
    }

    // 3. Find and update transaction
    const transaction = await transactionModel.findOneAndUpdate(
      { _id: payment.notes.transactionId },
      { 
        payment: true,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    // 4. Update user credits
    await userModel.findByIdAndUpdate(
      transaction.userId,
      { $inc: { creditBalance: transaction.credits } }
    );

    res.json({ 
      success: true,
      credits: transaction.credits,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Payment verification failed' 
    });
  }
}


export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay }; // Export the functions for use in routes
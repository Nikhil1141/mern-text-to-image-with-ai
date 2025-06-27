import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        // ref: 'user',
    },
    plan: {
        type: String,
        required: true,
        // ref: 'user',
    },
    amount: {
        type: Number,
        required: true,
        // ref: 'user',
    },
    credits: {
        type: Number,
        required: true,
        // ref: 'user',
    },
    payment: {
        type: Boolean,
        default: false,
        // ref: 'user',
    },
    razorpayPaymentId: String,  // Added for payment verification
    razorpayOrderId: String,    // Added for payment verification
    date: {
        type: Date,            // Changed from Number to Date
        default: Date.now      // Added default value
    }
    
})

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);
export default transactionModel;
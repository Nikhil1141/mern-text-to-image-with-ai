// models/imageHistoryModel.js
import mongoose from "mongoose";

const imageHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const imageHistoryModel = mongoose.models.imageHistory || mongoose.model("imageHistory", imageHistorySchema);
export default imageHistoryModel;

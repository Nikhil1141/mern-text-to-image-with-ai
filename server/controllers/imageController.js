import userModel from "../models/userModal.js";
import FormData from "form-data";
import axios from "axios";
import imageHistoryModel from "../models/imageHistoryModel.js";


const generateImage = async (req, res) => {


    try {
        // const { userId, prompt } = req.body;
        // const user = await userModel.findById(userId);

        const { prompt } = req.body; // Extract prompt from request body
        const user = await userModel.findById(req.userId); // Get the user from the request object, assuming user is authenticated and user ID is stored in req.user._id

        if (!user || !prompt) {
            return res.status(400).json({ success: false, message: "User not found or prompt is missing" });
        }

        // if (user.creditBalance === 0 || userModel.creditBalance < 0) {
        //     return res.status(400).json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance, creditsExhausted: true });
        // }

        if (user.creditBalance <= 0) {
            return res.status(400).json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance, creditsExhausted: true });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            ...formData.getHeaders(),
            responseType: 'arraybuffer', // Set response type to arraybuffer to handle binary data // The 'arraybuffer' response type is used to handle binary data in HTTP responses, allowing you to work with raw binary data like images or files.
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64'); // Convert binary data to base64 // Base64 is a method of encoding binary data into a text string using 64 characters (A-Z, a-z, 0-9, +, /). It is commonly used to encode images and other binary files for transmission over text-based protocols like HTTP. The encoded string can be easily embedded in HTML or JSON as a data URI.
        const resultImage = `data:image/png;base64,${base64Image}`; // Create a data URI for the image // A data URI is a way to include small files directly in web pages as inline data, rather than linking to an external file. It allows you to embed images, scripts, or other resources directly within the HTML or CSS code.

        await imageHistoryModel.create({
            userId: user._id,
            prompt,
            imageUrl: resultImage
        });

        // await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1}, {new: true});
        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.status(200).json({ success: true, message: "Image generated successfully", creditBalance: user.creditBalance - 1, resultImage });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
}


const getImageHistory = async (req, res) => {
  try {
    console.log("📥 /api/image/image-history HIT");
    const userId = req.userId;
    const history = await imageHistoryModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deleted = await imageHistoryModel.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { generateImage, getImageHistory, deleteImage };

import express from 'express';
import { generateImage, getImageHistory, deleteImage } from '../controllers/imageController.js';
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.get('/image-history', userAuth, getImageHistory);
imageRouter.delete("/delete/:id", userAuth, deleteImage);

imageRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Image router is working 🚀", routes: imageRouter.stack.map(r => r.route && { methods: Object.keys(r.route.methods), path: r.route.path }) });
});

export default imageRouter;
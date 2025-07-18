import express from 'express';
import { generateImage, getImageHistory } from '../controllers/imageController.js';
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.get('/image-history', userAuth, getImageHistory);

export default imageRouter;
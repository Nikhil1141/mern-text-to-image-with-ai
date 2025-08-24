import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000; // Default port if not specified in environment variables
const app = express(); // Create an Express application

app.use(cors(
  {
    origin: ['http://localhost:5173', "https://aitexttoimg.vercel.app"], // Your frontend URL
    credentials: true
  }
)); // Enable CORS for all routes // Middleware to handle CORS // Cross-Origin Resource Sharing allows your server to accept requests from different origins
app.use(express.json()); // Parse JSON bodies // Middleware to parse JSON request bodies // This allows the server to understand JSON payloads in requests

await connectDB(); // Connect to MongoDB database // Call the function to connect to the database

app.use('/api/user', userRouter) // Use user routes for handling user-related requests  // /api/user is the base path for user-related routes
app.use('/api/image', imageRouter); // Use image routes for handling image generation requests

// app._router.stack.forEach((middleware) => {
//   if (middleware.route) { // routes registered directly on the app
//     console.log(middleware.route);
//   } else if (middleware.name === 'router') { // router middleware 
//     middleware.handle.stack.forEach((handler) => {
//       const route = handler.route;
//       route && console.log(Object.keys(route.methods), route.path);
//     });
//   }
// });


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); // Export the app for testing or further configuration
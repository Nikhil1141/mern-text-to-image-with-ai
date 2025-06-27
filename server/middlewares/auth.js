import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
    // const token = req.headers; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again token not found' }); // If no token is provided, respond with an error
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key from environment variables

        if(tokenDecode.id){
            req.userId = tokenDecode.id; // Attach the decoded user information to the request object
            next(); // Call the next middleware or route handler
        }
        else {
            return res.status(401).json({ success: false, message: "Not authorized. Login Again" }); // If token is invalid, respond with an error
        }
    }
    catch(error){
        // console.error("Error in userAuth middleware:", error); // Log the error for debugging
        return res.status(500).json({ success: false, message: error.message }); // Respond with a server error status
    }
    console.log("Authorization Header:", req.headers.authorization);

}

export default userAuth;
// This middleware checks if the user is authenticated by verifying the JWT token in the request headers.
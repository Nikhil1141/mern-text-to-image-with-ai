import { createContext, memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    // const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', {
                // headers: {token}
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
            else {
                toast.error(data.message || "Failed to load credits data.");
            }
        }
        catch (error) {
            console.error("Error loading credits data:", error);
            // toast.error("Failed to load credits data. Please try again later.");
        }
    } // Load credits data when the component mounts or token changes

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/image/generate-image', {
                prompt
            },
                // {headers: token}
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if(data.success){
                toast.success("Image generated successfully!");
                await loadCreditsData(); // Reload credits after image generation
                return data.resultImage; // Return the generated image URL
                // return {
                //     image: data.resultImage,
                //     creditsExhausted: false
                // };
            }
            else{
                toast.error(data.message);
                await loadCreditsData(); // Reload credits if generation fails
                // if(data.creditBalance === 0){
                //     navigate('/buy'); // Redirect to buy page if credits are exhausted
                // }
                return {
                    image: null,
                    creditsExhausted: data.creditsExhausted || false
                };
            }
        }
        catch (error) {
            console.error("Error generating image:", error);
            if(error.response?.data.creditsExhausted){
                navigate('/buy'); // Redirect to buy page if credits are exhausted
                toast.error("Failed to generate image");
                return null; // Return null if generation fails
            }
            return null; // Return null if generation fails
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }

    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
        // else {
        //     setCredit(false);
        //     setUser(null);
        // }
    }, [token]);

    const value = {
        user,
        setUser,
        // showLogin,
        // setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default memo(AppContextProvider);
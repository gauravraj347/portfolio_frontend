


// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import myImage from '../assets/limg.png';
// import { AuthContext } from "../AuthProvider";

// const Login = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (loggedIn && user) {
//             navigate(`/Stocks`);
//         }
//     }, [loggedIn, user, navigate]);

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         if (!username || !password) {
//             setError("Both fields are required.");
//             return;
//         }

//         setError("");
//         setIsLoading(true); // Start loading

//         try {
//             const response = await fetch("https://backend-jh2r.onrender.com/api/users");
//             if (response.ok) {
//                 const users = await response.json();
//                 const foundUser = users.find(
//                     (u) => u.username === username && u.password === password
//                 );
//                 if (foundUser) {
//                     setLoggedIn(true);
//                     setUser(foundUser);
//                     navigate(`/Stocks`);
//                 } else {
//                     setError("Invalid credentials.");
//                 }
//             } else {
//                 setError("Failed to fetch user data.");
//             }
//         } catch (error) {
//             console.error("Error during login:", error);
//             setError("Something went wrong. Please try again.");
//         } finally {
//             setIsLoading(false); // Stop loading
//         }
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         if (!username || !password) {
//             setError("Both fields are required.");
//             return;
//         }

//         setError("");
//         setIsLoading(true); // Start loading

//         try {
//             const response = await fetch("https://backend-jh2r.onrender.com/api/users", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ username, password }),
//             });

//             if (response.ok) {
//                 const newUser = await response.json();
//                 setLoggedIn(true);
//                 setUser(newUser.user);
//                 navigate(`/Stocks`);
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.message || "Registration failed.");
//             }
//         } catch (error) {
//             console.error("Error during registration:", error);
//             setError("Something went wrong. Please try again.");
//         } finally {
//             setIsLoading(false); // Stop loading
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black relative overflow-hidden">
//             {/* Bubble Animation */}
//             <div className="absolute inset-0">
//                 {[...Array(30)].map((_, i) => (
//                     <div
//                         key={i}
//                         className={`absolute bg-white rounded-full opacity-20 animate-bubble`}
//                         style={{
//                             width: `${Math.random() * 90 + 30}px`,
//                             height: `${Math.random() * 90 + 30}px`,
//                             top: `${Math.random() * 100}%`,
//                             left: `${Math.random() * 100}%`,
//                             animationDuration: `${Math.random() * 7 + 5}s`,
//                             animationDelay: `${Math.random() * 4}s`,
//                         }}
//                     ></div>
//                 ))}
//             </div>

//             {/* Main Content */}
//             <div className="w-full max-w-5xl bg-black/70 backdrop-blur-md rounded-3xl shadow-2xl p-12 flex items-center justify-between relative z-10">
//                 {/* Left Side - Form */}
//                 <div className="w-full max-w-md">
//                     <h4 className="text-5xl font-extrabold text-center mb-10 text-purple-300 tracking-wide drop-shadow-lg">
//                         Portfolio Tracker
//                     </h4>
//                     {error && (
//                         <div className="text-red-500 mb-4 text-center text-lg font-medium">
//                             {error}
//                         </div>
//                     )}
//                     {isLoading && (
//                         <div className="text-yellow-500 mb-4 text-center text-lg font-medium">
//                             Please wait...
//                         </div>
//                     )}
//                     <form>
//                         <div className="mb-10">
//                             <label
//                                 htmlFor="username"
//                                 className="block text-purple-200 font-semibold mb-2 text-lg"
//                             >
//                                 Username
//                             </label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 className="w-full border-2 border-purple-500 rounded-full px-6 py-4 text-lg bg-black text-white focus:outline-none focus:ring-4 focus:ring-purple-600 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ease-in-out"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 placeholder="Enter your username"
//                                 autoComplete="off"
//                             />
//                         </div>
//                         <div className="mb-10">
//                             <label
//                                 htmlFor="password"
//                                 className="block text-purple-200 font-semibold mb-2 text-lg"
//                             >
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 className="w-full border-2 border-purple-500 rounded-full px-6 py-4 text-lg bg-black text-white focus:outline-none focus:ring-4 focus:ring-purple-600 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ease-in-out"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 placeholder="Enter your password"
//                             />
//                         </div>
//                         <div className="flex gap-6">
//                             <button
//                                 type="submit"
//                                 className="bg-purple-500 text-black py-4 rounded-full w-full text-lg font-semibold hover:bg-purple-600 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-xl hover:shadow-2xl"
//                                 onClick={handleLogin}
//                                 disabled={isLoading}
//                             >
//                                 Login
//                             </button>
//                             <button
//                                 type="button"
//                                 className="bg-black text-purple-500 py-4 rounded-full w-full text-lg font-semibold hover:bg-purple-600 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-110 shadow-xl hover:shadow-2xl"
//                                 onClick={handleRegister}
//                                 disabled={isLoading}
//                             >
//                                 Register
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Right Side - Image */}
//                 <div className="hidden md:block w-1/2 ml-12 bg-gradient-to-tr from-purple-500 to-black p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300">
//                     <img
//                         src={myImage}
//                         alt="Portfolio"
//                         className="w-full h-full object-cover rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;




import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import myImage from '../assets/limg.png';
import { AuthContext } from "../AuthProvider";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Please wait...");
    const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadingMessages = [
        "Please wait...",
        "Thoda sabar karo, portfolio aa raha hai... ☕",
        "Ruko zara, system set kar rahe hain... ⚙️",
        "Ek kadak chai banao, bas hone wala hai... 🍵",
        "Thoda intezaar karo, thoda aur time lagega... 🕓",
        "Data ka jugaad ho raha hai, bas 2 second... 🔧",
        "Aapka portfolio ek dum filmy style mein aa raha hai... 🎬",
        "Abhi thoda glamour ka touch de rahe hain... 💅",
        "Aapka data ab apni setting mein busy hai... 🛠️",
        "Portfolio thoda fast, thoda fabulous ho raha hai... 💨",
        "Thoda aur ruko, abhi picture baaki hai... 🎥",
        "Data set ho raha hai, thoda patience rakhna... 🛋️",
        "Aapka portfolio thoda stylish ho raha hai... 👗",
        "Data ka final polish ho raha hai, bas thoda wait karo... ✨",
        "Ruko, system ab aapke portfolio ko shaandar bana raha hai... 💎",
        "Please wait",
    ];
    

    useEffect(() => {
        if (loggedIn && user) {
            navigate(`/Stocks`);
        }
    }, [loggedIn, user, navigate]);

    useEffect(() => {
        let interval;
        if (isLoading) {
            let messageIndex = 0;
            interval = setInterval(() => {
                setLoadingMessage(loadingMessages[messageIndex]);
                messageIndex = (messageIndex + 1) % loadingMessages.length;
            }, 15000); // Update message every 15 seconds
        }

        return () => {
            clearInterval(interval); // Clear interval when loading stops
        };
    }, [isLoading]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");
        setIsLoading(true); // Start loading

        try {
            const response = await fetch("http://localhost:8080/api/users");
            if (response.ok) {
                const users = await response.json();
                const foundUser = users.find(
                    (u) => u.username === username && u.password === password
                );
                if (foundUser) {
                    setLoggedIn(true);
                    setUser(foundUser);
                    navigate(`/Stocks`);
                } else {
                    setError("Invalid credentials.");
                }
            } else {
                setError("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");
        setIsLoading(true); // Start loading

        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const newUser = await response.json();
                setLoggedIn(true);
                setUser(newUser.user);
                navigate(`/Stocks`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black relative overflow-hidden">
            <div className="absolute top-12 text-l font-bold text-white">
               Register yourself and also use "golu" as an username and password for login.
            </div>
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute bg-white rounded-full opacity-20 animate-bubble`}
                        style={{
                            width: `${Math.random() * 90 + 30}px`,
                            height: `${Math.random() * 90 + 30}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 7 + 5}s`,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Main Content */}
            <div className="w-full max-w-5xl bg-black/70 backdrop-blur-md rounded-3xl shadow-2xl p-12 flex items-center justify-between relative z-10">
                {/* Left Side - Form */}
                <div className="w-full max-w-md">
                    <h4 className="text-5xl font-extrabold text-center mb-10 text-purple-300 tracking-wide drop-shadow-lg">
                        Portfolio Tracker
                    </h4>
                    {error && (
                        <div className="text-red-500 mb-4 text-center text-lg font-medium">
                            {error}
                        </div>
                    )}
                    {isLoading && (
                        <div className="text-yellow-500 mb-4 text-center text-lg font-medium">
                            {loadingMessage}
                        </div>
                    )}
                    <form>
                        <div className="mb-10">
                            <label
                                htmlFor="username"
                                className="block text-purple-200 font-semibold mb-2 text-lg"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full border-2 border-purple-500 rounded-full px-6 py-4 text-lg bg-black text-white focus:outline-none focus:ring-4 focus:ring-purple-600 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ease-in-out"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-10">
                            <label
                                htmlFor="password"
                                className="block text-purple-200 font-semibold mb-2 text-lg"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full border-2 border-purple-500 rounded-full px-6 py-4 text-lg bg-black text-white focus:outline-none focus:ring-4 focus:ring-purple-600 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ease-in-out"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="flex gap-6">
                            <button
                                type="submit"
                                className="bg-purple-500 text-black py-4 rounded-full w-full text-lg font-semibold hover:bg-purple-600 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-xl hover:shadow-2xl"
                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="bg-black text-purple-500 py-4 rounded-full w-full text-lg font-semibold hover:bg-purple-600 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-110 shadow-xl hover:shadow-2xl"
                                onClick={handleRegister}
                                disabled={isLoading}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side - Image */}
                <div className="hidden md:block w-1/2 ml-12 bg-gradient-to-tr from-purple-500 to-black p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <img
                        src={myImage}
                        alt="Portfolio"
                        className="w-full h-full object-cover rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    />
                </div>
            </div>

            {/* Footer - Watermark */}
            <div className="absolute bottom-4 right-4 text-white text-lg font-semibold opacity-50">
                by Gaurav Raj
            </div>
        </div>
    );
};

export default Login;


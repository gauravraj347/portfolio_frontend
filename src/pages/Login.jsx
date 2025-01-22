
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn && user) {
            navigate(`/Stocks`);
        }
    }, [loggedIn, user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");

        try {
            const response = await fetch("https://backend-jh2r.onrender.com/api/users");
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
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Login and Registration both here.");
            return;
        }

        setError("");

        try {
            const response = await fetch("https://backend-jh2r.onrender.com/api/users", {
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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105">
                <h4 className="text-2xl font-bold mb-6 text-center text-blue-500">Portfolio Tracker</h4>
                {error && (
                    <div className="text-red-500 mb-4 text-center text-lg font-semibold">{error}</div>
                )}
                <form>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-blue-500 font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border-2 border-blue-500 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-blue-500 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border-2 border-blue-500 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-3 rounded-lg w-full text-lg hover:bg-blue-900 transition-all duration-200 ease-in-out transform hover:scale-105"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className="bg-green-500 text-white py-3 rounded-lg w-full text-lg hover:bg-green-900 transition-all duration-200 ease-in-out transform hover:scale-105"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

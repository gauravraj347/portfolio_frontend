
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import PortfolioDistribution from "../components/PortfolioDistribution";
import PortfolioMetrics from "../components/PortfolioMetrics";

const Stocks = () => {
    const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
    const [stocks, setStocks] = useState([]);
    const [newStock, setNewStock] = useState({
        name: "",
        symbol: "",
        price: "",
        quantity: "",
    });
    const [editingStockId, setEditingStockId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/");
        }
    }, [loggedIn, navigate]);

    const handleLogout = () => {
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleInputChange = (e, field) => {
        setNewStock({ ...newStock, [field]: e.target.value });
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 2) {
            const response = await fetch(
                `https://api.twelvedata.com/symbol_search?symbol=${query}`
            );
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data || []);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSymbolSelect = (symbol, name) => {
        setNewStock({ ...newStock, symbol, name });
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleAddStock = async () => {
        const { name, symbol, price, quantity } = newStock;
    
        if (!name || !symbol || !price) {
            alert("All fields are required.");
            return;
        }
    
        // Set default quantity to 1 if not provided
        const stockQuantity = quantity ? parseInt(quantity) : 1;
    
        const response = await fetch("https://backend-jh2r.onrender.com/api/stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                symbol,
                price: parseFloat(price),
                quantity: stockQuantity,
                user: { id: user.id },
            }),
        });
    
        if (response.ok) {
            const stock = await response.json();
            setStocks([...stocks, stock]);
            setNewStock({ name: "", symbol: "", price: "", quantity: "" });
        }
    };
    
    const handleDeleteStock = async (stockId) => {
        const response = await fetch(
            `https://backend-jh2r.onrender.com/api/stocks/${stockId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            setStocks(stocks.filter((stock) => stock.id !== stockId));
        }
    };

    const handleEditStock = (stock) => {
        setEditingStockId(stock.id);
        setNewStock({
            name: stock.name,
            symbol: stock.symbol,
            price: stock.price,
            quantity: stock.quantity,
        });
    };

    const handleUpdateStock = async () => {
        const { name, symbol, price, quantity } = newStock;

        if (!name || !symbol || !price || !quantity) {
            alert("All fields are required.");
            return;
        }

        const response = await fetch(
            `https://backend-jh2r.onrender.com/api/stocks/${editingStockId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    symbol,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    user: { id: user.id },
                }),
            }
        );

        if (response.ok) {
            const updatedStock = await response.json();
            setStocks(
                stocks.map((stock) =>
                    stock.id === editingStockId ? updatedStock : stock
                )
            );
            setEditingStockId(null);
            setNewStock({ name: "", symbol: "", price: "", quantity: "" });
        }
    };
    
    const handleCancelEdit = () => {
        setEditingStockId(null);
        setNewStock({ name: "", symbol: "", price: "", quantity: "" });
    };

    const handleDisplayStocks = async () => {
        const response = await fetch(`https://backend-jh2r.onrender.com/api/stocks/user/${user.id}`);
        if (response.ok) {
            const fetchedStocks = await response.json();

            for (let stock of fetchedStocks) {
                const priceResponse = await fetch(
                    `https://api.twelvedata.com/price?symbol=${stock.symbol}&interval=1day&apikey=${import.meta.env.VITE_API_KEY}`
                );
                if (priceResponse.ok) {
                    const priceData = await priceResponse.json();
                    stock.currentPrice = priceData.price || 0;
                }
            }

            setStocks(fetchedStocks);
        }
    };

    useEffect(() => {
        handleDisplayStocks();
    }, []);

    const totalPortfolioValue = stocks.reduce(
        (acc, stock) => acc + stock.currentPrice * stock.quantity,
        0
    );

    const topPerformer = stocks.reduce(
        (top, stock) => {
            const buyTotalValue = stock.price * stock.quantity;
            const currentTotalValue = stock.currentPrice * stock.quantity;
            const profitLossPercentage =
                ((currentTotalValue - buyTotalValue) / buyTotalValue) * 100;

            if (profitLossPercentage > top.percentage) {
                return { stock, percentage: profitLossPercentage };
            }
            return top;
        },
        { stock: null, percentage: -Infinity }
    );

    return (
        <div className="p-4 bg-blue-100">
            <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-lg mb-4">
            <h1 className="text-3xl text-blue-900  font-bold">Portfolio Tracker</h1>
                <div className="relative inline-block">
                    <div className="absolute -top-3 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-red-600 transform -rotate-2">
                        Note
                    </div>
                    <h1 className="text-x bg-yellow-200 px-4 py-2 rounded-lg shadow-lg border-l-4 border-yellow-500">
                        If Current Price and Portfolio Distribution is not shown, just refresh it!
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-lg text-blue-900 text-2xl font-bold">Welcome {user.username}!</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 py-2 px-4">
                        Logout
                    </button>
                </div>
            </div>
            <PortfolioMetrics stocks={stocks} totalPortfolioValue={totalPortfolioValue} topPerformer={topPerformer} />
            
            <div className="bg-white rounded-lg shadow-lg p-1 mb-4">
                <h2 className="text-xl font-bold ml-4 mb-4">Add New Stock</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        value={newStock.name}
                                        onChange={(e) => handleInputChange(e, "name")}
                                        placeholder="Name"
                                        className="w-full border rounded p-1"
                                        disabled
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        value={newStock.symbol}
                                        onChange={(e) => {
                                            handleInputChange(e, "symbol");
                                            handleSearchChange(e);
                                        }}
                                        placeholder="Ticker"
                                        className="w-full border rounded p-1"
                                    />
                                    <div className="absolute w-[18%] h-60 overflow-y-auto">
                                        {searchResults.length > 0 && (
                                            <ul className="border rounded shadow-lg bg-white mt-2">
                                                {searchResults.map((result, index) => (
                                                    <li
                                                        key={index}
                                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                                        onClick={() => {
                                                            handleSymbolSelect(result.symbol, result.instrument_name);
                                                        }}
                                                    >
                                                        {result.instrument_name} ({result.symbol})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        value={newStock.price}
                                        onChange={(e) => handleInputChange(e, "price")}
                                        placeholder="Price"
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        value={newStock.quantity}
                                        onChange={(e) => handleInputChange(e, "quantity")}
                                        placeholder="Quantity"
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {editingStockId ? (
                                        <div className="space-x-2">
                                            <button
                                                onClick={handleUpdateStock}
                                                className="bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 py-1 px-2"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 py-1 px-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddStock}
                                            className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 py-1 px-2"
                                        >
                                            Add Stock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">Manage Stocks</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 p-2 w-[300]">Name</th>
                                <th className="border border-gray-300 p-2">Symbol</th>
                                <th className="border border-gray-300 p-2 w-[200px]" >Price</th>
                                <th className="border border-gray-300 p-2">Quantity</th>
                                <th className="border border-gray-300 p-2">Current Price</th>
                                <th className="border border-gray-300 p-2">Buy Total Value</th>
                                <th className="border border-gray-300 p-2">Current Total Value</th>
                                <th className="border border-gray-300 p-2">Profit/Loss</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => {
                                const buyTotalValue = stock.price * stock.quantity;
                                const currentTotalValue = stock.currentPrice * stock.quantity;
                                const profitLoss = currentTotalValue - buyTotalValue;
    
                                return (
                                    <tr key={stock.id} className="even:bg-gray-200 odd:bg-white">
                                        
                                        <td className="border border-gray-300 p-2">{stock.name}</td>
                                        <td className="border border-gray-300 p-2">{stock.symbol}</td>
                                        <td className="border border-gray-300 p-2">${stock.price}</td>
                                        <td className="border border-gray-300 p-2">{stock.quantity}</td>
                                        <td className="border border-gray-300 p-2">${stock.currentPrice}</td>
                                        <td className="border border-gray-300 p-2">${buyTotalValue.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2">${currentTotalValue.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2">
                                            {profitLoss >= 0 ? (
                                                <span className="text-green-500">+${profitLoss.toFixed(2)}</span>
                                            ) : (
                                                <span className="text-red-500">${profitLoss.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2 flex space-x-2">
                                            <button
                                                onClick={() => handleEditStock(stock)}
                                                className="bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 py-1 px-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStock(stock.id)}
                                                className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 py-1 px-2"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {stocks.length > 0 ? (
                <PortfolioDistribution stocks={stocks} />
            ) : (
                <p>No stocks available</p>
            )}
        </div>
    );
};

export default Stocks;


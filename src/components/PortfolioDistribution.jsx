

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const PortfolioDistribution = ({ stocks }) => {
    const [portfolioDistribution, setPortfolioDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const stockData = await Promise.all(
                    stocks.map(async (stock) => {
                        const response = await fetch(
                            `https://api.twelvedata.com/price?symbol=${stock.symbol}&interval=1day&apikey=${import.meta.env.VITE_API_KEY}`
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            const currentPrice = data.price || "N/A";
                            return {
                                ...stock,
                                currentPrice,
                            };
                        }
                        return {
                            ...stock,
                            currentPrice: "N/A",
                        };
                    })
                );
                calculatePortfolioDistribution(stockData);
            } catch (error) {
                setError("Failed to fetch stock data");
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [stocks]);

    const calculatePortfolioDistribution = (stockData) => {
        const distribution = [];
        stockData.forEach((stock) => {
            const stockValue = stock.currentPrice !== "N/A" ? stock.currentPrice * stock.quantity : 0;
            distribution.push({
                name: stock.name,
                value: stockValue,
            });
        });

        setPortfolioDistribution(distribution);
    };

    const pieChartData = [
        ['Stock', 'Value'],
        ...portfolioDistribution.map((stock) => [stock.name, stock.value]),
    ];

    const barChartData = [
        ['Stock', 'Value'],
        ...portfolioDistribution.map((stock) => [stock.name, stock.value]),
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (portfolioDistribution.length === 0 || portfolioDistribution.every(stock => stock.value === 0)) {
        return null;
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <div className="flex justify-between">
                    <div className="w-1/2 pr-4">
                        <div className="text-xl font-bold mb-4">
                            Portfolio Distribution
                        </div>
                        <Chart
                            chartType="PieChart"
                            data={pieChartData}
                            options={{
                                title: '',
                                pieHole: 0.5,
                                is3D: false,
                                pieSliceText: 'percentage',
                                pieSliceBorderColor: 'transparent',
                                slices: {},
                            }}
                            width="90%"
                            height="300px"
                        />
                    </div>

                    <div className="w-1/2 pl-4">
                        <Chart
                            chartType="Bar"
                            data={barChartData}
                            options={{
                                title: '',
                                chartArea: { width: '50%' },
                                hAxis: {
                                    title: 'Stock Value ($)',
                                    minValue: 0,
                                },
                                vAxis: {
                                    title: 'Stock',
                                },
                            }}
                            width="100%"
                            height="300px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDistribution;

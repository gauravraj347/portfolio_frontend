import React from 'react';

const PortfolioMetrics = ({ stocks }) => {
    const totalPortfolioValue = stocks.reduce(
        (acc, stock) => acc + stock.currentPrice * stock.quantity,
        0
    );

    const totalInvestment = stocks.reduce(
        (acc, stock) => acc + stock.price * stock.quantity,
        0
    );

    const totalReturn = totalPortfolioValue - totalInvestment;
    const totalReturnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

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
        <div className="bg-white rounded-lg shadow-lg p-3 mb-4">
            <h2 className="text-xl font-bold mb-4 ml-2">Portfolio Metrics</h2>
            <div className="flex space-x-3">
                <div
                    className={`p-4 rounded-lg flex-1 ${totalPortfolioValue < totalInvestment ? 'bg-red-300' : 'bg-green-300'}`}
                >
                    <h3 className="text-lg font-semibold">Total Portfolio Value</h3>
                    <p className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold">Total Investment</h3>
                    <p className="text-2xl font-bold">${totalInvestment.toFixed(2)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold">Total Return</h3>
                    <p
                        className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                        ${totalReturn.toFixed(2)}
                    </p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold">Total Return (%)</h3>
                    <p
                        className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {totalReturnPercentage.toFixed(2)}%
                    </p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold">Stocks Count</h3>
                    <p className="text-2xl font-bold">{stocks.length}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold">Top Performer</h3>
                    {topPerformer.stock ? (
                        <div>
                            <p className="text-xl font-bold">{topPerformer.stock.name}</p>
                            <p
                                className={`text-lg font-bold ${
                                    topPerformer.percentage > 0 ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {topPerformer.percentage >= 0
                                    ? `+${topPerformer.percentage.toFixed(2)}%`
                                    : `${topPerformer.percentage.toFixed(2)}%`}
                            </p>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-500">N/A</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioMetrics;

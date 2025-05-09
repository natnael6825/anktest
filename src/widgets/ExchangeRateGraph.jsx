import React, { useState, useEffect, useRef } from "react";
import { fetchAllExchangeRate } from "../services/adminService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

function ExchangeRateGraph() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("thisWeek");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data when selectedTimeRange changes
  useEffect(() => {
    setLoading(true);
    fetchAllExchangeRate(selectedTimeRange)
      .then((response) => {
        const records = Array.isArray(response)
          ? response
          : (response?.data || []);
        const data = records
          .filter((record) => record.body && record.body.Average)
          .map((record) => ({
            date: record.createdAt.substring(0, 10),
            avgBuy: record.body.Average.buyPrice,
            avgSell: record.body.Average.sellPrice,
          }))
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setChartData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching exchange rate data: ", err);
        setError("Error fetching exchange rate data.");
        setLoading(false);
        toast.error("Failed to fetch exchange rate data");
      });
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setShowDropdown(false);
  };

  // Helper function to get the proper label for the dropdown
  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case "thisWeek":
        return "This Week";
      case "1weekAgo":
        return "1 Week Ago";
      case "2weeksAgo":
        return "2 Weeks Ago";
      case "1monthAgo":
        return "1 Month Ago";
      default:
        return "This Week";
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading chart...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-300 mt-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
        <h5 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-white mb-3 md:mb-0">
          Exchange Rates Trends
        </h5>
        {/* Dropdown Button & Content */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            {getTimeRangeLabel()}
            <svg
              className="w-2.5 h-2.5 ml-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    onClick={() => handleTimeRangeChange("thisWeek")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    This Week
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTimeRangeChange("1weekAgo")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    1 Week Ago
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTimeRangeChange("2weeksAgo")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    2 Weeks Ago
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTimeRangeChange("1monthAgo")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    1 Month Ago
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-52 sm:h-64 md:h-80 lg:h-96 flex justify-center items-center">
        {chartData.length === 0 ? (
          <div className="text-gray-600 text-lg">
            No data available for the selected date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="avgBuyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="avgSellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickMargin={8}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={8}
                axisLine={{ stroke: '#e5e7eb' }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconSize={12}
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="avgBuy"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#avgBuyGradient)"
                name="Avg Buy Rate"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="avgSell"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#avgSellGradient)"
                name="Avg Sell Rate"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ExchangeRateGraph;

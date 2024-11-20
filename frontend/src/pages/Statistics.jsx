import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchExpenses } from '../services/firebaseService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // week, month, year
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const categories = [
    { value: 'all', label: '🌟 All Categories' },
    { value: 'food', label: '🍔 Food' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'entertainment', label: '🎮 Entertainment' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'utilities', label: '💡 Utilities' },
    { value: 'other', label: '📦 Other' },
  ];

  useEffect(() => {
    loadExpenses();
  }, [selectedCategory, dateRange]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const filters = {
        category: selectedCategory === 'all' ? null : selectedCategory,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      };
      console.log("Filters applied:", filters);
      const data = await fetchExpenses(filters);
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = () => {
    // Group expenses by date
    const groupedExpenses = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + Number(expense.amount);
      return acc;
    }, {});

    return {
      labels: Object.keys(groupedExpenses),
      datasets: [
        {
          label: 'Daily Expenses',
          data: Object.values(groupedExpenses),
          borderColor: 'rgb(220, 38, 38)',
          backgroundColor: 'rgba(220, 38, 38, 0.5)',
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <motion.div 
      className="min-h-screen bg-white py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-sky-600 mb-8 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          📈 Expense Statistics
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="mb-6 space-y-4">
              <div className="flex justify-center space-x-4">
                {['week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 
                      ${timeframe === period 
                        ? 'bg-sky-700 text-white' 
                        : 'bg-gray-100 hover:bg-sky-700'}`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholderText="📆 Select date range"
                  isClearable={true}
                />
              </div>
            </div>
            
            <div className="h-[400px]">
              <Line 
                data={prepareChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Expense Trend'
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Statistics; 
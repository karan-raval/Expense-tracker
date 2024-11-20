import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ExpenseForm = ({ onExpenseAdded, isEditing, expenseToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || '',
        date: expenseToEdit.date || new Date().toISOString().split('T')[0],
        description: expenseToEdit.description || ''
      });
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0
    };

    onExpenseAdded(submissionData);
    
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, amount: value });
    }
  };

  const categories = [
    '🏠 Housing',
    '🍔 Food',
    '🚗 Transportation',
    '🏥 Healthcare',
    '🎮 Entertainment',
    '🛒 Shopping',
    '📚 Education',
    '💼 Business',
    '🎁 Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-sky-600 mb-6">
        {isEditing ? '✏️ Edit Expense' : '➕ Add Expense'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </motion.select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            rows="3"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-sky-700 transition-colors duration-200 shadow-md"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </motion.button>

        {isEditing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onExpenseAdded(null)}
            className="w-full mt-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel Edit
          </motion.button>
        )}
      </form>
    </motion.div>
  );
};

export default ExpenseForm;
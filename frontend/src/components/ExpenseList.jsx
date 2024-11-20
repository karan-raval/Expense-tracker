import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  const formatAmount = (amount) => {
    const number = parseFloat(amount);
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  const expenseArray = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-sky-600 mb-6">💰 Recent Expenses</h2>
      
      <div className="space-y-4">
        <AnimatePresence>
          {expenseArray.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-8"
            >
              No expenses recorded yet. Start adding some!
            </motion.div>
          ) : (
            expenseArray.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{expense.title}</h3>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                    {expense.description && (
                      <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-sky-600">
                      ${formatAmount(expense.amount)}
                    </span>
                    <div className="flex space-x-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(expense)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(expense.id)}
                        className="text-sky-600 hover:text-sky-700"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpenseList;
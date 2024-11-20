import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "./services/firebaseService";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return sum + amount;
    }, 0);
    setTotalSpent(total);
  }, [expenses]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      if (!expenseData) {
        setEditingExpense(null);
        return;
      }

      const sanitizedData = {
        ...expenseData,
        amount: parseFloat(expenseData.amount) || 0
      };

      if (editingExpense) {
        const updated = await updateExpense(editingExpense.id, sanitizedData);
        setExpenses(expenses.map((exp) => 
          exp.id === editingExpense.id ? updated : exp
        ));
        setEditingExpense(null);
      } else {
        const newExpense = await addExpense(sanitizedData);
        setExpenses([...expenses, newExpense]);
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-sky-600 mb-2">
            📊 Budget Master
          </h1>
          <p className="text-gray-600">Master Your Financial Journey!</p>
          <motion.div 
            className="mt-4 bg-sky-600 rounded-xl p-4 shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-white">Total Spent</p>
            <motion.p 
              className="text-3xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${totalSpent.toFixed(2)}
            </motion.p>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExpenseForm
                onExpenseAdded={handleAddExpense}
                isEditing={!!editingExpense}
                expenseToEdit={editingExpense}
              />
              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={setEditingExpense}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "./services/firebaseService";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  const calculateTotal = (expenses) => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  };

  useEffect(() => {
    console.log('Expenses data:', expenses);
    const total = Array.isArray(expenses) ? calculateTotal(expenses) : 0;
    setTotalSpent(total);
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        const updated = await updateExpense(editingExpense.id, expenseData);
        setExpenses(expenses.map((exp) => 
          exp.id === editingExpense.id ? updated : exp
        ));
        setEditingExpense(null);
      } else {
        const newExpense = await addExpense(expenseData);
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
    <div className="min-h-screen bg-sky-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 Expense Tracker
          </h1>
          <p className="text-gray-200">Keep track of your spending!</p>
          <div className="mt-4 bg-white rounded-xl p-4 shadow-md">
            <p className="text-gray-600">Total Spent</p>
            <p className="text-3xl font-bold text-sky-700">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
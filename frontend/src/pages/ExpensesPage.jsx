// import React, { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "../services/firebaseService";
import ExpenseForm from "../components/ExpenseForm";
import { useEffect, useState } from "react";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const expensesData = await fetchExpenses();
      setExpenses(expensesData);
    };
    fetchData();
  }, []);

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  return (
    <div>
      <ExpenseForm onExpenseAdded={(newExpense) => setExpenses([...expenses, newExpense])} />
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.category} - ${expense.amount} on {expense.date}
            <button onClick={() => handleDeleteExpense(expense.id)} className="bg-sky-600 hover:bg-sky-700">Delete ❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;

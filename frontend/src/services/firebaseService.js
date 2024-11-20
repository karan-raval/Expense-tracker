const API_URL = 'http://localhost:8080/api/expenses';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDTX0Z8TkBcIWaiW0Gago1EgdkrPLvz1P4",
  authDomain: "expenses-tracker-24f9f.firebaseapp.com",
  projectId: "expenses-tracker-24f9f",
  storageBucket: "expenses-tracker-24f9f.firebasestorage.app",
  messagingSenderId: "20667373456",
  appId: "1:20667373456:web:34207bc025e89352c9c515"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchExpenses = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addExpense = async (expenseData) => {
  try {
    // Ensure amount is stored as a number
    const sanitizedData = {
      ...expenseData,
      amount: parseFloat(expenseData.amount) || 0,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "expenses"), sanitizedData);
    return {
      id: docRef.id,
      ...sanitizedData
    };
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw error;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    // Ensure amount is stored as a number
    const sanitizedData = {
      ...expenseData,
      amount: parseFloat(expenseData.amount) || 0,
      updatedAt: new Date().toISOString()
    };

    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, sanitizedData);
    return {
      id,
      ...sanitizedData
    };
  } catch (error) {
    console.error("Error updating expense: ", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};

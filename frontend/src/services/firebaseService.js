require('dotenv').config();

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

// Validate that all required environment variables are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
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

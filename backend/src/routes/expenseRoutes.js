// backend/src/routes/expenseRoutes.js
const express = require("express");
const db = require("../firebase-config");
const router = express.Router();

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expensesSnapshot = await db.collection("expenses").get();
    const expenses = [];
    expensesSnapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create expense
router.post("/", async (req, res) => {
  try {
    const { name, amount, budgetId, createdAt } = req.body;
    const docRef = await db.collection("expenses").add({
      name,
      amount,
      budgetId,
      createdAt
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("expenses").doc(req.params.id).delete();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

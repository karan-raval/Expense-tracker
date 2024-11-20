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
    console.log(expenses);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create expense
router.post("/", async (req, res) => {
  try {
    const { name, amount, date, category } = req.body;
    
    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount are required' });
    }

    const expenseRef = await db.collection("expenses").add({
      name,
      amount: parseFloat(amount),
      date: date || new Date().toISOString(),
      category: category || 'uncategorized',
      createdAt: new Date().toISOString()
    });

    const expenseDoc = await expenseRef.get();
    res.status(201).json({
      id: expenseDoc.id,
      ...expenseDoc.data()
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("expenses").doc(id).delete();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    await db.collection("expenses").doc(id).update(updateData);
    
    const updatedDoc = await db.collection("expenses").doc(id).get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

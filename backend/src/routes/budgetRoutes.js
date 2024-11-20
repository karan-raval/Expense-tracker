const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgetsSnapshot = await db.collection('budgets').get();
    const budgets = [];
    budgetsSnapshot.forEach(doc => {
      budgets.push({ id: doc.id, ...doc.data() });
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create budget
router.post('/', async (req, res) => {
  try {
    const { name, amount, color, createdAt } = req.body;
    const docRef = await db.collection('budgets').add({
      name,
      amount,
      color,
      createdAt
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('budgets').doc(req.params.id).delete();
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ order: 1, createdAt: 1 });
  res.json(tasks);
});

// Create task
router.post('/', async (req, res) => {
  const { title, order } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });
  const task = new Task({ title: title.trim(), order: order ?? 0 });
  await task.save();
  res.status(201).json(task);
});

// Update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const task = await Task.findByIdAndUpdate(id, update, { new: true });
  if (!task) return res.status(404).end();
  res.json(task);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Bulk reorder
router.put('/reorder', async (req, res) => {
  const { orderedIds } = req.body; // array of ids in new order
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
  const bulkOps = orderedIds.map((id, idx) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: idx }
    }
  }));
  await Task.bulkWrite(bulkOps);
  const tasks = await Task.find().sort({ order: 1 });
  res.json(tasks);
});

module.exports = router;

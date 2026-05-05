const express = require('express');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const Earning = require('../models/Earning');
const router = express.Router();

// Get all active tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'active' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete a task
router.post('/:taskId/complete', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if already completed
    const alreadyCompleted = task.completedBy.some(
      item => item.userId.toString() === req.userId
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Task already completed' });
    }
    
    // Add user to completedBy
    task.completedBy.push({
      userId: req.userId,
      completedAt: new Date(),
    });
    await task.save();
    
    // Create earning entry
    const earning = new Earning({
      userId: req.userId,
      taskId: task._id,
      amount: task.reward,
      type: 'task',
      status: 'completed',
    });
    await earning.save();
    
    // Update user balance and stats
    const user = await User.findById(req.userId);
    user.balance += task.reward;
    user.tasksCompleted += 1;
    user.totalEarnings += task.reward;
    await user.save();
    
    res.json({
      message: 'Task completed successfully',
      reward: task.reward,
      newBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

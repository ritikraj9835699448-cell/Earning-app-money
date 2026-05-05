const express = require('express');
const authMiddleware = require('../middleware/auth');
const Earning = require('../models/Earning');
const User = require('../models/User');
const router = express.Router();

// Get user earnings history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const earnings = await Earning.find({ userId: req.userId })
      .populate('taskId', 'title reward')
      .sort({ createdAt: -1 });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get earnings summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const earnings = await Earning.find({ userId: req.userId });
    
    res.json({
      totalEarnings: user.totalEarnings,
      currentBalance: user.balance,
      withdrawals: user.withdrawals,
      tasksCompleted: user.tasksCompleted,
      earnings: earnings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Withdraw earnings
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);
    
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal is 100' });
    }
    
    user.balance -= amount;
    user.withdrawals += amount;
    await user.save();
    
    res.json({
      message: 'Withdrawal successful',
      withdrawnAmount: amount,
      remainingBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

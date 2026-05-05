const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['task', 'referral', 'bonus'],
    default: 'task',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'withdrawn'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Earning', earningSchema);

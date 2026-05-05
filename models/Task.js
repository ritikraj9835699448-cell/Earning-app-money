const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['survey', 'click', 'download', 'review', 'referral', 'watch'],
    default: 'survey',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  completedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);

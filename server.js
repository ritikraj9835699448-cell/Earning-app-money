const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== CORS Configuration - Allow ALL Origins & Methods =====
const corsOptions = {
  origin: '*', // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Content-Length']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight request handler

// ===== Body Parser Middleware =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===== Request Logger Middleware =====
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== Database Connection =====
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// ===== API Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/earnings', require('./routes/earnings'));

// ===== Health Check Routes =====
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success',
    message: '💰 Earning App Server is Running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: 'Enabled for All Origins'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Earning App API v1.0',
    description: 'Make money by completing tasks',
    endpoints: {
      auth: '/api/auth (register, login, verify)',
      users: '/api/users (profile, dashboard, update)',
      tasks: '/api/tasks (list, complete)',
      earnings: '/api/earnings (history, withdraw, summary)',
      health: '/api/health (status check)'
    },
    cors: 'All origins allowed',
    documentation: 'https://github.com/ritikraj9835699448-cell/Earning-app-money'
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: '❌ Endpoint not found',
    path: req.path,
    method: req.method,
    hint: 'Check the API documentation for available endpoints'
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
    timestamp: new Date().toISOString()
  });
});

// ===== Server Startup =====
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('         🚀 EARNING APP SERVER STARTED SUCCESSFULLY 🚀');
  console.log('='.repeat(70));
  console.log(`📍 Server Port: ${PORT}`);
  console.log(`🌐 CORS Status: ✅ ENABLED FOR ALL ORIGINS`);
  console.log(`🔓 API Access: FULLY OPEN - No restrictions`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI}`);
  console.log('='.repeat(70));
  console.log('Available Endpoints:');
  console.log('  • POST   /api/auth/register - Register new user');
  console.log('  • POST   /api/auth/login - Login user');
  console.log('  • GET    /api/auth/verify - Verify token');
  console.log('  • GET    /api/users/profile - Get user profile');
  console.log('  • GET    /api/users/dashboard - Get dashboard');
  console.log('  • PUT    /api/users/profile - Update profile');
  console.log('  • GET    /api/tasks - Get all tasks');
  console.log('  • POST   /api/tasks/:taskId/complete - Complete task');
  console.log('  • GET    /api/earnings/history - Get earnings history');
  console.log('  • GET    /api/earnings/summary - Get earnings summary');
  console.log('  • POST   /api/earnings/withdraw - Withdraw money');
  console.log('  • GET    /api/health - Health check');
  console.log('='.repeat(70) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

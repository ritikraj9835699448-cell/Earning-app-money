# 💰 Earning App - Make Money by Completing Tasks

A full-stack MERN application where users can earn money by completing various tasks.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT
- **Task Management**: Browse and complete tasks to earn rewards
- **Balance Management**: Track earnings and withdrawals
- **User Dashboard**: View statistics and earnings summary
- **Withdrawal System**: Withdraw earned money (minimum ₹100)
- **Responsive UI**: Beautiful, mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- CSS3 with modern styling

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/ritikraj9835699448-cell/Earning-app-money.git
cd Earning-app-money
```

### 2. Setup Backend
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key

# Start backend server
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/dashboard` - Get dashboard data
- `PUT /api/users/profile` - Update profile

### Tasks
- `GET /api/tasks` - Get all active tasks
- `POST /api/tasks/:taskId/complete` - Complete a task

### Earnings
- `GET /api/earnings/history` - Get earnings history
- `GET /api/earnings/summary` - Get earnings summary
- `POST /api/earnings/withdraw` - Withdraw money

## 🎯 Usage

1. **Register/Login**: Create your account
2. **Browse Tasks**: View available tasks with rewards
3. **Complete Tasks**: Click "Complete Task" to earn money
4. **Track Earnings**: Check your earnings history
5. **Withdraw**: Withdraw earned money to your account

## 📊 Project Structure

```
Earning-app-money/
├── models/
│   ├── User.js
│   ├── Task.js
│   └── Earning.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── tasks.js
│   └── earnings.js
├── middleware/
│   └── auth.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── package.json
├── server.js
├── package.json
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected API endpoints
- Input validation
- CORS configuration

## 🚀 Future Enhancements

- Payment gateway integration (Razorpay, Stripe)
- Email verification
- Referral system
- Admin dashboard
- Task analytics
- Multiple withdrawal methods
- User ratings and reviews

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

ritikraj9835699448-cell

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Happy Earning! 💵**

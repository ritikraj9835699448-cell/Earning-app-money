import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>💰 Earning App</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/earnings">Earnings</Link>
          <Link to="/profile">Profile</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </nav>
      </nav>

      {user && (
        <div className="dashboard-content">
          <h2>Welcome, {user.name}! 👋</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Balance</h3>
              <p className="stat-value">₹{user.balance}</p>
            </div>
            <div className="stat-card">
              <h3>Tasks Completed</h3>
              <p className="stat-value">{user.tasksCompleted}</p>
            </div>
            <div className="stat-card">
              <h3>Total Earnings</h3>
              <p className="stat-value">₹{user.totalEarnings}</p>
            </div>
            <div className="stat-card">
              <h3>Withdrawals</h3>
              <p className="stat-value">₹{user.withdrawals}</p>
            </div>
          </div>

          <div className="action-buttons">
            <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
            <Link to="/earnings" className="btn btn-primary">View Earnings</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

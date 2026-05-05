import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Earnings.css';

function Earnings() {
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const [summaryRes, historyRes] = await Promise.all([
        axios.get('/api/earnings/summary', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/earnings/history', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSummary(summaryRes.data);
      setEarnings(historyRes.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/earnings/withdraw', 
        { amount: parseFloat(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${response.data.message}`);
      setWithdrawAmount('');
      fetchEarnings();
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Withdrawal failed'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="earnings-container"><p>Loading...</p></div>;

  return (
    <div className="earnings-container">
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

      <div className="earnings-content">
        {summary && (
          <div className="earnings-summary">
            <div className="summary-card">
              <h3>Current Balance</h3>
              <p className="big-number">₹{summary.currentBalance}</p>
            </div>
            <div className="summary-card">
              <h3>Total Earnings</h3>
              <p className="big-number">₹{summary.totalEarnings}</p>
            </div>
            <div className="summary-card">
              <h3>Total Withdrawn</h3>
              <p className="big-number">₹{summary.withdrawals}</p>
            </div>
          </div>
        )}

        <div className="withdraw-section">
          <h2>Withdraw Money 💸</h2>
          {message && <div className="message">{message}</div>}
          <form onSubmit={handleWithdraw}>
            <div className="input-group">
              <label>Amount to Withdraw (Min: ₹100)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Withdraw</button>
          </form>
        </div>

        <div className="history-section">
          <h2>Earnings History 📊</h2>
          {earnings.length === 0 ? (
            <p>No earnings yet. Start completing tasks!</p>
          ) : (
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((earning) => (
                  <tr key={earning._id}>
                    <td>{earning.taskId?.title || 'N/A'}</td>
                    <td>₹{earning.amount}</td>
                    <td>{earning.type}</td>
                    <td><span className={`status ${earning.status}`}>{earning.status}</span></td>
                    <td>{new Date(earning.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Earnings;

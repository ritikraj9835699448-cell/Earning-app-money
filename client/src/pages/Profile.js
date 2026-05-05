import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setName(response.data.name);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/profile', 
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      setMessage('❌ Error updating profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="profile-container"><p>Loading...</p></div>;

  return (
    <div className="profile-container">
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
        <div className="profile-content">
          <h2>My Profile 👤</h2>
          {message && <div className="message">{message}</div>}
          
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                placeholder="Your email"
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>

          <div className="profile-stats">
            <h3>Your Statistics</h3>
            <div className="stats-list">
              <p><strong>Total Earnings:</strong> ₹{user.totalEarnings}</p>
              <p><strong>Current Balance:</strong> ₹{user.balance}</p>
              <p><strong>Tasks Completed:</strong> {user.tasksCompleted}</p>
              <p><strong>Total Withdrawn:</strong> ₹{user.withdrawals}</p>
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

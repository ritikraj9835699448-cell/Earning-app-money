import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ Task completed! Earned ₹${response.data.reward}`);
      fetchTasks();
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Error completing task'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="tasks-container"><p>Loading...</p></div>;

  return (
    <div className="tasks-container">
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

      <div className="tasks-content">
        <h2>Available Tasks 📋</h2>
        {message && <div className="message">{message}</div>}
        
        {tasks.length === 0 ? (
          <p>No tasks available at the moment.</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`badge ${task.difficulty}`}>{task.difficulty}</span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className="reward">💵 ₹{task.reward}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => completeTask(task._id)}
                  >
                    Complete Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;

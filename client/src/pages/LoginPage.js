import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // ⬅️ בדיקה אם המשתמש מחובר
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // ✅ מניעת גישה ל-LoginPage אם המשתמש מחובר
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/appointments'); // ⬅️ אם מחובר, מעבר אוטומטי
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(credentials));
      if (response.success) {
        navigate('/appointments'); // ⬅️ אם ההתחברות הצליחה, מעבר לעמוד הפגישות
      } else {
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error during login', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;

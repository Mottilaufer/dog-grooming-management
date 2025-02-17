import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/appointments');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3) {
      setMessage('Username must be at least 3 characters long');
      return;
    }
  

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    const userData = { username, password, fullName };
    const response = await dispatch(registerUser(userData));

    if (response.success) {
      setMessage('User registered successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 300);
    } else {
      setMessage(response.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="UserName (min. 3 chars)" required />
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min. 6 chars)" required />
          <input type="text" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required />
          <button type="submit">Register</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;

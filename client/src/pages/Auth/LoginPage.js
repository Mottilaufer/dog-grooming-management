import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/appointments');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
  
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await dispatch(loginUser(credentials));
      if (response.success) {
        navigate('/appointments');
      } else {
      setError('Incorrect username or password');
      }
    } catch (error) {
      console.error('Error during login', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username (min. 3 chars)" required />
          <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password (min. 6 chars)" required />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/userActions'; 
import { useNavigate } from 'react-router-dom'; 
import './RegisterPage.scss'; 

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  // ✅ מניעת גישה לעמוד ההרשמה אם המשתמש כבר מחובר
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/appointments'); 
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, password, fullName };

    const response = await dispatch(registerUser(userData));

    if (response.success) {
      navigate('/login');  
      alert('User registered successfully!');
    } else {
      setMessage(response.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <button type="submit">Register</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;

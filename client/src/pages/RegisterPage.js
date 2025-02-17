import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/userActions'; 
import { useNavigate } from 'react-router-dom'; 

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // ⬅️ בדיקה אם המשתמש מחובר

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  // ✅ מניעת גישה לעמוד ההרשמה אם המשתמש כבר מחובר
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/appointments'); // ⬅️ אם מחובר, נשלח אותו לדף הפגישות
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
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

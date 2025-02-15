import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const [credentials, setCredentials] = useState({ username: '', password: ''});

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
     debugger
      if (response.success) {
        navigate('/home');  
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default LoginPage;

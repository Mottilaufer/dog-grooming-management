import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header>
      <h1>Welcome to the Dog Grooming App</h1>
      {isAuthenticated && (
        <button onClick={handleLogout}>Log Out</button>
      )}
    </header>
  );
};

export default Header;

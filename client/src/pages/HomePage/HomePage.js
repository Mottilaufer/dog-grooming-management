import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.scss'; // Import the styles

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the Dog Grooming App</h1>
      <p>Choose your next step:</p>
      <div className="button-container">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

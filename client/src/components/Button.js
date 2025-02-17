
import React from 'react';

const Button = ({ onClick, text }) => (
  <button onClick={onClick} className="btn">
    {text}
  </button>
);

export default Button;

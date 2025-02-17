import React from "react";
import "./Popup.scss";

const Popup = ({ title, children, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{title}</h2>
        {children}
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;

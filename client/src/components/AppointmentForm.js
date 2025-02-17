import React, { useState } from "react";

const AppointmentForm = ({ onSubmit }) => {
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appointmentTime) {
      alert("Please select a valid appointment time.");
      return;
    }
    onSubmit(appointmentTime);
    setAppointmentTime("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select Appointment Time:
        <input type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
      </label>
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;

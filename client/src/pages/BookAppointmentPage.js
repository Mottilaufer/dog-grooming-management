import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '../redux/actions/appointmentActions'; // כאן תוכל להוסיף את הפעולה המתאימה ל-Redux

const BookAppointmentPage = () => {
  const dispatch = useDispatch();
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // שליחה של בקשת תור חדש ל-Redux
    dispatch(bookAppointment(appointmentDetails));
  };

  return (
    <div>
      <h1>Book New Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={appointmentDetails.date}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={appointmentDetails.time}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;

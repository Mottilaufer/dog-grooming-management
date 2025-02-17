import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bookAppointment } from '../../redux/actions/appointmentActions'; 
import './BookAppointmentPage.scss';

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
    dispatch(bookAppointment(appointmentDetails));
  };

  return (
    <div className="book-appointment-container">
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

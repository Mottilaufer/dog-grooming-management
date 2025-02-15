import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const user = useSelector(state => state.user);  // קבלת פרטי המשתמש מה-Redux
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      // כאן תוכל להוסיף קריאה ל-API כדי לקבל את ההזמנות של המשתמש
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    // לדוגמה, קריאה ל-API (תוכל לשים את ה-axios שלך פה)
    const response = await fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await response.json();
    setAppointments(data);
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            {appointment.date} - {appointment.time}
          </li>
        ))}
      </ul>
      <Link to="/book-appointment">Book New Appointment</Link>
    </div>
  );
};

export default HomePage;

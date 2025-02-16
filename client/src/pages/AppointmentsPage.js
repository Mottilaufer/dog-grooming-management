// src/pages/AppointmentsPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, deleteAppointment } from '../redux/actions/appointmentActions'; // מייבא את פעולות ה-API
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  debugger
  const { user } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);

  useEffect(() => {
    if (user) {
      dispatch(fetchAppointments(user.token)); 
    } else {
      navigate('/login'); 
    }
  }, [dispatch, user, navigate]);

  const handleDelete = (appointmentId) => {
    dispatch(deleteAppointment(appointmentId, user.token));
  };

  const handleEdit = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    alert(`Edit appointment for ${appointment.clientName}`);
 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="appointments-page">
      <h2>Your Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Appointment Date</th>
            <th>Client Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.clientName}</td>
              <td>
                <button onClick={() => handleEdit(appointment.id)}>Edit</button>
                <button onClick={() => handleDelete(appointment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/book-appointment">
        <button>Book New Appointment</button>
      </Link>
    </div>
  );
};

export default AppointmentsPage;

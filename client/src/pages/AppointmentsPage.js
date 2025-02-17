import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, deleteAppointment } from '../redux/actions/appointmentActions'; // Import the API actions
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './AppointmentsPage.scss';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, id } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);

  console.info(user);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  console.info(filteredAppointments);
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchAppointments(token)); 
    } else {
      navigate('/');
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (appointments) {
      setFilteredAppointments(appointments);
    }
  }, [appointments]);

  const handleDelete = (appointmentId) => {
    dispatch(deleteAppointment(appointmentId, token));
  };

  const handleEdit = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    debugger
    alert(`Edit appointment for ${appointment.fullName}`);
  };

  const handleSelectAppointment = (appointmentId) => {
    const selectedAppointment = appointments.find(a => a.id === appointmentId);
    setSelectedAppointment(selectedAppointment); // Save selected appointment info
    setShowPopup(true); // Show the popup
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    const filteredData = appointments.filter(appointment =>
      appointment.clientName.toLowerCase().includes(search) || appointment.appointmentDate.includes(search)
    );
    setFilteredAppointments(filteredData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="appointments-page">
      <h2>Your Appointments</h2>

      <input 
        type="text" 
        placeholder="Search by Client Name or Appointment Date" 
        onChange={handleSearch} 
        value={search}
      />

      <table>
        <thead>
          <tr>
            <th>Appointment Date</th>
            <th>Client Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments && filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.fullName}</td>
              <td>
                {/* Check if the appointment belongs to the user before allowing to edit */}
                {appointment?.userId.toString() === id ? (
                  <>
                    <button onClick={() => handleSelectAppointment(appointment.id)}>View</button>
                    <button onClick={() => handleEdit(appointment.id)}>Edit</button>
                    <button onClick={() => handleDelete(appointment.id)}>Delete</button>
                  </>
                ) : (
                  <span>Unauthorized</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/book-appointment">
        <button>Book New Appointment</button>
      </Link>

      {/* Popup */}
      {showPopup && selectedAppointment && (
        <div className="popup">
          <div className="popup-content">
            <h2>Appointment Details</h2>
            <p>Client Name: {selectedAppointment.fullName}</p>
            <p>Appointment Date: {selectedAppointment.appointmentDate}</p>
            <p>Created At: {selectedAppointment.createdAt}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

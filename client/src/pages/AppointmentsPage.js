import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, deleteAppointment, updateAppointment } from '../redux/actions/appointmentActions'; // Import the API actions
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './AppointmentsPage.scss';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, id } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    appointmentTime: '',
    updateAppointmentTime: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("token", token);
      console.log("appointments", appointments);

      if (token) {
        await dispatch(fetchAppointments(token));
      } else {
        navigate('/');
      }
    };
  
    fetchData();
  }, [token]);
  

  useEffect(() => {
    if (appointments ) {
      setFilteredAppointments(appointments);
    }
  }, [appointments]);

  const handleDelete = (appointmentId) => {
    dispatch(deleteAppointment(appointmentId, token));
  };

  const handleSelectAppointment = (appointmentId) => {
    const selected = appointments.find(a => a.id === appointmentId);
    setSelectedAppointment(selected); 
    setUpdatedAppointment({
      appointmentTime: selected.appointmentTime, 
      updateAppointmentTime: selected.updateAppointmentTime, 
      rowVer: selected.rowVer 
    });
    setShowPopup(true); 
  };

  const handleEdit = () => {
    const updatedData = {
      id: selectedAppointment.id,
      userId : id,
      updateAppointmentTime: updatedAppointment.updateAppointmentTime,
      rowVer: selectedAppointment.rowVer
    };

    dispatch(updateAppointment(updatedData, token))
    .then(() => {
      // אם העדכון הצליח, נעדכן את הרשימה מחדש
      dispatch(fetchAppointments(token)); // קרא לפונקציה fetchAppointments
      alert("Appointment updated successfully!");

    })
    .catch((error) => {
      console.error("Error updating appointment", error);
    });

    setShowPopup(false); // סגור את הפופאפ אחרי העדכון
  };

  const formatDate = (dateString) => {
    const [year, month, dayTime] = dateString.split('-');
    const [day, time] = dayTime.split('T');
    return `${year}-${day}-${month}T${time}`;
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    const filteredData = appointments.filter(appointment =>
      appointment.clientName.toLowerCase().includes(search) || appointment.appointmentDate.includes(search)
    );
    setFilteredAppointments(filteredData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAppointment({
      ...updatedAppointment,
      [name]: value
    });
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
              <td>{appointment.appointmentDate} - {appointment.appointmentTime} </td>
              <td>{appointment.fullName}</td>
              <td>
                  <>
                    <button 
                    onClick={() => handleSelectAppointment(appointment.id)} 
                    disabled={appointment?.userId.toString() !== id}
                    >
                    View
                  </button>
                  <button 
                    onClick={() => handleSelectAppointment(appointment.id)} 
                    disabled={appointment?.userId.toString() !== id}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment.id)} 
                    disabled={appointment?.userId.toString() !== id}
                  >
                    Delete
                  </button>
                  </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/book-appointment">
        <button>Book New Appointment</button>
      </Link>

      {/* Popup for editing appointment */}
      {showPopup && selectedAppointment && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Appointment</h2>
            <p>Client Name: {selectedAppointment.fullName}</p>
            <div>
              <label>
                Appointment Time (Current):
                <p>{`${selectedAppointment.appointmentDate} ${selectedAppointment.appointmentTime}`}</p>
              </label>
            </div>
            <div>
              <label>
                New Appointment Time:
                <input
                  type="datetime-local"
                  name="updateAppointmentTime"
                  value={updatedAppointment.updateAppointmentTime}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button onClick={handleEdit}>Save Changes</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

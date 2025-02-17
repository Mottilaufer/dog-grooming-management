import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, deleteAppointment, updateAppointment, bookAppointment } from '../redux/actions/appointmentActions';
import { useNavigate } from 'react-router-dom';
import './AppointmentsPage.scss';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, id } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    appointmentTime: '',
    updateAppointmentTime: ''
  });

  // משתנים לניהול יצירת תור חדש
  const [newAppointmentTime, setNewAppointmentTime] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchAppointments(token));
    } else {
      navigate('/');
    }
  }, [token]);

  useEffect(() => {
    if (appointments) {
      setFilteredAppointments(appointments);
    }
  }, [appointments]);

  const handleDelete = (appointmentId, userId) => {
    // יצירת האובייקט עם הנתונים הדרושים
    const appointmentData = {
      id: appointmentId,
      userId: parseInt(id, 10),
      
    };
  
    // שליחת האובייקט לפונקציה שמבצעת את מחיקת הפגישה
    dispatch(deleteAppointment(appointmentData, token))
    .then(() => {
      dispatch(fetchAppointments(token));
      alert("Appointment deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting appointment", error);
      alert("Failed to delete appointment.");
    });

  };
  

  const handleViewAppointment = (appointmentId) => {
    const selected = appointments.find(a => a.id === appointmentId);
    setSelectedAppointment(selected);
    setViewMode(true);
    setShowPopup(true);
  };

  const handleEditAppointment = (appointmentId) => {
    const selected = appointments.find(a => a.id === appointmentId);
    setSelectedAppointment(selected);
    setUpdatedAppointment({
      appointmentTime: selected.appointmentTime,
      updateAppointmentTime: selected.updateAppointmentTime,
      rowVer: selected.rowVer
    });
    setViewMode(false);
    setShowPopup(true);
  };

  const handleEdit = () => {
    const updatedData = {
      id: selectedAppointment.id,
      userId: id,
      updateAppointmentTime: updatedAppointment.updateAppointmentTime,
      rowVer: selectedAppointment.rowVer
    };

    dispatch(updateAppointment(updatedData, token))
      .then(() => {
        dispatch(fetchAppointments(token));
        alert("Appointment updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating appointment", error);
      });

    setShowPopup(false);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
  
    if (searchValue === "") {
      // אם השדה ריק, הצג את כל הפגישות מחדש
      setFilteredAppointments(appointments);
    } else {
      // סינון לפי שם לקוח או תאריך
      const filteredData = appointments.filter(appointment =>
        appointment.fullName.toLowerCase().includes(searchValue) || 
        appointment.appointmentDate.includes(searchValue)
      );
      setFilteredAppointments(filteredData);
    }
  };
  

  const handleNewAppointment = async (e) => {
    e.preventDefault();

    if (!newAppointmentTime) {
      alert("Please select a valid appointment time.");
      return;
    }

    const newAppointment = {
      userId: id,
      appointmentTime: newAppointmentTime
    };

    try {
      await dispatch(bookAppointment(newAppointment, token));
      alert("Appointment created successfully!");
      dispatch(fetchAppointments(token)); // לרענן את הרשימה
      setNewAppointmentTime(''); // לנקות את השדה
    } catch (error) {
      console.error("Error booking appointment", error);
    }
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
              <td>{appointment.appointmentDate} - {appointment.appointmentTime}</td>
              <td>{appointment.fullName}</td>
              <td>
                <>
                  <button 
                    onClick={() => handleViewAppointment(appointment.id)} 
                    disabled={appointment?.userId.toString() !== id}
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEditAppointment(appointment.id)} 
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

      {/* טופס להזנת תור חדש */}
      <h3>Book a New Appointment</h3>
      <form onSubmit={handleNewAppointment}>
        <label>
          Select Appointment Time:
          <input
            type="datetime-local"
            value={newAppointmentTime}
            onChange={(e) => setNewAppointmentTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">Book Appointment</button>
      </form>

      {/* פופאפ תצוגה/עריכה */}
      {showPopup && selectedAppointment && (
        <div className="popup">
          <div className="popup-content">
            {viewMode ? (
              <>
                <h2>Appointment Details</h2>
                <p><strong>Client Name:</strong> {selectedAppointment.fullName}</p>
                <p><strong>Appointment Time:</strong> {`${selectedAppointment.appointmentDate} ${selectedAppointment.appointmentTime}`}</p>
                <p><strong>Request Created At:</strong> {selectedAppointment.createdAt}</p>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </>
            ) : (
              <>
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
                      onChange={(e) => setUpdatedAppointment({ ...updatedAppointment, updateAppointmentTime: e.target.value })}
                    />
                  </label>
                </div>
                <button onClick={handleEdit}>Save Changes</button>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;

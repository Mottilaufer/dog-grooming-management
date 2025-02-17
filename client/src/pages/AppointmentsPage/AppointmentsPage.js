import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, deleteAppointment, updateAppointment, bookAppointment } from '../../redux/actions/appointmentActions';
import { useNavigate } from 'react-router-dom';
import './AppointmentsPage.scss';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, id } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    appointmentTime: '',
    updateAppointmentTime: ''
  });

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

  const handleDeleteConfirmed = () => {
    if (!appointmentToDelete) return;
  
    const appointmentData = {
      id: appointmentToDelete.id,
      userId: parseInt(id, 10),
    };
  
    dispatch(deleteAppointment(appointmentData, token))
      .then((data) => {
        if (data?.successResponse?.success) { 
          alert("Appointment deleted successfully!");
          dispatch(fetchAppointments(token)); 
        } else {
          alert(data?.successResponse?.message || "Failed to delete appointment.");
        }
      })
      .catch((error) => {
        console.error("Error deleting appointment", error);
        alert("Failed to delete appointment: " + error.message);
      });
  
    setShowDeletePopup(false);
    setAppointmentToDelete(null);
  };
  
  
  

  const confirmDelete = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    setAppointmentToDelete(appointment);
    setShowDeletePopup(true);
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
      .then((data) => {
        if (data?.successResponse?.success) {  
          alert("Appointment updated successfully!");
          dispatch(fetchAppointments(token)); 
        } else {
          alert(data?.successResponse?.message || "Failed to update appointment.");
        }
      })
      .catch((error) => {
        console.error("Error updating appointment", error);
        alert("Failed to update appointment: " + error.message);
      });
  
    setShowPopup(false);
  };
  

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
  
    if (searchValue === "") {

      setFilteredAppointments(appointments);
    } else {

      const filteredData = appointments.filter(appointment =>
        appointment.fullName.toLowerCase().includes(searchValue) || 
        appointment.appointmentDate.includes(searchValue)
      );
      setFilteredAppointments(filteredData);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setAppointmentToDelete(null);
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
  
    dispatch(bookAppointment(newAppointment, token))
      .then((data) => {
        if (data?.successResponse?.success) {  
          alert("Appointment created successfully!");
          dispatch(fetchAppointments(token)); 
          setNewAppointmentTime(''); 
        } else {
          alert(data?.successResponse?.message || "Failed to create appointment.");
        }
      })
      .catch((error) => {
        console.error("Error booking appointment", error);
        alert("Failed to create appointment: " + error.message);
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
                    onClick={() => confirmDelete(appointment.id)} 
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


{/* ✅ עכשיו פופאפ המחיקה נפרד מפופאפ העריכה */}
{showDeletePopup && appointmentToDelete && (
  <div className="popup">
    <div className="popup-content">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete the appointment for <strong>{appointmentToDelete.fullName}</strong> on <strong>{appointmentToDelete.appointmentDate} at {appointmentToDelete.appointmentTime}</strong>?</p>
      <button onClick={handleDeleteConfirmed} style={{ backgroundColor: 'red', color: 'white' }}>Confirm Delete</button>
      <button onClick={handleCancelDelete}>Cancel</button>
    </div>
  </div>
)}


    </div>
  );
};

export default AppointmentsPage;

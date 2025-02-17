import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, deleteAppointment, updateAppointment, bookAppointment,fetchAvailableslots } from "../../redux/actions/appointmentActions";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import "./AppointmentsPage.scss";
import TimeSlotSelector from "../../components/TimeSlotSelector"

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, id } = useSelector((state) => state.user);
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const { availableSlots } = useSelector((state) => state.appointments);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [newAppointmentTime, setNewAppointmentTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    updateAppointmentTime: "",
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchAppointments(token));
    } else {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    if (appointments) {
      setFilteredAppointments(appointments);
    }
  }, [appointments]);

  const handleDeleteConfirmed = () => {
    if (!selectedAppointment) return;

    const appointmentData = {
      id: selectedAppointment.id,
      userId: parseInt(id, 10),
    };

    dispatch(deleteAppointment(appointmentData, token))
      .then((data) => {
        if (data?.successResponse?.success) {
          alert("Appointment deleted successfully!");
          dispatch(fetchAvailableslots(token));
          dispatch(fetchAppointments(token));
        } else {
          alert(data?.successResponse?.message || "Failed to delete appointment.");
        }
      })
      .catch((error) => {
        console.error("Error deleting appointment", error);
        alert("Failed to delete appointment: " + error.message);
      });

    setPopupType(null);
  };

  const handleEdit = () => {
    const updatedData = {
      id: selectedAppointment.id,
      userId: id,
      updateAppointmentTime: `${updatedAppointment.updateAppointmentDate}T${updatedAppointment.updateAppointmentTime}:00`,
      rowVer: selectedAppointment.rowVer,
  };
  

    dispatch(updateAppointment(updatedData, token))
      .then((data) => {
        if (data?.successResponse?.success) {
          alert("Appointment updated successfully!");
          dispatch(fetchAppointments(token));
          dispatch(fetchAvailableslots(token));
        } else {
          alert(data?.successResponse?.message || "Failed to update appointment.");
        }
      })
      .catch((error) => {
        console.error("Error updating appointment", error);
        alert("Failed to update appointment: " + error.message);
      });

    setPopupType(null);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);

    if (searchValue === "") {
      setFilteredAppointments(appointments);
    } else {
      const filteredData = appointments.filter(
        (appointment) =>
          appointment.fullName.toLowerCase().includes(searchValue) ||
          appointment.appointmentDate.includes(searchValue)
      );
      setFilteredAppointments(filteredData);
    }
  };

  const handleNewAppointment = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a valid appointment time.");
      return;
    }



    const newAppointment = {
      userId: id,
      appointmentTime: `${selectedSlot.day}T${selectedSlot.time}:00`,
    };

    dispatch(bookAppointment(newAppointment, token))
      .then((data) => {
        if (data?.successResponse?.success) {
          alert("Appointment created successfully!");
          dispatch(fetchAppointments(token));
          dispatch(fetchAvailableslots(token));
          setSelectedSlot(null);
        } else {
          alert(data?.successResponse?.message || "Failed to create appointment.");
        }
      })
      .catch((error) => {
        console.error("Error booking appointment", error);
        alert("Failed to create appointment: " + error.message);
      });
  };

  return (
    <div className="appointments-page">
      <h2>Your Appointments</h2>

      <input type="text" placeholder="Search by Client Name or Appointment Date" onChange={handleSearch} value={search} />

      <table>
        <thead>
          <tr>
            <th>Appointment Date</th>
            <th>Client Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredAppointments &&
          filteredAppointments.map((appointment) => {
   
          const isDisabled = appointment?.userId?.toString() !== id;

          return (
            <tr key={appointment.id}>
              <td>{appointment.appointmentDate} - {appointment.appointmentTime}</td>
              <td>{appointment.fullName}</td>
              <td>
                <>
                  <button
                    onClick={() => { setSelectedAppointment(appointment); setPopupType("view"); }}
                    disabled={isDisabled}
                  >
                    View
                  </button>
                  <button
                    onClick={() => { 
                      setSelectedAppointment(appointment); 
                      setUpdatedAppointment({ updateAppointmentTime: appointment.appointmentTime }); 
                      setPopupType("edit"); 
                    }}
                    disabled={isDisabled}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setSelectedAppointment(appointment); setPopupType("delete"); }}
                    disabled={isDisabled}
                  >
                    Delete
                  </button>
                </>
              </td>
            </tr>
          );
        })}
        </tbody>

      </table>

      <h3>Book a New Appointment</h3>

        <TimeSlotSelector onSelect={setSelectedSlot} />
        <button onClick={handleNewAppointment} className="confirm-booking" type="submit" disabled={!selectedSlot}>Confirm Booking</button>
 

   

      {popupType && selectedAppointment && (
      <Popup
        title={
          popupType === "delete"
            ? "Confirm Deletion"
            : popupType === "edit"
            ? "Edit Appointment"
            : "Appointment Details"
        }
        onClose={() => setPopupType(null)}
      >
        {popupType === "delete" ? (
          <>
            <p>
              Are you sure you want to delete the appointment for{" "}
              <strong>{selectedAppointment.fullName}</strong>?
            </p>
            <button
              onClick={handleDeleteConfirmed}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Confirm Delete
            </button>
          </>
        ) : popupType === "edit" ? (
          <>
            <p>
              <strong>Current Appointment Time:</strong>{" "}
              {selectedAppointment.appointmentDate} {selectedAppointment.appointmentTime}
            </p>

            <div className="edit-appointment-row">
              <label>New Appointment Date:</label>
              <select
                value={updatedAppointment.updateAppointmentDate || ""}
                onChange={(e) =>
                  setUpdatedAppointment({
                    ...updatedAppointment,
                    updateAppointmentDate: e.target.value,
                    updateAppointmentTime: "", 
                  })
                }
              >
                <option value="" disabled>
                  Select a date
                </option>
                {availableSlots?.map((day) => (
                  <option key={day.date} value={day.date}>
                    {day.date}
                  </option>
                ))}
              </select>

              <label>New Appointment Time:</label>
              <select
                value={updatedAppointment.updateAppointmentTime || ""}
                onChange={(e) =>
                  setUpdatedAppointment({
                    ...updatedAppointment,
                    updateAppointmentTime: e.target.value,
                  })
                }
                disabled={!updatedAppointment.updateAppointmentDate} 
              >
                <option value="" disabled>
                  Select a time
                </option>
                {availableSlots
                  ?.find((d) => d.date === updatedAppointment.updateAppointmentDate)
                  ?.slots.filter((slot) => !slot.isBooked)
                  .map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
              </select>
            </div>

            <div className="edit-appointment-buttons">
              <button
                onClick={handleEdit}
                disabled={!updatedAppointment.updateAppointmentDate || !updatedAppointment.updateAppointmentTime}
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Client Name:</strong> {selectedAppointment.fullName}
            </p>
            <p>
              <strong>Appointment Time:</strong>{" "}
              {selectedAppointment.appointmentDate}{" "}
              {selectedAppointment.appointmentTime}
            </p>
            <p>
              <strong>Created At:</strong> {selectedAppointment.createdAt}
            </p>
          </>
        )}
      </Popup>
)}



    </div>
  );
};

export default AppointmentsPage;

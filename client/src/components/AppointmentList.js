import React from "react";

const AppointmentList = ({ appointments, handleView, handleEdit, handleDelete, userId }) => {
  return (
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
            <td>{appointment.appointmentDate} - {appointment.appointmentTime}</td>
            <td>{appointment.fullName}</td>
            <td>
              <button onClick={() => handleView(appointment.id)} disabled={appointment.userId.toString() !== userId}>
                View
              </button>
              <button onClick={() => handleEdit(appointment.id)} disabled={appointment.userId.toString() !== userId}>
                Edit
              </button>
              <button onClick={() => handleDelete(appointment.id)} disabled={appointment.userId.toString() !== userId}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentList;

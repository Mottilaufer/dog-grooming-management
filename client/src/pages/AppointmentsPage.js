// src/pages/AppointmentsPage.js
import React, { useState, useEffect } from 'react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('api/appointments'); // כאן תוכל לשנות את ה-API ששלח את המידע
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-page">
      <h2>Appointments</h2>
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
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;

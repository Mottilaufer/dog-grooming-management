// src/redux/actions/appointmentsActions.js
import axios from '../../services/axios';

// פעולה ל-fetch הזמנות של המשתמש
export const fetchAppointments = (token) => async (dispatch) => {
  try {
    const response = await axios.get('/appointments/occupied-appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: 'FETCH_APPOINTMENTS_SUCCESS',
      payload: response.data // מחזיר את הנתונים
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_APPOINTMENTS_FAILURE',
      payload: error.message
    });
  }
};

// פעולה למחוק תור
export const deleteAppointment = (appointmentId, token) => async (dispatch) => {
  try {
    const response = await axios.delete('/appointments/delete-appointment', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: 'DELETE_APPOINTMENT_SUCCESS',
      payload: appointmentId
    });
  } catch (error) {
    dispatch({
      type: 'DELETE_APPOINTMENT_FAILURE',
      payload: error.message
    });
  }
};



export const bookAppointment = (appointmentData, token) => async (dispatch) => {
  try {
    const response = await axios.post('/appointments/add-appointment', {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: 'BOOK_APPOINTMENT_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'BOOK_APPOINTMENT_FAILURE',
      payload: error.message,
    });
  }
};


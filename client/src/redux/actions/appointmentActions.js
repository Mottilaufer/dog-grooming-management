// redux/actions/appointmentActions.js
import axios from '../../services/axios';

export const bookAppointment = (appointmentDetails) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('/appointments', appointmentDetails); // כתובת ה-API לאשר
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
};

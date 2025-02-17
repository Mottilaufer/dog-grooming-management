import axios from '../../services/axios';

export const fetchAppointments = (token) => async (dispatch) => {

  dispatch({ type: 'FETCH_APPOINTMENTS_REQUEST' });

  try {
    const response = await axios.get('/appointments/occupied-appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: 'FETCH_APPOINTMENTS_SUCCESS',
      payload: response.data 
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_APPOINTMENTS_FAILURE',
      payload: error.message
    });
  }
};

export const fetchAvailableslots = (token) => async (dispatch) => {
  dispatch({ type: 'FETCH_AVAILABLE_SLOTS_REQUEST' });
  try {
    const response = await axios.get('/appointments/available-slots', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: 'FETCH_AVAILABLE_SLOTS_SUCCESS', 
      payload: response.data
    });

    return response.data; 
  } catch (error) {
    dispatch({
      type: 'FETCH_AVAILABLE_SLOTS_FAILURE',
      payload: error.message
    });
  }
};

export const deleteAppointment = (appointmentData, token) => async (dispatch) => {
  try {
    const response = await axios.delete('/appointments/delete-appointment', {
      headers: { Authorization: `Bearer ${token}` },
      data: appointmentData
    });

    dispatch({
      type: 'DELETE_APPOINTMENT_SUCCESS',
      payload: { id: appointmentData.id }, 
    });

    return response.data; 
  } catch (error) {
    dispatch({
      type: 'DELETE_APPOINTMENT_FAILURE',
      payload: error.message,
    });

    throw error;
  }
};

export const bookAppointment = (appointmentData, token) => async (dispatch) => {
  try {
    const response = await axios.post('/appointments/add-appointment', appointmentData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: 'BOOK_APPOINTMENT_SUCCESS',
      payload: response.data,
    });

    return response.data; 
  } catch (error) {
    dispatch({
      type: 'BOOK_APPOINTMENT_FAILURE',
      payload: error.message,
    });

    throw error; 
  }
};

export const updateAppointment = (updatedData, token) => async (dispatch) => {
  try {
    const response = await axios.put('/appointments/update-appointment', updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: 'UPDATE_APPOINTMENT_SUCCESS',
      payload: response.data,
    });

    return response.data; 
  } catch (error) {
    dispatch({
      type: 'UPDATE_APPOINTMENT_FAILURE',
      payload: error.message,
    });

    throw error; 
  }
};

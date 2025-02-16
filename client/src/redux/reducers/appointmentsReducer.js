// src/redux/reducers/appointmentsReducer.js
const initialState = {
    appointments: [],
    loading: false,
    error: null
  };
  
  const appointmentsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_APPOINTMENTS_SUCCESS':
        return {
          ...state,
          appointments: action.payload,
          loading: false
        };
      case 'FETCH_APPOINTMENTS_FAILURE':
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case 'DELETE_APPOINTMENT_SUCCESS':
        return {
          ...state,
          appointments: state.appointments.filter(
            (appointment) => appointment.id !== action.payload
          )
        };
      case 'DELETE_APPOINTMENT_FAILURE':
        return {
          ...state,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default appointmentsReducer;
  
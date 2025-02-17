const initialState = {
  appointments: [],
  availableSlots: [], 
  loading: false,
  error: null
};

const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_APPOINTMENTS_REQUEST': 
    case 'FETCH_AVAILABLE_SLOTS_REQUEST':
      return { ...state, loading: true, error: null };

    case 'FETCH_APPOINTMENTS_SUCCESS':
      return {
        ...state,
        appointments: action.payload,
        loading: false
      };

    case 'FETCH_AVAILABLE_SLOTS_SUCCESS': 
      return {
        ...state,
        availableSlots: action.payload,
        loading: false
      };

    case 'FETCH_APPOINTMENTS_FAILURE':  
    case 'FETCH_AVAILABLE_SLOTS_FAILURE':  
    case 'DELETE_APPOINTMENT_FAILURE':  
    case 'BOOK_APPOINTMENT_FAILURE':  
    case 'UPDATE_APPOINTMENT_FAILURE':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'DELETE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== action.payload.id 
        )
      };

    case 'BOOK_APPOINTMENT_SUCCESS': 
      return {
        ...state,
        appointments: [...state.appointments, action.payload], 
        loading: false
      };

    case 'UPDATE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
        loading: false
      };

    default:
      return state;
  }
};

export default appointmentsReducer;

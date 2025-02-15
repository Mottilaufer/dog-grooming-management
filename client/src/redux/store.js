import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
// import appointmentReducer from './reducers/appointmentReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    // appointments: appointmentReducer
  }
});

export default store;

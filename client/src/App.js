import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes במקום Switch
import { Provider } from 'react-redux';
import store from './redux/store';
import HomePage from './pages/HomePage';
import BookAppointmentPage from './pages//BookAppointmentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppointmentsPage from './pages/AppointmentsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

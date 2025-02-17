import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppointmentsPage from './pages/AppointmentsPage';
import './App.scss'; 

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <div className="page-content">
          <Header className="app-header" />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/book-appointment" element={<BookAppointmentPage />} />
            </Routes>
          </div>
          <Footer className="app-footer" />
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage/HomePage';
import BookAppointmentPage from './pages/BookAppointmentPage/BookAppointmentPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AppointmentsPage from './pages/AppointmentsPage/AppointmentsPage';
import './App.scss'; 

const AppWrapper = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (isAuthenticated && (currentPath === '/' || currentPath === '/home')) {
      navigate('/appointments');
    }
  }, [isAuthenticated, navigate]);

  return (
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
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Footer className="app-footer" />
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppWrapper />
      </Router>
    </Provider>
  );
}

export default App;

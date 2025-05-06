import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import Header from './components/header/Header';
import HeroSection from './components/hero-section/HeroSection';
import Features from './components/features/Features';
import CallToAction from './components/call-to-action/CallToAction';
import './App.css';
import { Footer } from './components/footer/Footer';
import { About } from './components/about/About';
import Login from './components/login/LogIn';
import Register from './components/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHeader from './components/dashboard/dashhoard-header/DashboardHeader';
import Finanzas from './pages/finances/Finances';
import PrivateRoute from './hook/private-route/PrivateRoute';
import Profile from './pages/profile/Profile';
import Tasks from './pages/tasks/Tasks';
import ResetPassword from './pages/reset-password/ResetPassword';

function AppContent() {
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/reset-password');

  return (
    <>
      {!isAuthRoute && !isDashboardRoute && <Header />}
      {isDashboardRoute && (
        <DashboardHeader
          // user={{
          //   name: 'Juan Pérez',
          //   profilePicture: 'https://via.placeholder.com/40'
          // }}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <About />
              <Features />
              <CallToAction />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 👇 Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/finances"
          element={
            <PrivateRoute>
              <Finanzas />
            </PrivateRoute>
          }
        />
      </Routes>

      {!isAuthRoute && !isDashboardRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

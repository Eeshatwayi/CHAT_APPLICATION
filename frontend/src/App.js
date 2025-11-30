import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';  // ADD THIS
import ResetPassword from './components/Auth/ResetPassword';    // ADD THIS
import ChatRoom from './components/Chat/ChatRoom';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />     {/* ADD THIS */}
            <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ADD THIS */}
            <Route 
              path="/chat" 
              element={
                <PrivateRoute>
                  <ChatRoom />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupPage from './pages/GroupPage';
import CreatePostPage from './pages/CreatePostPage';
import CreateGroupPage from './pages/CreateGroupPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/group/:groupId" element={
              <ProtectedRoute>
                <GroupPage />
              </ProtectedRoute>
            } />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } />
            <Route path="/create-group" element={
              <ProtectedRoute>
                <CreateGroupPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

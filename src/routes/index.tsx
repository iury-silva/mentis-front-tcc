// src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ProtectedRoute from '@/routes/ProtectedRoute'; // Corrected path: ProtectedRoute is in routes
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes for authentication (e.g., login, signup) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        {/* Add other auth routes like /register here */}
      </Route>

      {/* Protected routes for the main application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<HomePage />} />
          {/* Add other protected app routes here, e.g., /dashboard, /profile */}
        </Route>
      </Route>

      {/* You can add other top-level routes here if needed, e.g., a 404 page */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;

// src/routes/index.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Auth/LoginPage";
import HomePage from "@/pages/Dashboard/HomePage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes for authentication (e.g., login, signup) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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

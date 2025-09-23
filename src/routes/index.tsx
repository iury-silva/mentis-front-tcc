// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

//components
import ScrollToTop from "@/components/ScrollToTop";

//routes
import LoginPage from "@/pages/Auth/LoginPage";
import DashboardAdminPage from "@/pages/Dashboard/DashboardAdminPage";
import DashboardUserPage from "@/pages/Dashboard/DashboardUserPage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import GoogleLoggedPage from "@/pages/Auth/GoogleLoggedPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import QuestionnairePage from "@/pages/Questionnaire/QuestionnairePage";
import BlockDetailPage from "@/pages/Questionnaire/BlockDetailPage";
import BlockReviewPage from "@/pages/Questionnaire/BlockReviewPage";
import MoodTracker from "@/pages/MoodTracker/MoodTracker";
import SettingsPage from "@/pages/Settings/SettingsPage";
import HomeRedirect from "@/components/HomeRedirect";

//Layouts
import AuthLayout from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes for authentication (e.g., login, signup) */}
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/google/callback" element={<GoogleLoggedPage />} />
          {/* Add other auth routes like /register here */}
        </Route>

        {/* Protected routes for the main application - Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardAdminPage />} />
            {/* Add other protected app routes here, e.g., /dashboard, /profile */}
          </Route>
        </Route>

        {/* Protected routes for the main application - User only */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<AppLayout />}>
            {/* Add other protected app routes here, e.g., /dashboard, /profile */}
            <Route path="/dashboard-user" element={<DashboardUserPage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route
              path="/questionnaire/blocks/:blockId"
              element={<BlockDetailPage />}
            />
            <Route
              path="/questionnaire/responses/:blockId"
              element={<BlockReviewPage />}
            />
            <Route path="/mood-tracker" element={<MoodTracker />} />
          </Route>
        </Route>

        {/* Protected routes for the main application - All roles */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route element={<AppLayout />}>
            {/* Add other protected app routes here, e.g., /dashboard, /profile */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route
          path="/unauthorized"
          element={
            <div className="p-6 text-center text-red-600">Acesso negado!</div>
          }
        />

        {/* You can add other top-level routes here if needed, e.g., a 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Utils
import ScrollToTop from "@/utils/ScrollToTop";
import HomeRedirect from "@/utils/HomeRedirect";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";

// Auth Pages
import LoginPage from "@/pages/Auth/LoginPage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import GoogleLoggedPage from "@/pages/Auth/GoogleLoggedPage";
import CompleteProfile from "@/pages/Auth/CompleteProfile";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";

// Admin Pages
import DashboardAdminPage from "@/pages/Admin/Dashboard/DashboardAdminPage";
import QuestionnaireAdminPage from "@/pages/Admin/Questionnaires/QuestionnaireAdminPage";

// User Pages
import DashboardUserWithOnboarding from "@/pages/Dashboard/DashboardUserWithOnboarding";
import QuestionnairePage from "@/pages/Questionnaire/QuestionnairePage";
import BlockDetailPage from "@/pages/Questionnaire/Blocks/BlockDetailPage";
import BlockReviewPage from "@/pages/Questionnaire/Blocks/BlockReviewPage";
import BlockBonusPage from "@/pages/Questionnaire/Blocks/BlockBonusPage";
import MoodTrackerIndex from "@/pages/MoodTracker";
import MapsNearby from "@/pages/Maps/MapsNearby";

// Common Pages
import SettingsPage from "@/pages/Settings/SettingsPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import { CreditsPage } from "@/pages/About/CreditsPage";

// Route protection
import ProtectedRoute from "@/routes/ProtectedRoute";

// ✅ Configuração declarativa de rotas
const routesConfig = [
  {
    role: ["admin"],
    children: [
      { path: "/dashboard", element: <DashboardAdminPage /> },
      { path: "/questionnaires", element: <QuestionnaireAdminPage /> },
    ],
  },
  {
    role: ["user"],
    children: [
      { path: "/dashboard-user", element: <DashboardUserWithOnboarding /> },
      { path: "/questionnaire", element: <QuestionnairePage /> },
      {
        path: "/questionnaire/blocks/:blockId",
        element: <BlockDetailPage />,
      },
      {
        path: "/questionnaire/responses/:blockId",
        element: <BlockReviewPage />,
      },
      {
        path: "/questionnaire/blocks/:blockId/bonus",
        element: <BlockBonusPage />,
      },
      { path: "/mood-tracker", element: <MoodTrackerIndex /> },
      { path: "/maps-nearby", element: <MapsNearby /> },
    ],
  },
  {
    role: ["admin", "user"],
    children: [
      { path: "/settings", element: <SettingsPage /> },
      { path: "/credits", element: <CreditsPage /> },
    ],
  },
];

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/google/callback" element={<GoogleLoggedPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Complete Profile (permite perfil incompleto) */}
        <Route element={<ProtectedRoute requireCompleteProfile={false} />}>
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Route>

        {/* Protected Routes (Admin / User / Shared) */}
        {routesConfig.map(({ role, children }) => (
          <Route
            key={role.join("-")}
            element={<ProtectedRoute allowedRoles={role} />}
          >
            <Route element={<AppLayout />}>
              {children.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
          </Route>
        ))}

        {/* 🚫 Unauthorized & 404 */}
        <Route
          path="/unauthorized"
          element={
            <div className="p-6 text-center text-red-600 font-semibold">
              Acesso negado!
            </div>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

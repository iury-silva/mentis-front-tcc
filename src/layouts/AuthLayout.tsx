// src/layouts/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div>
      {/* Optional: Common elements for auth pages like a branding header */}
      {/* <h2>Auth Section</h2> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;

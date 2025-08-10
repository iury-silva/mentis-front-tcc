// src/layouts/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div>
      {/* Optional: Common elements for the main app like a Navbar or Sidebar */}
      {/* <header>
        <nav>App Navigation</nav>
      </header> */}
      <main>
        <Outlet />
      </main>
      {/* Optional: Common footer */}
      {/* <footer>App Footer</footer> */}
    </div>
  );
};

export default AppLayout;

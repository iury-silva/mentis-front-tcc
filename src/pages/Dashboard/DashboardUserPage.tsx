import React from 'react';
import { useAuth } from '../../auth/useAuth';

const DashboardUserPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome!</h1>
      <p>This is the authenticated home page.</p>
      {user && (
        <div>
          <h2>User Information</h2>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardUserPage;

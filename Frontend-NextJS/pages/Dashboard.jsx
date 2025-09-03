import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const { user, role, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-gray-700 mb-4">Welcome, {user?.displayName || user?.email}</p>
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded bg-blue-50 px-3 py-1 text-blue-700 text-sm">
          Role: <strong className="font-medium">{role || 'unknown'}</strong>
        </span>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;




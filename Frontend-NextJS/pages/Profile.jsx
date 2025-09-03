import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Profile = () => {
  const { user, role, logout } = useAuth();
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <div className="space-y-2 text-gray-800">
        <div><span className="font-medium">Name:</span> {user?.displayName || '—'}</div>
        <div><span className="font-medium">Email:</span> {user?.email}</div>
        <div><span className="font-medium">Role:</span> {role || 'user'}</div>
      </div>
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >Logout</button>
    </div>
  );
};

export default Profile;



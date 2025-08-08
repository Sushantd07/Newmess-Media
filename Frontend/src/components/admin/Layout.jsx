import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊', tooltip: 'Overview and quick stats' },
  { path: '/admin/categories', label: 'Categories', icon: '📁', tooltip: 'Manage all categories' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢', tooltip: 'Manage all companies' },
  { path: '/admin/complaint-editor', label: 'Complaints', icon: '📝', tooltip: 'Handle complaints' },
  { path: '/admin/dnd-form-builder', label: 'Form Builder', icon: '🧩', tooltip: 'Create custom forms' },
];

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="w-full bg-white shadow flex items-center px-8 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-700">Admin Panel</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">Non-coder Friendly</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-500 text-sm">Welcome, Admin!</span>
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">A</div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-lg min-h-screen flex flex-col sticky top-0 z-10">
          {/* User Profile */}
          <div className="flex flex-col items-center py-8 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-700 font-bold mb-2">A</div>
            <div className="font-semibold text-gray-800">Admin User</div>
            <div className="text-xs text-gray-400">admin@yourapp.com</div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={item.tooltip}
                className={`flex items-center px-5 py-4 text-base font-medium rounded-xl transition-colors group shadow-sm mb-2
                  ${location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                `}
              >
                <span className="mr-4 text-2xl">{item.icon}</span>
                {item.label}
                <span className="ml-auto opacity-0 group-hover:opacity-100 text-xs text-gray-400 transition">{item.tooltip}</span>
              </Link>
            ))}
          </nav>
          {/* Help Button */}
          <div className="mt-auto mb-8 px-4">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition">
              <span>❓</span> Help & Support
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10 bg-transparent min-h-screen">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 
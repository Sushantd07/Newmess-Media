import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../../services/categoryService.js';

const Dashboard = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const categories = await CategoryService.getCategories();
      setBackendStatus('connected');
      setCategoriesCount(Array.isArray(categories) ? categories.length : 0);
    } catch (error) {
      console.error('Backend connection error:', error);
      setBackendStatus('error');
    }
  };

  const stats = [
    { title: 'Total Categories', value: categoriesCount.toString(), icon: '📁', color: 'bg-blue-500' },
    { title: 'Total Companies', value: '156', icon: '🏢', color: 'bg-green-500' },
    { title: 'Active Complaints', value: '23', icon: '📝', color: 'bg-yellow-500' },
    { title: 'Total Reviews', value: '1,234', icon: '⭐', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { title: 'Create Category', path: '/admin/categories', icon: '➕' },
    { title: 'Add Company', path: '/admin/companies', icon: '🏢' },
    { title: 'Manage Complaints', path: '/admin/complaint-editor', icon: '📝' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Backend Status */}
      <div className={`p-4 rounded-lg ${
        backendStatus === 'connected' ? 'bg-green-50 text-green-800 border border-green-200' : 
        backendStatus === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
        'bg-yellow-50 text-yellow-800 border border-yellow-200'
      }`}>
        <div className="flex items-center">
          <span className="mr-2">
            {backendStatus === 'connected' ? '✅' : backendStatus === 'error' ? '❌' : '⏳'}
          </span>
          <span>
            {backendStatus === 'connected' ? 'Backend Connected' : 
             backendStatus === 'error' ? 'Backend Connection Failed' : 
             'Checking Backend Status...'}
          </span>
        </div>
        {backendStatus === 'connected' && (
          <p className="text-sm mt-1">Found {categoriesCount} categories in database</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">{action.icon}</span>
              <span className="font-medium text-gray-900">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">New company "ICICI Bank" added</span>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-blue-500 mr-3">📝</span>
              <span className="text-gray-700">Category "Banking" updated</span>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-3">⚠</span>
              <span className="text-gray-700">New complaint received</span>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
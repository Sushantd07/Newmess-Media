import React, { useState, useEffect } from 'react';
import SimpleTabManager from '../components/admin/SimpleTabManager';

const TabManagerTest = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching company data
    const fetchCompanyData = async () => {
      try {
        // For testing, we'll use a mock company data structure
        const mockCompanyData = {
          _id: 'test-company-123',
          name: 'Test Bank',
          slug: 'test-bank',
          tabs: {
            'numbers': 'existing-contact-tab-id',
            'overview': 'existing-overview-tab-id'
          },
          selectedTabs: ['numbers', 'overview']
        };
        
        setCompanyData(mockCompanyData);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleRefresh = () => {
    console.log('Company data refreshed!');
    // In a real app, this would refetch the company data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tab Manager Test</h1>
          <p className="text-gray-600">
            This page demonstrates the new SimpleTabManager component for managing company tabs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-gray-900">{companyData?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Slug</label>
              <p className="text-gray-900">{companyData?.slug}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company ID</label>
              <p className="text-gray-900 font-mono text-sm">{companyData?._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selected Tabs</label>
              <p className="text-gray-900">{companyData?.selectedTabs?.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>

        <SimpleTabManager 
          companyData={companyData}
          onSave={handleRefresh}
        />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Add Tab:</strong> Click "Add Tab" to create new tabs for this company</li>
            <li>• <strong>Edit Tab:</strong> Click the edit icon to modify tab content and labels</li>
            <li>• <strong>Remove Tab:</strong> Click the trash icon to remove tabs from the company</li>
            <li>• <strong>Toggle Visibility:</strong> Use the eye icon to show/hide tabs</li>
            <li>• <strong>Content Editor:</strong> Use the TinyMCE editor for rich content editing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabManagerTest;


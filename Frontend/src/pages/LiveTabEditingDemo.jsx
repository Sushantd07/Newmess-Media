import React, { useState, useEffect } from 'react';
import { Settings, Eye, Edit3, Database, Cloud } from 'lucide-react';
import EditableSidebar from '../components/admin/EditableSidebar';
import EnhancedCompanyPageEditor from '../components/admin/EnhancedCompanyPageEditor';
import { TabManagementProvider, useTabManagement } from '../contexts/TabManagementContext';

const LiveTabEditingDemo = () => {
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [currentView, setCurrentView] = useState('live'); // 'live', 'full-edit', or 'enhanced-editor'
  const [showEnhancedEditor, setShowEnhancedEditor] = useState(false);
  
  // Sample company data
  const [sampleCompanyData] = useState({
    _id: 'demo-company-id',
    slug: 'hdfc-bank',
    name: 'HDFC Bank',
    description: 'Leading private sector bank in India',
    logo: '/company-logos/Bank/hdfc_bank.svg',
    website: 'https://www.hdfcbank.com',
    founded: '1994',
    headquarters: 'Mumbai, India'
  });
  
  // Sample initial tabs
  const [initialTabs] = useState([
    { id: 'overview', label: 'Overview', icon: 'BarChart', content: '' },
    { id: 'contact', label: 'Contact Numbers', icon: 'Phone', content: '' },
    { id: 'complaints', label: 'Complaints', icon: 'FileText', content: '' }
  ]);

  return (
    <TabManagementProvider>
      <DemoContent 
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
        initialTabs={initialTabs}
        sampleCompanyData={sampleCompanyData}
        showEnhancedEditor={showEnhancedEditor}
        setShowEnhancedEditor={setShowEnhancedEditor}
      />
    </TabManagementProvider>
  );
};

const DemoContent = ({ 
  isAdminMode, 
  setIsAdminMode, 
  currentView, 
  setCurrentView, 
  initialTabs,
  sampleCompanyData,
  showEnhancedEditor,
  setShowEnhancedEditor
}) => {
  const { tabs, initializeTabs, lastModified } = useTabManagement();
  const [sidebarContent, setSidebarContent] = useState('<h3>Table of Contents</h3><p>This is a demo of live tab editing functionality.</p>');

  // Initialize tabs on component mount
  useEffect(() => {
    if (tabs.length === 0) {
      initializeTabs(initialTabs, 'demo-initialization');
    }
  }, [initializeTabs, initialTabs, tabs.length]);

  // Listen for tab updates
  useEffect(() => {
    const handleTabsUpdated = (event) => {
      console.log('📢 Tabs updated event received:', event.detail);
    };

    window.addEventListener('tabsUpdated', handleTabsUpdated);
    return () => window.removeEventListener('tabsUpdated', handleTabsUpdated);
  }, []);

  const handleSidebarSave = async (content) => {
    setSidebarContent(content);
    console.log('💾 Sidebar content saved:', content);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Tab Editing Demo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Experience real-time tab management with sidebar integration
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="live">Live View</option>
                <option value="full-edit">Full Edit Mode</option>
                <option value="enhanced-editor">Enhanced Editor</option>
              </select>
            </div>
            
            {/* Enhanced Editor Button */}
            <button
              onClick={() => setShowEnhancedEditor(true)}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Database className="h-4 w-4" />
              Open Enhanced Editor
            </button>

            {/* Admin Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Admin Mode:</span>
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isAdminMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isAdminMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <EditableSidebar
          title="Demo Sidebar"
          initialContent={sidebarContent}
          isAdminMode={isAdminMode}
          onSave={handleSidebarSave}
          tabs={tabs}
          showTabManager={true}
          className="border-r border-gray-300"
        />

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">System Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Admin Mode:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    isAdminMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isAdminMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Current View:</span>
                  <span className="ml-2 text-blue-600">{currentView}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Total Tabs:</span>
                  <span className="ml-2 text-blue-600">{tabs.length}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Last Modified:</span>
                  <span className="ml-2 text-blue-600">
                    {new Date(lastModified).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Tabs Display */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Tabs</h3>
              {tabs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tabs.map((tab, index) => (
                    <div
                      key={tab.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">{tab.label}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {tab.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No tabs available. Enable admin mode and use the sidebar to add tabs.</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Enable Admin Mode:</strong> Toggle admin mode using the button in the header
                </li>
                <li>
                  <strong>Access Tab Manager:</strong> In the sidebar, click the gear icon (⚙️) to switch to tab management mode
                </li>
                <li>
                  <strong>Add Tabs:</strong> Click the + button to add new tabs with custom names
                </li>
                <li>
                  <strong>Edit Tabs:</strong> Hover over existing tabs and click the edit icon to rename them
                </li>
                <li>
                  <strong>Delete Tabs:</strong> Hover over tabs and click the trash icon to remove them
                </li>
                <li>
                  <strong>Real-time Sync:</strong> All changes are instantly reflected in the "Current Tabs" section above
                </li>
              </ol>
            </div>

            {/* Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-900 mb-3">Features Demonstrated</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>Live tab editing without page refresh</li>
                <li>Real-time synchronization between components</li>
                <li>Admin mode toggle for controlled access</li>
                <li>Context-based state management</li>
                <li>Integration with existing sidebar component</li>
                <li>Event-driven updates for loose coupling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Company Page Editor */}
      {showEnhancedEditor && (
        <EnhancedCompanyPageEditor
          companyData={sampleCompanyData}
          isVisible={showEnhancedEditor}
          onSave={async (data) => {
            console.log('🔄 Saving company data with tabs:', data);
            // In a real app, this would call your API
            alert('Company data saved successfully! (Demo mode)');
            setShowEnhancedEditor(false);
          }}
          onCancel={() => setShowEnhancedEditor(false)}
          onRefresh={() => {
            console.log('🔄 Refreshing company data...');
          }}
        />
      )}
    </div>
  );
};

export default LiveTabEditingDemo;

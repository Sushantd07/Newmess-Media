import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Edit3, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  FileText,
  Phone,
  HelpCircle,
  PlayCircle,
  Building2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { TabManagementProvider, useTabManagement } from '../../contexts/TabManagementContext';
import EditableSidebar from './EditableSidebar';
import tabService from '../../services/tabService';

const EnhancedCompanyPageEditor = ({ 
  companyData, 
  onSave, 
  onCancel,
  onRefresh,
  isVisible = false 
}) => {
  return (
    <TabManagementProvider>
      <CompanyPageEditorContent 
        companyData={companyData}
        onSave={onSave}
        onCancel={onCancel}
        onRefresh={onRefresh}
        isVisible={isVisible}
      />
    </TabManagementProvider>
  );
};

const CompanyPageEditorContent = ({ 
  companyData, 
  onSave, 
  onCancel,
  onRefresh,
  isVisible 
}) => {
  // Tab management context
  const { 
    tabs, 
    fetchTabs, 
    setCompanyContext, 
    isLoading: tabsLoading, 
    error: tabsError 
  } = useTabManagement();

  // Local state
  const [editingData, setEditingData] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarContent, setSidebarContent] = useState('');

  // Tab-specific state
  const [tabsNeedSync, setTabsNeedSync] = useState(false);
  const [lastSyncedTabs, setLastSyncedTabs] = useState([]);

  // Initialize editing data and fetch tabs
  useEffect(() => {
    if (companyData) {
      setEditingData(JSON.parse(JSON.stringify(companyData)));
      
      // Set company context and fetch tabs
      const companyId = companyData._id || companyData.id || companyData.slug;
      if (companyId) {
        setCompanyContext(companyId);
        fetchTabsData(companyId);
      }
    }
  }, [companyData]);

  // Watch for tab changes to sync with editing data
  useEffect(() => {
    if (tabs.length > 0 && JSON.stringify(tabs) !== JSON.stringify(lastSyncedTabs)) {
      setTabsNeedSync(true);
      setLastSyncedTabs([...tabs]);
      
      // Update editing data with new tabs
      setEditingData(prev => ({
        ...prev,
        tabs: tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: tab.icon,
          type: tab.type,
          isActive: tab.isActive,
          order: tab.order,
          data: tab.data
        }))
      }));
    }
  }, [tabs, lastSyncedTabs]);

  const fetchTabsData = async (companyId) => {
    try {
      await fetchTabs(companyId, 'company-editor-init');
    } catch (error) {
      console.error('Error fetching tabs in editor:', error);
    }
  };

  const handleRefreshTabs = async () => {
    const companyId = companyData._id || companyData.id || companyData.slug;
    if (companyId) {
      setIsRefreshing(true);
      try {
        await fetchTabsData(companyId);
      } catch (error) {
        console.error('Error refreshing tabs:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleEditField = (field, value) => {
    setEditingField(field);
    setTempValue(value || '');
  };

  const handleSaveField = () => {
    if (editingField) {
      setEditingData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      setEditingField(null);
      setTempValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSaveChanges = async () => {
    try {
      // Include the updated tabs in the save data
      const dataToSave = {
        ...editingData,
        tabs: tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: tab.icon,
          type: tab.type,
          isActive: tab.isActive,
          order: tab.order,
          data: tab.data
        }))
      };

      await onSave(dataToSave);
      setShowSaveModal(false);
      setTabsNeedSync(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const EditableField = ({ field, value, label, type = 'text', className = '' }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSaveField()}
            />
            <button
              onClick={handleSaveField}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => handleEditField(field, value)}
            className="px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">
                {value || `Click to add ${label.toLowerCase()}`}
              </span>
              <Edit3 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full h-full max-h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Company Page
              </h2>
              <p className="text-sm text-gray-600">
                {companyData?.name || 'Unknown Company'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tab sync indicator */}
            {tabsNeedSync && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Tabs updated</span>
              </div>
            )}
            
            {/* Refresh tabs button */}
            <button
              onClick={handleRefreshTabs}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Refresh tabs from database"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 inline mr-2" />
              Save Changes
            </button>
            
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar with Tab Management */}
          <EditableSidebar
            title="Page Management"
            initialContent={sidebarContent}
            isAdminMode={true}
            onSave={(content) => setSidebarContent(content)}
            tabs={tabs}
            showTabManager={true}
            className="border-r border-gray-300"
          />

          {/* Main Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'General Info', icon: Building2 },
                { id: 'tabs', label: 'Tab Overview', icon: Settings },
                { id: 'advanced', label: 'Advanced', icon: Eye }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Info Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  General Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    field="name"
                    value={editingData.name}
                    label="Company Name"
                  />
                  
                  <EditableField
                    field="slug"
                    value={editingData.slug}
                    label="URL Slug"
                  />
                  
                  <EditableField
                    field="logo"
                    value={editingData.logo}
                    label="Logo URL"
                  />
                  
                  <EditableField
                    field="website"
                    value={editingData.website}
                    label="Website"
                    type="url"
                  />
                  
                  <EditableField
                    field="founded"
                    value={editingData.founded}
                    label="Founded"
                  />
                  
                  <EditableField
                    field="headquarters"
                    value={editingData.headquarters}
                    label="Headquarters"
                  />
                </div>

                <EditableField
                  field="description"
                  value={editingData.description}
                  label="Description"
                  className="col-span-2"
                />
              </div>
            )}

            {/* Tab Overview */}
            {activeTab === 'tabs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Tab Overview
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Current tabs for this company page
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Total: {tabs.length} tabs
                    </span>
                    {tabsLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                  </div>
                </div>

                {/* Tab Status */}
                {tabsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-medium">Error loading tabs</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{tabsError}</p>
                  </div>
                )}

                {/* Tabs List */}
                <div className="space-y-3">
                  {tabs.map((tab, index) => {
                    const IconComponent = tab.icon === 'Phone' ? Phone :
                                         tab.icon === 'HelpCircle' ? HelpCircle :
                                         tab.icon === 'PlayCircle' ? PlayCircle :
                                         FileText;
                    
                    return (
                      <div
                        key={tab.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tab.label}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  tab.type === 'standard' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {tab.type}
                                </span>
                                <span>Order: {tab.order}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              tab.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`} title={tab.isActive ? 'Active' : 'Inactive'} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {tabs.length === 0 && !tabsLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No tabs found for this company.</p>
                    <p className="text-sm">Use the sidebar tab manager to add tabs.</p>
                  </div>
                )}
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Advanced Settings
                </h3>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Debug Information</h4>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p>Company ID: {companyData?._id || companyData?.id}</p>
                    <p>Slug: {companyData?.slug}</p>
                    <p>Tabs in Context: {tabs.length}</p>
                    <p>Tabs Need Sync: {tabsNeedSync ? 'Yes' : 'No'}</p>
                    <p>Last Modified: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Changes
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save all changes? This will update the company page
              {tabsNeedSync && ' and sync all tab modifications'}.
            </p>
            
            {tabsNeedSync && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>Tab changes detected:</strong> Your tab modifications will be included in this save.
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCompanyPageEditor;


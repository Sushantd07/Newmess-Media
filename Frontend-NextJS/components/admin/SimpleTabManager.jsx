import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  FileText,
  Phone,
  HelpCircle,
  PlayCircle,
  Building2,
  AlertCircle
} from 'lucide-react';
import TinyMCEEditor from './TinyMCEEditor.jsx';

const SimpleTabManager = ({ companyData, onSave }) => {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabData, setNewTabData] = useState({
    type: 'overview',
    label: '',
    content: ''
  });

  // Debug logging for props
  useEffect(() => {
    console.log('🔍 SimpleTabManager mounted with props:', { companyData, onSave });
  }, []);

  // Debug logging when companyData changes
  useEffect(() => {
    console.log('🔍 SimpleTabManager companyData changed:', companyData);
  }, [companyData]);

  // Available tab types with their icons and labels
  const availableTabTypes = [
    { type: 'overview', label: 'Overview', icon: Building2, description: 'Company overview and general information' },
    { type: 'numbers', label: 'Contact Numbers', icon: Phone, description: 'Customer service and contact information' },
    { type: 'complaints', label: 'Complaints', icon: AlertCircle, description: 'Complaint registration and resolution process' },
    { type: 'quickhelp', label: 'Quick Help', icon: HelpCircle, description: 'FAQs and quick solutions' },
    { type: 'video', label: 'Video Guide', icon: PlayCircle, description: 'Video tutorials and guides' }
  ];

  // Helper function to get user-friendly label for tab type
  const getTabLabel = (tabType) => {
    return availableTabTypes.find(t => t.type === tabType)?.label || tabType;
  };

  // Helper function to get tab icon for tab type
  const getTabIcon = (tabType) => {
    return availableTabTypes.find(t => t.type === tabType)?.icon || FileText;
  };

  // Helper function to convert legacy tab type names to new schema
  const convertLegacyTabType = (legacyType) => {
    const legacyMap = {
      'contact-numbers': 'numbers',
      'quick-help': 'quickhelp',
      'video-guide': 'video'
    };
    return legacyMap[legacyType] || legacyType;
  };

  // Helper function to convert new tab type names to legacy API endpoints
  const convertToApiEndpoint = (tabType) => {
    const apiMap = {
      'overview': 'overview',
      'numbers': 'contact-numbers',
      'complaints': 'complaints',
      'quickhelp': 'quick-help',
      'video': 'video-guide'
    };
    return apiMap[tabType] || tabType;
  };

  // Initialize tabs from company data
  useEffect(() => {
    if (companyData) {
      initializeTabs();
    }
  }, [companyData]);

  // Refresh tabs when companyData changes (e.g., after adding new tabs)
  useEffect(() => {
    if (companyData && companyData.tabs) {
      console.log('🔄 Company data changed, refreshing tabs...');
      initializeTabs();
    }
  }, [companyData?.tabs, companyData?.selectedTabs]);

  const initializeTabs = () => {
    if (!companyData) return;

    console.log('🔍 Initializing tabs with company data:', companyData);
    console.log('🔍 Company tabs object:', companyData.tabs);
    console.log('🔍 Company selectedTabs:', companyData.selectedTabs);
    console.log('🔍 Company data keys:', Object.keys(companyData));
    console.log('🔍 Company data type:', typeof companyData);
    console.log('🔍 Is companyData an object?', companyData && typeof companyData === 'object');

    const companyTabs = [];
    
    // Check which tabs exist in the company data
    availableTabTypes.forEach(tabType => {
      const hasTab = companyData.tabs && companyData.tabs[tabType.type];
      const isSelected = companyData.selectedTabs && companyData.selectedTabs.includes(tabType.type);
      
      // Also check for legacy tab type names
      const isLegacySelected = companyData.selectedTabs && companyData.selectedTabs.some(legacyType => 
        convertLegacyTabType(legacyType) === tabType.type
      );
      
      console.log(`🔍 Tab ${tabType.type}:`, {
        hasTab,
        isSelected,
        isLegacySelected,
        tabContent: companyData.tabs?.[tabType.type]
      });
      
      // Check if this tab type should be included
      // Include if: has content (hasTab), is explicitly selected, or was legacy selected
      const shouldInclude = hasTab || isSelected || isLegacySelected;
      
      if (shouldInclude) {
        companyTabs.push({
          type: tabType.type,
          label: tabType.label,
          icon: tabType.icon,
          description: tabType.description,
          content: hasTab ? 'Content exists' : 'No content yet',
          isActive: isSelected || isLegacySelected,
          tabId: hasTab ? companyData.tabs[tabType.type] : null
        });
      }
    });

    // If no tabs were found but companyData.tabs exists, try to detect from the tabs object
    if (companyTabs.length === 0 && companyData.tabs) {
      console.log('🔍 No tabs found in selectedTabs, checking tabs object directly...');
      console.log('🔍 Available tab types:', availableTabTypes.map(t => t.type));
      console.log('🔍 Company tabs keys:', Object.keys(companyData.tabs));
      
      Object.keys(companyData.tabs).forEach(tabKey => {
        console.log(`🔍 Checking tab key: ${tabKey}, value:`, companyData.tabs[tabKey]);
        if (companyData.tabs[tabKey]) { // Only include tabs that have content
          const tabType = availableTabTypes.find(t => t.type === tabKey);
          if (tabType) {
            console.log(`✅ Found tab type: ${tabKey}`);
            companyTabs.push({
              type: tabType.type,
              label: tabType.label,
              icon: tabType.icon,
              description: tabType.description,
              content: 'Content exists',
              isActive: true, // If it has content, consider it active
              tabId: companyData.tabs[tabKey]
            });
          } else {
            console.log(`⚠️ Tab key ${tabKey} not found in availableTabTypes`);
          }
        }
      });
    }

    // Also check if there are any tabs in selectedTabs that we might have missed
    if (companyData.selectedTabs && Array.isArray(companyData.selectedTabs)) {
      companyData.selectedTabs.forEach(selectedTabType => {
        // Check if this tab type is already in our list
        const alreadyExists = companyTabs.some(tab => tab.type === selectedTabType);
        if (!alreadyExists) {
          const tabType = availableTabTypes.find(t => t.type === selectedTabType);
          if (tabType) {
            console.log(`✅ Adding selected tab type: ${selectedTabType}`);
            companyTabs.push({
              type: tabType.type,
              label: tabType.label,
              icon: tabType.icon,
              description: tabType.description,
              content: 'No content yet',
              isActive: true,
              tabId: null
            });
          }
        }
      });
    }

    console.log('✅ Final initialized tabs:', companyTabs);
    setTabs(companyTabs);
  };

  const handleAddTab = async () => {
    if (!newTabData.type || !newTabData.label.trim()) {
      alert('Please select a tab type and enter a label');
      return;
    }

    try {
      setLoading(true);
      
      // Use the helper function to convert tab type to API endpoint
      const apiEndpoint = convertToApiEndpoint(newTabData.type);
      
      console.log('🔍 Creating tab with type:', newTabData.type);
      console.log('🔍 API endpoint:', apiEndpoint);
      console.log('🔍 Company ID:', companyData._id);
      
      // Create the tab content in the backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/tabs/${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabTitle: newTabData.label,
          tabDescription: availableTabTypes.find(t => t.type === newTabData.type)?.description || '',
          content: newTabData.content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create tab');
      }

      const result = await response.json();
      
      // Now link this tab to the company by updating the company's tabs
      console.log('🔗 Linking tab to company...');
      console.log('🔗 Tab ID:', result.data._id);
      console.log('🔗 Tab type:', newTabData.type);
      
      const linkResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${companyData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedTabs: [...(companyData.selectedTabs || []), newTabData.type],
          tabs: {
            ...companyData.tabs,
            [newTabData.type]: result.data._id
          }
        }),
      });

      if (!linkResponse.ok) {
        const errorData = await linkResponse.json();
        console.error('❌ Failed to link tab to company:', errorData);
        throw new Error(`Failed to link tab to company: ${errorData.message || 'Unknown error'}`);
      }

      const linkResult = await linkResponse.json();
      console.log('✅ Tab linked to company successfully:', linkResult);
      
      // Add the new tab to the company
      const updatedTabs = [...tabs, {
        type: newTabData.type,
        label: newTabData.label,
        icon: availableTabTypes.find(t => t.type === newTabData.type)?.icon || FileText,
        description: availableTabTypes.find(t => t.type === newTabData.type)?.description || '',
        content: newTabData.content || 'New tab created',
        isActive: true,
        tabId: result.data._id
      }];

      setTabs(updatedTabs);
      setShowAddTab(false);
      setNewTabData({ type: 'overview', label: '', content: '' });
      
      // Update the company's selectedTabs and refresh the component
      await updateCompanyTabs(updatedTabs);
      
      // Force a refresh of the tabs to ensure everything is in sync
      setTimeout(() => {
        initializeTabs();
      }, 100);
      
      // Also call onSave to refresh the parent component
      if (onSave) {
        console.log('🔄 Calling onSave to refresh parent component');
        onSave();
      }
      
    } catch (error) {
      console.error('Error adding tab:', error);
      alert('Failed to add tab: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTab = async (tabType) => {
    if (!confirm(`Are you sure you want to remove the ${tabType} tab?`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Remove tab from company's selectedTabs
      const updatedTabs = tabs.filter(tab => tab.type !== tabType);
      setTabs(updatedTabs);
      
      await updateCompanyTabs(updatedTabs);
      
    } catch (error) {
      console.error('Error removing tab:', error);
      alert('Failed to remove tab: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTab = (tabType) => {
    const tab = tabs.find(t => t.type === tabType);
    if (tab) {
      setEditingTab({
        type: tab.type,
        label: tab.label,
        content: tab.content === 'Content exists' ? '' : tab.content,
        tabId: tab.tabId
      });
    }
  };

  const handleSaveTabEdit = async () => {
    if (!editingTab) return;

    try {
      setLoading(true);
      
      // Use the helper function to convert tab type to API endpoint
      const apiEndpoint = convertToApiEndpoint(editingTab.type);
      
      // Update the tab content in the backend
      if (editingTab.tabId) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/tabs/${apiEndpoint}/${editingTab.tabId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tabTitle: editingTab.label,
            content: editingTab.content
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update tab');
        }
      }

      // Update local state
      const updatedTabs = tabs.map(tab => 
        tab.type === editingTab.type 
          ? { ...tab, label: editingTab.label, content: editingTab.content || 'Content updated' }
          : tab
      );
      
      setTabs(updatedTabs);
      setEditingTab(null);
      
      // Update the company's tabs
      await updateCompanyTabs(updatedTabs);
      
    } catch (error) {
      console.error('Error saving tab edit:', error);
      alert('Failed to save tab: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyTabs = async (updatedTabs) => {
    if (!companyData || !companyData._id) return;

    try {
      console.log('🔄 Updating company tabs...');
      console.log('🔄 Current tabs:', updatedTabs);
      
      // Update the company's selectedTabs and tabs
      // Use the internal tab types that match the backend schema
      const selectedTabs = updatedTabs.map(tab => tab.type);

      // Start with existing tab IDs from companyData.tabs
      // This ensures we don't accidentally remove tabs that were already linked
      const currentLinkedTabs = { ...companyData.tabs };

      // Update or add new tab IDs based on updatedTabs
      updatedTabs.forEach(tab => {
        if (tab.tabId) {
          currentLinkedTabs[tab.type] = tab.tabId;
        }
      });

      // For tabs that were removed from `updatedTabs`, explicitly set their reference to null
      const removedTabTypes = availableTabTypes
        .map(type => type.type)
        .filter(type => !updatedTabs.some(tab => tab.type === type));

      removedTabTypes.forEach(type => {
        currentLinkedTabs[type] = null;
      });

      // Debug logging
      console.log('🔄 Current company tabs before update:', companyData.tabs);
      console.log('🔄 Updated tabs to send:', updatedTabs);
      console.log('🔄 Selected tabs array:', selectedTabs);
      console.log('🔄 Final tabs object to send:', currentLinkedTabs);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${companyData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedTabs,
          tabs: currentLinkedTabs // Send the complete, updated linked tabs object
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to update company:', errorData);
        throw new Error(`Failed to update company: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('✅ Backend response:', result);

      // Call the onSave callback to refresh parent component
      if (onSave) {
        console.log('🔄 Calling onSave callback to refresh parent component');
        onSave();
      } else {
        console.log('⚠️ No onSave callback provided');
      }

    } catch (error) {
      console.error('❌ Error updating company tabs:', error);
      throw error;
    }
  };

  const toggleTabVisibility = async (tabType) => {
    const updatedTabs = tabs.map(tab => 
      tab.type === tabType 
        ? { ...tab, isActive: !tab.isActive }
        : tab
    );
    
    setTabs(updatedTabs);
    await updateCompanyTabs(updatedTabs);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Tab Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            {tabs.length} tab{tabs.length !== 1 ? 's' : ''} configured for this company
          </p>
        </div>
        <button
          onClick={() => setShowAddTab(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Tab
        </button>
        
        {/* Test button for debugging */}
        <button
          onClick={async () => {
            console.log('🧪 Testing tab creation...');
            console.log('🧪 Company data:', companyData);
            console.log('🧪 Current tabs:', tabs);
            console.log('🧪 Available tab types:', availableTabTypes);
            
            // Test creating a complaints tab
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/tabs/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tabTitle: 'Test Complaints Tab',
                  tabDescription: 'Test tab for debugging'
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                console.log('✅ Test tab created:', result);
                
                // Test linking it to company
                const linkResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${companyData._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    selectedTabs: [...(companyData.selectedTabs || []), 'complaints'],
                    tabs: {
                      ...companyData.tabs,
                      complaints: result.data._id
                    }
                  })
                });
                
                if (linkResponse.ok) {
                  const linkResult = await linkResponse.json();
                  console.log('✅ Test tab linked:', linkResult);
                  alert('Test tab created and linked successfully! Check console for details.');
                } else {
                  const errorData = await linkResponse.json();
                  console.error('❌ Failed to link test tab:', errorData);
                  alert('Failed to link test tab: ' + errorData.message);
                }
              } else {
                const errorData = await response.json();
                console.error('❌ Failed to create test tab:', errorData);
                alert('Failed to create test tab: ' + errorData.message);
              }
            } catch (error) {
              console.error('❌ Test failed:', error);
              alert('Test failed: ' + error.message);
            }
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          🧪 Test Tab Creation
        </button>
      </div>

      {/* Add Tab Modal */}
      {showAddTab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Add New Tab</h4>
              <button
                onClick={() => setShowAddTab(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tab Type
                </label>
                <select
                  value={newTabData.type}
                  onChange={(e) => setNewTabData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableTabTypes.map(tabType => (
                    <option key={tabType.type} value={tabType.type}>
                      {tabType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tab Label
                </label>
                <input
                  type="text"
                  value={newTabData.label}
                  onChange={(e) => setNewTabData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter tab label"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Content
                </label>
                <TinyMCEEditor
                  value={newTabData.content}
                  onChange={(content) => setNewTabData(prev => ({ ...prev, content }))}
                  placeholder="Enter initial content for this tab..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddTab}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Tab'}
                </button>
                <button
                  onClick={() => setShowAddTab(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tab Modal */}
      {editingTab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Edit {editingTab.type} Tab</h4>
              <button
                onClick={() => setEditingTab(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tab Label
                </label>
                <input
                  type="text"
                  value={editingTab.label}
                  onChange={(e) => setEditingTab(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tab Content
                </label>
                <TinyMCEEditor
                  value={editingTab.content}
                  onChange={(content) => setEditingTab(prev => ({ ...prev, content }))}
                  placeholder="Enter content for this tab..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveTabEdit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingTab(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs List */}
      <div className="space-y-4">
        {tabs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tabs configured for this company</p>
            <p className="text-sm">Click "Add Tab" to get started</p>
          </div>
        ) : (
          tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <div
                key={tab.type}
                className={`border rounded-lg p-4 transition-all ${
                  tab.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${
                      tab.isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{tab.label}</h4>
                      <p className="text-sm text-gray-500">{tab.description}</p>
                      <p className="text-xs text-gray-400">
                        Content: {tab.content === 'Content exists' ? '✅ Available' : tab.content || 'No content'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTabVisibility(tab.type)}
                      className={`p-2 rounded-lg transition-colors ${
                        tab.isActive 
                          ? 'text-blue-600 hover:bg-blue-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={tab.isActive ? 'Hide tab' : 'Show tab'}
                    >
                      {tab.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleEditTab(tab.type)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit tab"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleRemoveTab(tab.type)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove tab"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status */}
      {loading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTabManager;

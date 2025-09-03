import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { useTabManagement } from '../../contexts/TabManagementContext';

const EditableTabManager = ({ 
  tabs: propTabs = [], 
  onTabsChange, 
  isAdminMode = false,
  className = '',
  useContext = true
}) => {
  const contextAPI = useContext ? useTabManagement() : null;
  const tabs = useContext && contextAPI ? contextAPI.tabs : propTabs;
  
  const [editingTab, setEditingTab] = useState(null);
  const [newTabName, setNewTabName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  
  const dragRef = useRef(null);

  const handleAddTab = async () => {
    if (!newTabName.trim()) return;

    try {
      const newTab = {
        label: newTabName.trim(),
        name: newTabName.trim().toLowerCase().replace(/\s+/g, '-'),
        icon: 'FileText',
        content: '',
        order: tabs.length
      };

      if (useContext && contextAPI) {
        await contextAPI.addTab(newTab, 'editable-tab-manager');
      } else {
        const updatedTabs = [...tabs, { ...newTab, id: `tab-${Date.now()}` }];
        onTabsChange?.(updatedTabs);
      }

      setNewTabName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tab:', error);
      alert('Error adding tab: ' + error.message);
    }
  };

  const handleDeleteTab = async (tabId) => {
    if (!window.confirm('Are you sure you want to delete this tab?')) return;

    try {
      if (useContext && contextAPI) {
        await contextAPI.deleteTab(tabId, 'editable-tab-manager');
      } else {
        const updatedTabs = tabs.filter(tab => tab.id !== tabId);
        onTabsChange?.(updatedTabs);
      }
    } catch (error) {
      console.error('Error deleting tab:', error);
      alert('Error deleting tab: ' + error.message);
    }
  };

  const handleEditTab = async (tabId, updates) => {
    try {
      if (useContext && contextAPI) {
        await contextAPI.updateTab(tabId, updates, 'editable-tab-manager');
      } else {
        const updatedTabs = tabs.map(tab => 
          tab.id === tabId ? { ...tab, ...updates } : tab
        );
        onTabsChange?.(updatedTabs);
      }
      setEditingTab(null);
    } catch (error) {
      console.error('Error updating tab:', error);
      alert('Error updating tab: ' + error.message);
    }
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    try {
      if (useContext && contextAPI) {
        await contextAPI.reorderTabs(dragIndex, dropIndex, 'editable-tab-manager');
      } else {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(dragIndex, 1);
        newTabs.splice(dropIndex, 0, movedTab);
        onTabsChange?.(newTabs);
      }
    } catch (error) {
      console.error('Error reordering tabs:', error);
      alert('Error reordering tabs: ' + error.message);
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      FileText: '📄',
      Phone: '📞',
      Settings: '⚙️',
      HelpCircle: '❓',
      PlayCircle: '▶️',
      BarChart: '📊',
      Building2: '🏢',
      Mail: '📧',
      Globe: '🌐',
      Star: '⭐',
      Heart: '❤️',
      CheckCircle: '✅',
      AlertCircle: '⚠️',
      Info: 'ℹ️'
    };
    return iconMap[iconName] || '📄';
  };

  const availableIcons = [
    'FileText', 'Phone', 'Settings', 'HelpCircle', 'PlayCircle', 
    'BarChart', 'Building2', 'Mail', 'Globe', 'Star', 'Heart', 
    'CheckCircle', 'AlertCircle', 'Info'
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tab Manager</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Tab
          </button>
        </div>
      </div>

      {/* Add Tab Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tab Name
              </label>
              <input
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Enter tab name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddTab}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Add Tab
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTabName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs List */}
      <div className="p-4">
        {tabs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No tabs available</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Tab" to create your first tab</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`group relative flex items-center gap-3 p-3 border rounded-lg transition-all ${
                  dragIndex === index ? 'opacity-50 bg-blue-50 border-blue-200' : ''
                } ${
                  dragOverIndex === index ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                } hover:border-gray-300 hover:bg-gray-50`}
                draggable={isAdminMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Drag Handle */}
                {isAdminMode && (
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}

                {/* Tab Icon */}
                <div className="text-lg">
                  {getIconComponent(tab.icon)}
                </div>

                {/* Tab Info */}
                <div className="flex-1 min-w-0">
                  {editingTab === tab.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingTab.label || tab.label}
                        onChange={(e) => setEditingTab({ ...editingTab, label: e.target.value })}
                        className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={editingTab.icon || tab.icon}
                          onChange={(e) => setEditingTab({ ...editingTab, icon: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>
                              {getIconComponent(icon)} {icon}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleEditTab(tab.id, editingTab)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                          title="Save"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingTab(null)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900 truncate">
                        {tab.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {tab.id} • Order: {tab.order || index}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isAdminMode && editingTab !== tab.id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTab(tab)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTab(tab.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {showPreview && tabs.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Live Preview</h4>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <span className="text-sm">{getIconComponent(tab.icon)}</span>
                <span className="text-sm font-medium text-gray-700">{tab.label}</span>
                {index < tabs.length - 1 && (
                  <span className="text-gray-300">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      {contextAPI && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          {contextAPI.isLoading ? (
            <span className="flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              Syncing with database...
            </span>
          ) : contextAPI.error ? (
            <span className="text-red-600">Error: {contextAPI.error}</span>
          ) : (
            <span className="text-green-600">✓ All changes saved</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableTabManager;

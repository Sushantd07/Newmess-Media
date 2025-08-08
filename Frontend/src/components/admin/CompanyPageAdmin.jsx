import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Building2
} from 'lucide-react';

const CompanyPageAdmin = ({ children, companyData, onSave }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [newTabName, setNewTabName] = useState('');
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // Initialize editing data with current company data
  useEffect(() => {
    if (companyData) {
      setEditingData(JSON.parse(JSON.stringify(companyData)));
    }
  }, [companyData]);

  const handleEditField = (field, value) => {
    setEditingField(field);
    setTempValue(value);
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

  const handleTabEdit = (tabId, newName) => {
    setEditingData(prev => ({
      ...prev,
      tabs: prev.tabs?.map(tab => 
        tab.id === tabId ? { ...tab, label: newName } : tab
      ) || []
    }));
    setEditingTab(null);
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newTab = {
        id: `tab-${Date.now()}`,
        label: newTabName.trim(),
        icon: FileText,
        content: ''
      };
      setEditingData(prev => ({
        ...prev,
        tabs: [...(prev.tabs || []), newTab]
      }));
      setNewTabName('');
      setShowAddTabModal(false);
    }
  };

  const handleDeleteTab = (tabId) => {
    setEditingData(prev => ({
      ...prev,
      tabs: prev.tabs?.filter(tab => tab.id !== tabId) || []
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await onSave(editingData);
      setShowSaveModal(false);
      // Show success message
    } catch (error) {
      console.error('Error saving changes:', error);
      // Show error message
    }
  };

  const EditableField = ({ field, value, label, type = 'text', className = '' }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`${className}`}>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm"
              autoFocus
            />
            <button
              onClick={handleSaveField}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span className="flex-1">{value || 'Not set'}</span>
            {isAdminMode && (
              <button
                onClick={() => handleEditField(field, value)}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const EditableTab = ({ tab, isActive }) => {
    const isEditing = editingTab === tab.id;
    
    return (
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              className="px-2 py-1 border border-blue-300 rounded text-sm"
              autoFocus
            />
            <button
              onClick={() => handleTabEdit(tab.id, newTabName)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setEditingTab(null)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </span>
            {isAdminMode && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingTab(tab.id);
                    setNewTabName(tab.label);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDeleteTab(tab.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Admin Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
              isAdminMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isAdminMode ? <EyeOff className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
            {isAdminMode ? 'Admin Mode' : 'Admin Mode'}
          </button>
          
          {isAdminMode && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          )}
        </div>
      </div>

      {/* Admin Overlay */}
      {isAdminMode && (
        <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none">
          <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 pointer-events-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Admin Controls</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-600">
                <strong>Company Name:</strong>
                <EditableField 
                  field="name" 
                  value={editingData.name} 
                  className="mt-1"
                />
              </div>
              <div className="text-gray-600">
                <strong>Description:</strong>
                <EditableField 
                  field="description" 
                  value={editingData.description} 
                  type="textarea"
                  className="mt-1"
                />
              </div>
              <div className="text-gray-600">
                <strong>Founded:</strong>
                <EditableField 
                  field="founded" 
                  value={editingData.founded} 
                  className="mt-1"
                />
              </div>
              <div className="text-gray-600">
                <strong>Headquarters:</strong>
                <EditableField 
                  field="headquarters" 
                  value={editingData.headquarters} 
                  className="mt-1"
                />
              </div>
              <div className="text-gray-600">
                <strong>Rating:</strong>
                <EditableField 
                  field="rating" 
                  value={editingData.rating} 
                  type="number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modified Company Page Content */}
      <div className={isAdminMode ? 'pointer-events-none' : ''}>
        {children}
      </div>

      {/* Save Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Changes
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save all changes? This will update the company information.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tab Modal */}
      {showAddTabModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Tab
            </h3>
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Enter tab name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddTab}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Add Tab
              </button>
              <button
                onClick={() => setShowAddTabModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPageAdmin; 
import React, { useState, useEffect } from 'react';
import { Plus, Save, X, AlertCircle, GripVertical } from 'lucide-react';
import EditableCard from './EditableCard';
import EditableTable from './EditableTable';

const DynamicComponents = ({ 
  isAdminMode, 
  onSave, 
  companySlug 
}) => {
  const [components, setComponents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Debug logging - moved after state initialization
  console.log('DynamicComponents Debug:', {
    isAdminMode,
    companySlug,
    componentsCount: components?.length || 0
  });

  // Load components from server on mount
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const response = await fetch(`/api/company-pages/${companySlug}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.dynamicComponents) {
            setComponents(result.data.dynamicComponents);
          }
        }
      } catch (error) {
        console.error('Error loading components from server:', error);
        // Fallback to localStorage
        const savedComponents = localStorage.getItem(`dynamic-components-${companySlug}`);
        if (savedComponents) {
          try {
            setComponents(JSON.parse(savedComponents));
          } catch (localError) {
            console.error('Error loading saved components:', localError);
          }
        }
      }
    };

    if (companySlug) {
      loadComponents();
    }
  }, [companySlug]);

  // Save components to localStorage whenever they change
  useEffect(() => {
    if (components.length > 0) {
      localStorage.setItem(`dynamic-components-${companySlug}`, JSON.stringify(components));
    }
  }, [components, companySlug]);

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type,
      data: type === 'card' ? {
        title: 'New Card',
        content: 'Add your content here...',
        icon: '📱',
        color: 'blue',
        subtitle: ''
      } : {
        title: 'New Table',
        headers: ['Service', 'Number'],
        rows: [['', '']],
        color: 'blue'
      }
    };

    setComponents(prev => [...prev, newComponent]);
    setShowAddModal(false);
  };

  const updateComponent = (index, newData) => {
    setComponents(prev => prev.map((comp, i) => 
      i === index ? { ...comp, data: newData } : comp
    ));
  };

  const deleteComponent = (index) => {
    setComponents(prev => prev.filter((_, i) => i !== index));
  };

  const moveComponent = (index, direction) => {
    if (direction === 'up' && index > 0) {
      setComponents(prev => {
        const newComponents = [...prev];
        [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
        return newComponents;
      });
    } else if (direction === 'down' && index < components.length - 1) {
      setComponents(prev => {
        const newComponents = [...prev];
        [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
        return newComponents;
      });
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      setComponents(prev => {
        const newComponents = [...prev];
        const draggedComponent = newComponents[draggedIndex];
        newComponents.splice(draggedIndex, 1);
        newComponents.splice(dropIndex, 0, draggedComponent);
        return newComponents;
      });
    }
    setDraggedIndex(null);
  };

  const handleSaveToServer = async () => {
    try {
      // Use proper API base URL like other services
      const API_BASE_URL = 
        ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
        (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
        '/api');
      
      const response = await fetch(`${API_BASE_URL}/company-pages/save-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companySlug,
          components
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save components');
      }

      const result = await response.json();
      if (result.success) {
        alert('Components saved successfully!');
        setShowSaveModal(false);
        // Also save to localStorage as backup
        localStorage.setItem(`dynamic-components-${companySlug}`, JSON.stringify(components));
      } else {
        throw new Error(result.message || 'Failed to save components');
      }
    } catch (error) {
      console.error('Error saving components:', error);
      alert(`Error saving components: ${error.message}`);
    }
  };

  // Debug: Always show the section in admin mode, even if empty
  if (!isAdminMode && components.length === 0) {
    return null;
  }

  // Debug: Show a placeholder when no components exist
  if (isAdminMode && components.length === 0) {
    return (
      <div className="space-y-6">
        {/* Admin Controls */}
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-blue-900">Dynamic Components</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Component
            </button>
          </div>
          <div className="text-sm text-gray-600">No components yet</div>
        </div>
        
        {/* Empty State */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <div className="text-gray-400 mb-2">📱</div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Dynamic Components</h4>
          <p className="text-gray-500 mb-4">Click "Add Component" to create your first card or table</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Component
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      {isAdminMode && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-blue-900">Dynamic Components</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Component
            </button>
          </div>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      )}

      {/* Components List */}
      <div className="space-y-4">
        {components.map((component, index) => (
          <div
            key={component.id}
            draggable={isAdminMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative ${draggedIndex === index ? 'opacity-50' : ''} ${
              isAdminMode ? 'cursor-move' : ''
            }`}
          >
            {/* Drag Handle */}
            {isAdminMode && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10">
                <div className="bg-gray-200 rounded-full p-1 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            )}

            {/* Component */}
            <div className={isAdminMode ? 'ml-6' : ''}>
              {component.type === 'card' ? (
                <EditableCard
                  card={component.data}
                  onUpdate={(_, newData) => updateComponent(index, newData)}
                  onDelete={() => deleteComponent(index)}
                  onMove={(_, direction) => moveComponent(index, direction)}
                  isAdminMode={isAdminMode}
                  index={index}
                />
              ) : (
                <EditableTable
                  table={component.data}
                  onUpdate={(_, newData) => updateComponent(index, newData)}
                  onDelete={() => deleteComponent(index)}
                  onMove={(_, direction) => moveComponent(index, direction)}
                  isAdminMode={isAdminMode}
                  index={index}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Component</h3>
            <div className="space-y-3">
              <button
                onClick={() => addComponent('card')}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Card</div>
                  <div className="text-sm text-gray-600">Add a new information card</div>
                </div>
              </button>
              <button
                onClick={() => addComponent('table')}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Table</div>
                  <div className="text-sm text-gray-600">Add a new data table</div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Save Changes?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Do you want to save all changes to the server? This will update the page content permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveToServer}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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

export default DynamicComponents;
import React, { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';

const TabSelector = ({ 
  selectedTabs = [], 
  onTabsChange, 
  isRequired = false 
}) => {
  const [availableTabs, setAvailableTabs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default system tabs - using backend enum values
  const defaultTabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart', type: 'system', order: 1 },
    { id: 'numbers', label: 'Contact Numbers', icon: 'Phone', type: 'system', order: 2 },
    { id: 'complaints', label: 'Complaint Redressal Process', icon: 'FileText', type: 'system', order: 3 },
    { id: 'quickhelp', label: 'Quick Help', icon: 'HelpCircle', type: 'system', order: 4 },
    { id: 'video', label: 'Video Guide', icon: 'PlayCircle', type: 'system', order: 5 }
  ];

  useEffect(() => {
    // For now, use default tabs. Later we can fetch from API
    setAvailableTabs(defaultTabs);
  }, []);

  const handleTabToggle = (tabId) => {
    const isSelected = selectedTabs.includes(tabId);
    
    if (isSelected) {
      // Remove tab
      const newSelectedTabs = selectedTabs.filter(id => id !== tabId);
      onTabsChange(newSelectedTabs);
    } else {
      // Add tab
      const newSelectedTabs = [...selectedTabs, tabId];
      onTabsChange(newSelectedTabs);
    }
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Select Tabs {isRequired && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-gray-500">
          {selectedTabs.length} of {availableTabs.length} selected
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading tabs...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTabs.map((tab) => {
            const isSelected = selectedTabs.includes(tab.id);
            
            return (
              <div
                key={tab.id}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTabToggle(tab.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {getIconComponent(tab.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {tab.label}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {tab.type === 'system' ? 'System Tab' : 'Custom Tab'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isSelected ? (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                {/* Order indicator */}
                <div className="absolute top-2 right-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                    {tab.order}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tab Selection Guide:</p>
            <ul className="text-xs space-y-1">
              <li>• <strong>Overview:</strong> Company information and general details</li>
              <li>• <strong>Contact Numbers:</strong> Phone numbers and contact information</li>
              <li>• <strong>Complaint Process:</strong> How to file complaints and grievance redressal</li>
              <li>• <strong>Quick Help:</strong> FAQs and common questions</li>
              <li>• <strong>Video Guide:</strong> Tutorial videos and guides</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Selected tabs summary */}
      {selectedTabs.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-800 mb-2">Selected Tabs:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTabs.map((tabId) => {
              const tab = availableTabs.find(t => t.id === tabId);
              return tab ? (
                <div
                  key={tabId}
                  className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
                >
                  <span>{getIconComponent(tab.icon)}</span>
                  <span>{tab.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabToggle(tabId);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSelector;



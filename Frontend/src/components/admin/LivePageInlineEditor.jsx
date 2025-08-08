import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  X, 
  Copy, 
  Phone, 
  PhoneCall,
  AlertCircle,
  CreditCard,
  Shield,
  Edit3,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Move,
  MessageSquare
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const LivePageInlineEditor = ({ 
  contactData, 
  onSave, 
  onCancel, 
  isVisible = false 
}) => {
  const [editingData, setEditingData] = useState(contactData || {});
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [componentOrder, setComponentOrder] = useState([]);
  const [copiedNumber, setCopiedNumber] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('LivePageInlineEditor: contactData received:', contactData);
    console.log('LivePageInlineEditor: contactData type:', typeof contactData);
    console.log('LivePageInlineEditor: contactData keys:', contactData ? Object.keys(contactData) : 'NULL');
    
    if (contactData && typeof contactData === 'object' && Object.keys(contactData).length > 0) {
      setEditingData(contactData);
      // Filter out non-object properties and system fields
      const order = Object.keys(contactData).filter(key => {
        const value = contactData[key];
        const isValidComponent = value && 
               typeof value === 'object' && 
               !['_id', '__v', 'createdAt', 'updatedAt', 'tabTitle', 'tabDescription'].includes(key);
        
        if (isValidComponent) {
          console.log(`Component ${key}:`, {
            hasHeading: !!value.heading,
            hasCards: !!value.cards,
            hasItems: !!value.items,
            hasTable: !!value.table,
            hasServices: !!value.services,
            hasLinks: !!value.links,
            hasPhoneNumbers: !!value.phoneNumbers,
            hasDescription: !!value.description,
            keys: Object.keys(value)
          });
        }
        
        return isValidComponent && (
          value.heading || 
          value.cards || 
          value.items || 
          value.table || 
          value.services || 
          value.links || 
          value.phoneNumbers || 
          value.description ||
          value.phoneNumber ||
          value.service ||
          value.type
        );
      });
      console.log('LivePageInlineEditor: component order:', order);
      console.log('LivePageInlineEditor: filtered components:', order.map(key => ({
        key,
        hasHeading: !!contactData[key]?.heading,
        hasCards: !!contactData[key]?.cards,
        hasItems: !!contactData[key]?.items,
        hasTable: !!contactData[key]?.table,
        hasServices: !!contactData[key]?.services,
        hasLinks: !!contactData[key]?.links,
        hasPhoneNumbers: !!contactData[key]?.phoneNumbers,
        hasDescription: !!contactData[key]?.description
      })));
      setComponentOrder(order);
    } else {
      console.log('Contact data is null, invalid, or empty:', contactData);
      setEditingData({});
      setComponentOrder([]);
    }
  }, [contactData]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(""), 2000);
  };

  const startEditing = (path, value) => {
    if (isPreviewMode) return;
    console.log('Starting edit for path:', path, 'value:', value);
    setEditingField(path);
    setEditValue(value || '');
  };

  const saveEdit = () => {
    if (!editingField) return;
    
    const newData = { ...editingData };
    const pathParts = editingField.split('.');
    let current = newData;
    
    // Navigate to the nested property
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    // Set the value
    current[pathParts[pathParts.length - 1]] = editValue;
    
    setEditingData(newData);
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleClickOutside = (e) => {
    if (editingField && !e.target.closest('.inline-editor')) {
      saveEdit();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingField]);

  const renderEditableText = (path, text, className = "", placeholder = "Click to edit") => {
    if (editingField === path) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveEdit}
          className={`inline-editor ${className} bg-yellow-100 border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
        />
      );
    }
    
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          startEditing(path, text);
        }}
        className={`inline-editor cursor-pointer hover:bg-yellow-50 hover:border hover:border-dashed hover:border-gray-300 rounded px-1 py-0.5 transition-all border border-transparent ${className}`}
        title="Click to edit"
        style={{ userSelect: 'none' }}
      >
        {text || placeholder}
      </span>
    );
  };

  const renderEditableCard = (card, cardIndex, sectionId) => {
    const colors = [
      { cardBg: 'bg-blue-50', iconBg: 'bg-blue-100', textColor: 'text-blue-700' },
      { cardBg: 'bg-green-50', iconBg: 'bg-green-100', textColor: 'text-green-700' },
      { cardBg: 'bg-purple-50', iconBg: 'bg-purple-100', textColor: 'text-purple-700' },
      { cardBg: 'bg-orange-50', iconBg: 'bg-orange-100', textColor: 'text-orange-700' },
      { cardBg: 'bg-red-50', iconBg: 'bg-red-100', textColor: 'text-red-700' }
    ];
    const color = colors[cardIndex % colors.length];
    const icons = [PhoneCall, AlertCircle, CreditCard, Shield];
    const Icon = icons[cardIndex % icons.length];

    return (
      <motion.div
        key={cardIndex}
        layout
        className={`p-4 rounded-xl shadow hover:shadow-md transition ${color.cardBg} group relative`}
        onClick={() => setSelectedComponent(`${sectionId}.cards.${cardIndex}`)}
      >
        {/* Edit Controls */}
        {!isPreviewMode && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
              <button
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Move"
              >
                <Move className="h-3 w-3" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-3 ${color.iconBg}`}>
          <Icon className="w-6 h-6" style={{ color: color.textColor }} />
        </div>
        
        <h4 className="text-sm font-semibold text-gray-800">
          {renderEditableText(`${sectionId}.cards.${cardIndex}.title`, card.title, "font-semibold")}
        </h4>
        
        <div className="flex items-center gap-2 mt-1">
          <p className={`text-lg font-extrabold ${color.textColor}`}>
            {renderEditableText(`${sectionId}.cards.${cardIndex}.number`, card.number, "font-extrabold")}
          </p>
          <button
            onClick={() => copyToClipboard(card.number)}
            title="Copy Number"
            className="hover:text-blue-500"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          {renderEditableText(`${sectionId}.cards.${cardIndex}.subtitle`, card.subtitle, "text-gray-600")}
        </p>
      </motion.div>
    );
  };

  const renderEditableTable = (table, sectionId) => {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
            {table.headers?.map((header, idx) => (
              <th key={idx} className="py-2 px-3">
                {renderEditableText(`${sectionId}.table.headers.${idx}`, header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows?.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-50" : ""}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="py-3 px-3">
                  {renderEditableText(`${sectionId}.table.rows.${rowIdx}.${cellIdx}`, cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderComponent = (componentId) => {
    const component = editingData[componentId];
    if (!component) {
      console.log(`Component ${componentId} not found in editingData:`, editingData);
      return null;
    }

    return (
      <motion.div
        key={componentId}
        layout
        className="bg-white rounded-xl shadow p-6 relative group"
        onClick={() => setSelectedComponent(componentId)}
      >
        {/* Component Controls */}
        {!isPreviewMode && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
              <button
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Move"
              >
                <Move className="h-3 w-3" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                title="Add Component"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Component Content */}
        {componentId === 'topContactCards' && component.cards && (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {component.cards.map((card, idx) => 
                renderEditableCard(card, idx, componentId)
              )}
            </div>
          </>
        )}

        {componentId === 'helplineNumbersSection' && component.table && (
          <>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-blue-600" /> 
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            {renderEditableTable(component.table, componentId)}
          </>
        )}

        {componentId === 'allIndiaNumbersSection' && component.table && (
          <>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-600" /> 
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            {renderEditableTable(component.table, componentId)}
          </>
        )}

        {componentId === 'nationalNumbersSection' && component.table && (
          <>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-blue-600" /> 
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            {renderEditableTable(component.table, componentId)}
          </>
        )}

        {componentId === 'missedCallServiceSection' && component.table && (
          <>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-orange-600" /> 
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            {renderEditableTable(component.table, componentId)}
          </>
        )}

        {componentId === 'smsServicesSection' && component.services && (
          <>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-600" /> 
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            <div className="space-y-3">
              {component.services.map((service, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {renderEditableText(`${componentId}.services.${idx}.service`, service.service, "font-medium text-gray-900")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {renderEditableText(`${componentId}.services.${idx}.number`, service.number, "text-sm text-gray-600")}
                      </p>
                      {service.description && (
                        <p className="text-xs text-gray-500">
                          {renderEditableText(`${componentId}.services.${idx}.description`, service.description, "text-xs text-gray-500")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(service.number)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Generic component renderer */}
        {!['topContactCards', 'helplineNumbersSection', 'allIndiaNumbersSection'].includes(componentId) && (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            <div className="text-gray-600">
              {component.table ? (
                renderEditableTable(component.table, componentId)
              ) : component.items ? (
                <div className="space-y-3">
                  {component.items.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {renderEditableText(`${componentId}.items.${idx}.type`, item.type, "font-medium text-gray-900")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {renderEditableText(`${componentId}.items.${idx}.number`, item.number, "text-sm text-gray-600")}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500">
                              {renderEditableText(`${componentId}.items.${idx}.description`, item.description, "text-xs text-gray-500")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.number)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : component.services ? (
                <div className="space-y-3">
                  {component.services.map((service, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {renderEditableText(`${componentId}.services.${idx}.service`, service.service, "font-medium text-gray-900")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {renderEditableText(`${componentId}.services.${idx}.number`, service.number, "text-sm text-gray-600")}
                          </p>
                          {service.description && (
                            <p className="text-xs text-gray-500">
                              {renderEditableText(`${componentId}.services.${idx}.description`, service.description, "text-xs text-gray-500")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(service.number)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : component.phoneNumbers ? (
                <div className="space-y-3">
                  {component.phoneNumbers.map((phone, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {renderEditableText(`${componentId}.phoneNumbers.${idx}.type`, phone.type, "font-medium text-gray-900")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {renderEditableText(`${componentId}.phoneNumbers.${idx}.number`, phone.number, "text-sm text-gray-600")}
                          </p>
                          {phone.description && (
                            <p className="text-xs text-gray-500">
                              {renderEditableText(`${componentId}.phoneNumbers.${idx}.description`, phone.description, "text-xs text-gray-500")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(phone.number)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : component.description ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">
                    {renderEditableText(`${componentId}.description`, component.description, "text-gray-600")}
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500">No editable content found for this component.</p>
                  <p className="text-xs text-gray-400 mt-2">Available keys: {Object.keys(component).join(', ')}</p>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    );
  };

  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      console.log('Saving edited data:', editingData);
      await onSave(editingData);
      console.log('Data saved successfully');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (!isVisible) return null;

  // Error handling for missing data
  if (!editingData || Object.keys(editingData).length === 0) {
    return (
      <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">No Contact Data Available</h3>
          <p className="text-gray-600 mb-4">
            Contact data is not available for editing. Please ensure the contact numbers tab is loaded properly.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p className="font-semibold">Debug Info:</p>
            <p>• Contact Data: {contactData ? 'Available' : 'NULL'}</p>
            <p>• Data Type: {typeof contactData}</p>
            <p>• Keys: {contactData ? Object.keys(contactData).join(', ') : 'None'}</p>
            <p>• Component Order: {componentOrder.join(', ')}</p>
            <p>• Editing Data Keys: {Object.keys(editingData).join(', ')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Editor Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none">
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-xl border border-gray-200 p-3">
            <div className="text-sm text-gray-600 font-medium">
              Live Editor
            </div>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isPreviewMode 
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md'
              }`}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-md ${
                saveStatus === 'saving' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : saveStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Error
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
              Exit Editor
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isPreviewMode && (
        <div className="fixed top-20 left-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm shadow-lg">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Live Page Editing
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Click any text</strong> to edit it inline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Press Enter</strong> to save changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Press Escape</strong> to cancel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Drag components</strong> to reorder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Hover for controls</strong> to move/delete</span>
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              💡 Tip: Start by editing the contact numbers and headings
            </p>
          </div>
        </div>
      )}

      {/* Live Page Content */}
      <div className="relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Debug Info */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Editor Debug Info:</h3>
            <p className="text-sm text-yellow-700">Component Order: {componentOrder.join(', ') || 'Empty'}</p>
            <p className="text-sm text-yellow-700">Total Components: {componentOrder.length}</p>
            <p className="text-sm text-yellow-700">Editing Data Keys: {Object.keys(editingData).join(', ')}</p>
          </div>
          
          <div className="space-y-6">
            {componentOrder.length > 0 ? (
              <Reorder.Group 
                axis="y" 
                values={componentOrder} 
                onReorder={setComponentOrder}
                className="space-y-6"
              >
                {componentOrder.map((componentId) => (
                  <Reorder.Item key={componentId} value={componentId}>
                    {renderComponent(componentId)}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No components found to edit.</p>
                <p className="text-sm text-gray-400 mt-2">Available data keys: {Object.keys(editingData).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast for copied number */}
      {copiedNumber && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Copied: {copiedNumber}
        </div>
      )}
    </>
  );
};

export default LivePageInlineEditor; 
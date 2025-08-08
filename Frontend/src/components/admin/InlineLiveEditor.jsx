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
  EyeOff
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const InlineLiveEditor = ({ 
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (contactData) {
      setEditingData(contactData);
      const order = Object.keys(contactData).filter(key => 
        contactData[key] && typeof contactData[key] === 'object'
      );
      setComponentOrder(order);
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
        onClick={() => startEditing(path, text)}
        className={`inline-editor cursor-pointer hover:bg-yellow-50 hover:border hover:border-dashed hover:border-gray-300 rounded px-1 py-0.5 transition-all ${className}`}
        title="Click to edit"
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
      >
        {/* Edit Controls */}
        {!isPreviewMode && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
              <button
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Move"
              >
                <GripVertical className="h-3 w-3" />
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
    if (!component) return null;

    return (
      <motion.div
        key={componentId}
        layout
        className="bg-white rounded-xl shadow p-6 relative group"
      >
        {/* Component Controls */}
        {!isPreviewMode && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
              <button
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Move"
              >
                <GripVertical className="h-3 w-3" />
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

        {/* Generic component renderer */}
        {!['topContactCards', 'helplineNumbersSection', 'allIndiaNumbersSection'].includes(componentId) && (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {renderEditableText(`${componentId}.heading.text`, component.heading?.text, "text-xl font-bold")}
            </h3>
            <div className="text-gray-600">
              {component.table ? (
                renderEditableTable(component.table, componentId)
              ) : (
                <p>{renderEditableText(`${componentId}.content`, component.content, "text-gray-600")}</p>
              )}
            </div>
          </>
        )}
      </motion.div>
    );
  };

  const handleSave = async () => {
    try {
      await onSave(editingData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Editor Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none">
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                isPreviewMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isPreviewMode && (
        <div className="fixed top-20 left-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
          <h4 className="font-semibold text-blue-900 mb-2">How to Edit:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Click any text</strong> to edit it inline</li>
            <li>• <strong>Press Enter</strong> to save changes</li>
            <li>• <strong>Press Escape</strong> to cancel</li>
            <li>• <strong>Click outside</strong> to save</li>
          </ul>
        </div>
      )}

      {/* Live Page Content */}
      <div className="relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
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

export default InlineLiveEditor; 
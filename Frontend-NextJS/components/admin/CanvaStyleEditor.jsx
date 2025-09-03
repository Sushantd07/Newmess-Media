import React, { useState, useEffect, useRef } from 'react';
import { 
  Move, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Copy, 
  Phone, 
  PhoneCall,
  AlertCircle,
  CreditCard,
  Shield,
  MessageSquare, 
  Users, 
  MapPin,
  Settings,
  Eye,
  EyeOff,
  Grid3X3,
  Layout,
  Type,
  Table,
  List
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const icons = [PhoneCall, AlertCircle, CreditCard, Shield];

const CanvaStyleEditor = ({ 
  contactData, 
  onSave, 
  onCancel, 
  isVisible = false 
}) => {
  const [editingData, setEditingData] = useState(contactData || {});
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [componentMenuPosition, setComponentMenuPosition] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState("");

  // Component order state - dynamically generated from contactData
  const [componentOrder, setComponentOrder] = useState([]);

  useEffect(() => {
    if (contactData) {
      setEditingData(contactData);
      // Generate component order from actual data
      const order = Object.keys(contactData).filter(key => 
        contactData[key] && typeof contactData[key] === 'object'
      );
      setComponentOrder(order);
    }
  }, [contactData]);

  useEffect(() => {
    if (contactData) {
      setEditingData(contactData);
    }
  }, [contactData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(""), 2000);
  };

  const handleComponentClick = (e, componentId) => {
    e.stopPropagation();
    if (previewMode) return;
    
    setSelectedComponent(componentId);
    setShowComponentMenu(true);
    setComponentMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleComponentMenuAction = (action) => {
    switch (action) {
      case 'edit':
        // Open detailed editor for the component
        break;
      case 'delete':
        // Remove component from data
        const newData = { ...editingData };
        delete newData[selectedComponent];
        setEditingData(newData);
        break;
      case 'duplicate':
        // Duplicate component
        break;
      default:
        break;
    }
    setShowComponentMenu(false);
    setSelectedComponent(null);
  };

  const handleSave = async () => {
    try {
      await onSave(editingData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addNewComponent = (componentType) => {
    const newData = { ...editingData };
    const newId = `${componentType}_${Date.now()}`;
    
    switch (componentType) {
      case 'heading':
        newData[newId] = {
          type: 'heading',
          heading: { key: '', text: 'New Heading', subText: '' }
        };
        break;
      case 'table':
        newData[newId] = {
          type: 'table',
          heading: { key: '', text: 'New Table', subText: '' },
          table: {
            headers: ['Column 1', 'Column 2'],
            rows: [['Data 1', 'Data 2']]
          }
        };
        break;
      case 'cards':
        newData[newId] = {
          type: 'cards',
          heading: { key: '', text: 'New Cards', subText: '' },
          cards: [
            { title: 'Card 1', number: '123-456-7890', subtitle: 'Description' }
          ]
        };
        break;
      default:
        break;
    }
    
    setEditingData(newData);
    setComponentOrder([...componentOrder, newId]);
  };

  const renderComponent = (componentId) => {
    const component = editingData[componentId];
    if (!component) return null;

    const isSelected = selectedComponent === componentId;
    const isPreview = previewMode;

    const componentWrapper = (children) => (
      <motion.div
        key={componentId}
        layout
        className={`relative group ${isSelected && !isPreview ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${
          !isPreview ? 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2' : ''
        }`}
        onClick={(e) => !isPreview && handleComponentClick(e, componentId)}
      >
        {!isPreview && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
              <button
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Move"
              >
                <Move className="h-3 w-3" />
              </button>
              <button
                className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                title="Edit"
              >
                <Edit3 className="h-3 w-3" />
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
        {children}
      </motion.div>
    );

    // Handle different types of contact number sections
    if (componentId === 'topContactCards' && component.cards) {
      return componentWrapper(
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            {component.heading?.text || 'Top Contact Cards'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {component.cards.map((card, idx) => {
              const colors = [
                { cardBg: 'bg-blue-50', iconBg: 'bg-blue-100', textColor: 'text-blue-700' },
                { cardBg: 'bg-green-50', iconBg: 'bg-green-100', textColor: 'text-green-700' },
                { cardBg: 'bg-purple-50', iconBg: 'bg-purple-100', textColor: 'text-purple-700' },
                { cardBg: 'bg-orange-50', iconBg: 'bg-orange-100', textColor: 'text-orange-700' },
                { cardBg: 'bg-red-50', iconBg: 'bg-red-100', textColor: 'text-red-700' }
              ];
              const color = colors[idx % colors.length];
              const Icon = icons[idx % icons.length];
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl shadow hover:shadow-md transition ${color.cardBg}`}
                >
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-3 ${color.iconBg}`}>
                    <Icon className="w-6 h-6" style={{ color: color.textColor }} />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {!isPreview ? (
                      <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                        {card.title}
                      </span>
                    ) : (
                      card.title
                    )}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-lg font-extrabold ${color.textColor}`}>
                      {!isPreview ? (
                        <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                          {card.number}
                        </span>
                      ) : (
                        card.number
                      )}
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
                    {!isPreview ? (
                      <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                        {card.subtitle}
                      </span>
                    ) : (
                      card.subtitle
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (componentId === 'helplineNumbersSection' && component.table) {
      return componentWrapper(
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-blue-600" /> 
            {component.heading?.text || "Helpline Numbers"}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                <th className="py-2 px-3">Service</th>
                <th className="py-2 px-3">Number</th>
              </tr>
            </thead>
            <tbody>
              {component.table.rows?.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-3 px-3 text-[15px] text-gray-800">
                    <div className="flex items-center h-full">
                      <span className="inline-block border-l-4 border-blue-600 pl-2 font-semibold">
                        {!isPreview ? (
                          <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                            {row[0]}
                          </span>
                        ) : (
                          row[0]
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] text-blue-600 font-semibold whitespace-nowrap">
                        {!isPreview ? (
                          <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                            {row[1]}
                          </span>
                        ) : (
                          row[1]
                        )}
                      </span>
                      <button
                        onClick={() => copyToClipboard(row[1])}
                        title="Copy"
                        className="hover:text-blue-500"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-green-600 font-medium">24x7 Available</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (componentId === 'allIndiaNumbersSection' && component.table) {
      return componentWrapper(
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-green-600" /> 
            {component.heading?.text || "All India Numbers"}
          </h3>
          <table className="w-full text-[15px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                {component.table.headers?.map((header, idx) => (
                  <th key={idx} className="py-2 px-3">{header}</th>
                )) || (
                  <>
                    <th className="py-2 px-3">Number</th>
                    <th className="py-2 px-3">Description</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {component.table.rows?.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="py-3 px-3">
                      {cellIdx === 0 ? (
                        <div className="text-[16px] text-green-700 font-semibold whitespace-nowrap flex items-center gap-2">
                          {!isPreview ? (
                            <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                          <button
                            onClick={() => copyToClipboard(cell)}
                            title="Copy"
                            className="hover:text-blue-500"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[14px] text-gray-700 leading-snug block max-w-sm">
                          {!isPreview ? (
                            <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Generic section renderer for other components
    return componentWrapper(
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {component.heading?.text || componentId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </h3>
        <div className="text-gray-600">
          {component.table ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                  {component.table.headers?.map((header, idx) => (
                    <th key={idx} className="py-2 px-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {component.table.rows?.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-3 px-3">
                        {!isPreview ? (
                          <span className="cursor-pointer hover:bg-yellow-50 px-1 rounded">
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Content for {componentId}</p>
          )}
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Canva-Style Contact Numbers Editor</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  previewMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Preview Mode' : 'Edit Mode'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {!previewMode && (
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Add Component:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addNewComponent('heading')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Type className="h-4 w-4" />
                Heading
              </button>
              <button
                onClick={() => addNewComponent('table')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Table className="h-4 w-4" />
                Table
              </button>
              <button
                onClick={() => addNewComponent('cards')}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Grid3X3 className="h-4 w-4" />
                Cards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
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

      {/* Component Menu */}
      {showComponentMenu && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
          style={{ 
            left: componentMenuPosition.x, 
            top: componentMenuPosition.y 
          }}
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleComponentMenuAction('edit')}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => handleComponentMenuAction('duplicate')}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
            <button
              onClick={() => handleComponentMenuAction('delete')}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Toast for copied number */}
      {copiedNumber && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied: {copiedNumber}
        </div>
      )}
    </div>
  );
};

export default CanvaStyleEditor; 
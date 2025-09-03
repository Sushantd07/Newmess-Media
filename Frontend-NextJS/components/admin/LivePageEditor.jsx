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
  List,
  GripVertical,
  Text,
  Image,
  Video
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

const LivePageEditor = ({ 
  contactData, 
  onSave, 
  onCancel, 
  isVisible = false 
}) => {
  const [editingData, setEditingData] = useState(contactData || {});
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState("");
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(""), 2000);
  };

  const handleComponentClick = (e, componentId) => {
    e.stopPropagation();
    setSelectedComponent(componentId);
  };

  const handleAddComponent = (e, componentType) => {
    e.stopPropagation();
    const newData = { ...editingData };
    const newId = `${componentType}_${Date.now()}`;
    
    switch (componentType) {
      case 'text':
        newData[newId] = {
          type: 'text',
          heading: { text: 'New Text Section', subText: 'Add your content here' },
          content: 'This is a new text section. Click to edit the content.'
        };
        break;
      case 'table':
        newData[newId] = {
          type: 'table',
          heading: { text: 'New Table', subText: 'Add your table data' },
          table: {
            headers: ['Column 1', 'Column 2'],
            rows: [['Data 1', 'Data 2']]
          }
        };
        break;
      case 'cards':
        newData[newId] = {
          type: 'cards',
          heading: { text: 'New Cards', subText: 'Add contact cards' },
          cards: [
            { title: 'New Card', number: '123-456-7890', subtitle: 'Description' }
          ]
        };
        break;
      case 'image':
        newData[newId] = {
          type: 'image',
          heading: { text: 'New Image', subText: 'Add an image' },
          imageUrl: 'https://via.placeholder.com/400x200',
          altText: 'Placeholder image'
        };
        break;
      default:
        break;
    }
    
    setEditingData(newData);
    setComponentOrder([...componentOrder, newId]);
    setShowAddMenu(false);
  };

  const handleDeleteComponent = (componentId) => {
    const newData = { ...editingData };
    delete newData[componentId];
    setEditingData(newData);
    setComponentOrder(componentOrder.filter(id => id !== componentId));
    setSelectedComponent(null);
  };

  const handleSave = async () => {
    try {
      await onSave(editingData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const renderComponent = (componentId) => {
    const component = editingData[componentId];
    if (!component) return null;

    const isSelected = selectedComponent === componentId;

    const componentWrapper = (children) => (
      <motion.div
        key={componentId}
        layout
        className={`relative group ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 transition-all`}
        onClick={(e) => handleComponentClick(e, componentId)}
      >
        {/* Component Controls */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 z-20 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <button
              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Move"
            >
              <GripVertical className="h-3 w-3" />
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
              onClick={() => handleDeleteComponent(componentId)}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Add Component Button */}
        <div className="absolute -bottom-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Add Component"
            onClick={(e) => {
              e.stopPropagation();
              setAddMenuPosition({ x: e.clientX, y: e.clientY });
              setShowAddMenu(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

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
              const icons = [PhoneCall, AlertCircle, CreditCard, Shield];
              const Icon = icons[idx % icons.length];
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl shadow hover:shadow-md transition ${color.cardBg}`}
                >
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-3 ${color.iconBg}`}>
                    <Icon className="w-6 h-6" style={{ color: color.textColor }} />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">{card.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-lg font-extrabold ${color.textColor}`}>{card.number}</p>
                    <button
                      onClick={() => copyToClipboard(card.number)}
                      title="Copy Number"
                      className="hover:text-blue-500"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{card.subtitle}</p>
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
                        {row[0]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] text-blue-600 font-semibold whitespace-nowrap">
                        {row[1]}
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
                          {cell}
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
                          {cell}
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
                        {cell}
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
    <>
      {/* Editor Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none">
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
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

      {/* Add Component Menu */}
      <AnimatePresence>
        {showAddMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
            style={{ 
              left: addMenuPosition.x, 
              top: addMenuPosition.y 
            }}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => handleAddComponent(e, 'text')}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Text className="h-4 w-4" />
                Add Text
              </button>
              <button
                onClick={(e) => handleAddComponent(e, 'table')}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Table className="h-4 w-4" />
                Add Table
              </button>
              <button
                onClick={(e) => handleAddComponent(e, 'cards')}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Grid3X3 className="h-4 w-4" />
                Add Cards
              </button>
              <button
                onClick={(e) => handleAddComponent(e, 'image')}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                <Image className="h-4 w-4" />
                Add Image
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast for copied number */}
      {copiedNumber && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Copied: {copiedNumber}
        </div>
      )}

      {/* Click outside to close add menu */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAddMenu(false)}
        />
      )}
    </>
  );
};

export default LivePageEditor; 
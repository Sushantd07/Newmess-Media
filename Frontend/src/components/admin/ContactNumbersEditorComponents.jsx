import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X
} from 'lucide-react';

// Heading Editor Component
export const HeadingEditor = ({ sectionKey, heading, onUpdate }) => {
  const [localHeading, setLocalHeading] = useState(heading || { key: '', text: '', subText: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(localHeading);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Section Heading</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
            <input
              type="text"
              value={localHeading.key}
              onChange={(e) => setLocalHeading(prev => ({ ...prev, key: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., topContactCards"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={localHeading.text}
              onChange={(e) => setLocalHeading(prev => ({ ...prev, text: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Top Contact Cards"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Text</label>
            <input
              type="text"
              value={localHeading.subText || ''}
              onChange={(e) => setLocalHeading(prev => ({ ...prev, subText: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Optional subtitle"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Key: {localHeading.key}</div>
          <div className="text-lg font-medium">{localHeading.text}</div>
          {localHeading.subText && (
            <div className="text-sm text-gray-600">{localHeading.subText}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Top Contact Cards Editor
export const TopContactCardsEditor = ({ editingData, setEditingData }) => {
  const cards = editingData.topContactCards?.cards || [];
  
  const addCard = () => {
    const newCard = {
      title: '',
      number: '',
      subtitle: '',
      icon: 'Phone',
      colors: {
        cardBg: '#ffffff',
        iconBg: '#3b82f6',
        textColor: '#1f2937'
      }
    };
    setEditingData(prev => ({
      ...prev,
      topContactCards: {
        ...prev.topContactCards,
        cards: [...cards, newCard]
      }
    }));
  };

  const updateCard = (index, field, value) => {
    const updatedCards = [...cards];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedCards[index] = {
        ...updatedCards[index],
        [parent]: {
          ...updatedCards[index][parent],
          [child]: value
        }
      };
    } else {
      updatedCards[index] = { ...updatedCards[index], [field]: value };
    }
    
    setEditingData(prev => ({
      ...prev,
      topContactCards: {
        ...prev.topContactCards,
        cards: updatedCards
      }
    }));
  };

  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setEditingData(prev => ({
      ...prev,
      topContactCards: {
        ...prev.topContactCards,
        cards: updatedCards
      }
    }));
  };

  return (
    <div className="space-y-4">
      <HeadingEditor
        sectionKey="topContactCards"
        heading={editingData.topContactCards?.heading}
        onUpdate={(heading) => setEditingData(prev => ({
          ...prev,
          topContactCards: { ...prev.topContactCards, heading }
        }))}
      />
      
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">Card {index + 1}</h4>
              <button
                onClick={() => removeCard(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateCard(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Customer Care"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                <input
                  type="text"
                  value={card.number}
                  onChange={(e) => updateCard(index, 'number', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 1800-123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) => updateCard(index, 'subtitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 24x7 Support"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  value={card.icon}
                  onChange={(e) => updateCard(index, 'icon', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Phone"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Colors</h5>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Card Background</label>
                  <input
                    type="color"
                    value={card.colors.cardBg}
                    onChange={(e) => updateCard(index, 'colors.cardBg', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Icon Background</label>
                  <input
                    type="color"
                    value={card.colors.iconBg}
                    onChange={(e) => updateCard(index, 'colors.iconBg', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={card.colors.textColor}
                    onChange={(e) => updateCard(index, 'colors.textColor', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={addCard}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Contact Card
      </button>
    </div>
  );
};

// Table Editor Component
export const TableEditor = ({ sectionKey, tableData, onUpdate }) => {
  const [table, setTable] = useState(tableData || { headers: [], rows: [] });
  
  const addHeader = () => {
    setTable(prev => ({
      ...prev,
      headers: [...prev.headers, '']
    }));
  };

  const updateHeader = (index, value) => {
    const updatedHeaders = [...table.headers];
    updatedHeaders[index] = value;
    setTable(prev => ({ ...prev, headers: updatedHeaders }));
  };

  const removeHeader = (index) => {
    const updatedHeaders = table.headers.filter((_, i) => i !== index);
    const updatedRows = table.rows.map(row => 
      row.filter((_, i) => i !== index)
    );
    setTable(prev => ({ ...prev, headers: updatedHeaders, rows: updatedRows }));
  };

  const addRow = () => {
    const newRow = new Array(table.headers.length).fill('');
    setTable(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }));
  };

  const updateRow = (rowIndex, colIndex, value) => {
    const updatedRows = [...table.rows];
    updatedRows[rowIndex] = [...updatedRows[rowIndex]];
    updatedRows[rowIndex][colIndex] = value;
    setTable(prev => ({ ...prev, rows: updatedRows }));
  };

  const removeRow = (index) => {
    const updatedRows = table.rows.filter((_, i) => i !== index);
    setTable(prev => ({ ...prev, rows: updatedRows }));
  };

  useEffect(() => {
    onUpdate(table);
  }, [table, onUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">Table Headers</h4>
        <button
          onClick={addHeader}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-3 w-3 inline mr-1" />
          Add Header
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {table.headers.map((header, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={header}
              onChange={(e) => updateHeader(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Header name"
            />
            <button
              onClick={() => removeHeader(index)}
              className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Table Rows</h4>
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <Plus className="h-3 w-3 inline mr-1" />
            Add Row
          </button>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {table.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  value={cell}
                  onChange={(e) => updateRow(rowIndex, colIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                  placeholder={table.headers[colIndex] || 'Cell value'}
                />
              ))}
              <button
                onClick={() => removeRow(rowIndex)}
                className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Section Wrapper Component
export const SectionWrapper = ({ id, title, icon: Icon, children, expandedSections, toggleSection }) => {
  const isExpanded = expandedSections.has(id);
  
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Phone Number Items Editor
export const PhoneNumberItemsEditor = ({ items, onUpdate }) => {
  const [phoneItems, setPhoneItems] = useState(items || []);

  const addItem = () => {
    const newItem = {
      type: '',
      number: '',
      description: '',
      available: '',
      languages: [],
      avgWaitTime: ''
    };
    setPhoneItems(prev => [...prev, newItem]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...phoneItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPhoneItems(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = phoneItems.filter((_, i) => i !== index);
    setPhoneItems(updatedItems);
  };

  useEffect(() => {
    onUpdate(phoneItems);
  }, [phoneItems, onUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">Phone Number Items</h4>
        <button
          onClick={addItem}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-3 w-3 inline mr-1" />
          Add Item
        </button>
      </div>
      
      <div className="space-y-4">
        {phoneItems.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-800">Item {index + 1}</h5>
              <button
                onClick={() => removeItem(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={item.type}
                  onChange={(e) => updateItem(index, 'type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Customer Care"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                <input
                  type="text"
                  value={item.number}
                  onChange={(e) => updateItem(index, 'number', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 1800-123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                <input
                  type="text"
                  value={item.available}
                  onChange={(e) => updateItem(index, 'available', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 24x7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <input
                  type="text"
                  value={item.languages.join(', ')}
                  onChange={(e) => updateItem(index, 'languages', e.target.value.split(',').map(lang => lang.trim()))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., English, Hindi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Wait Time</label>
                <input
                  type="text"
                  value={item.avgWaitTime}
                  onChange={(e) => updateItem(index, 'avgWaitTime', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 2-3 minutes"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Copy, Check } from 'lucide-react';

// Color Picker Field Editor
export const ColorPickerEditor = ({ value = '#000000', onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 border rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border rounded px-2 py-1 text-sm font-mono"
        placeholder="#000000"
      />
    </div>
  );
};

// Toggle Field Editor
export const ToggleEditor = ({ value = false, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${
          value ? 'bg-blue-500' : 'bg-gray-300'
        }`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
          value ? 'transform translate-x-4' : ''
        }`}></div>
      </div>
      <span className="ml-3 text-sm text-gray-700">
        {value ? 'Enabled' : 'Disabled'}
      </span>
    </label>
  );
};

// Select Field Editor
export const SelectEditor = ({ value = '', onChange, options = [] }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2 text-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// Array Field Editor (for simple text arrays)
export const ArrayEditor = ({ value = [], onChange, itemType = 'text' }) => {
  const addItem = () => {
    onChange([...value, '']);
  };

  const removeItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index, newValue) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-sm"
            placeholder={`Item ${index + 1}`}
          />
          <button
            onClick={() => removeItem(index)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full border-2 border-dashed border-gray-300 rounded px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </div>
  );
};

// Table Field Editor
export const TableEditor = ({ value = [], onChange }) => {
  const [headers, setHeaders] = useState(value.length > 0 ? value[0]?.length || 3 : 3);

  const addRow = () => {
    const newRow = Array(headers).fill('');
    onChange([...value, newRow]);
  };

  const removeRow = (rowIndex) => {
    onChange(value.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex, colIndex, newValue) => {
    const newData = [...value];
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(headers).fill('');
    }
    newData[rowIndex][colIndex] = newValue;
    onChange(newData);
  };

  const updateHeaders = (newHeaders) => {
    setHeaders(newHeaders);
    // Adjust existing data to match new header count
    const newData = value.map(row => {
      const newRow = Array(newHeaders).fill('');
      row.forEach((cell, index) => {
        if (index < newHeaders) newRow[index] = cell;
      });
      return newRow;
    });
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Columns:</label>
        <select
          value={headers}
          onChange={(e) => updateHeaders(parseInt(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {Array(headers).fill(0).map((_, index) => (
                <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b">
                  Column {index + 1}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b w-12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {value.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array(headers).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 py-2">
                    <input
                      type="text"
                      value={row[colIndex] || ''}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder={`Cell ${rowIndex + 1}-${colIndex + 1}`}
                    />
                  </td>
                ))}
                <td className="px-3 py-2">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={addRow}
        className="w-full border-2 border-dashed border-gray-300 rounded px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Row
      </button>
    </div>
  );
};

// Numbers List Field Editor
export const NumbersListEditor = ({ value = [], onChange }) => {
  const addNumber = () => {
    onChange([...value, { type: '', number: '', available: '' }]);
  };

  const removeNumber = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateNumber = (index, field, newValue) => {
    const newData = [...value];
    newData[index] = { ...newData[index], [field]: newValue };
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Number {index + 1}</span>
            <button
              onClick={() => removeNumber(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={item.type || ''}
              onChange={(e) => updateNumber(index, 'type', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="Type (e.g., Toll Free)"
            />
            <input
              type="text"
              value={item.number || ''}
              onChange={(e) => updateNumber(index, 'number', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="Number"
            />
            <input
              type="text"
              value={item.available || ''}
              onChange={(e) => updateNumber(index, 'available', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="Availability"
            />
          </div>
        </div>
      ))}
      
      <button
        onClick={addNumber}
        className="w-full border-2 border-dashed border-gray-300 rounded px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Number
      </button>
    </div>
  );
};

// SMS Services Field Editor
export const SMSServicesEditor = ({ value = [], onChange }) => {
  const addService = () => {
    onChange([...value, { code: '', description: '', number: '', color: 'blue' }]);
  };

  const removeService = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateService = (index, field, newValue) => {
    const newData = [...value];
    newData[index] = { ...newData[index], [field]: newValue };
    onChange(newData);
  };

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-3">
      {value.map((service, index) => (
        <div key={index} className="border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Service {index + 1}</span>
            <button
              onClick={() => removeService(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={service.code || ''}
              onChange={(e) => updateService(index, 'code', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="SMS Code (e.g., BAL)"
            />
            <select
              value={service.color || 'blue'}
              onChange={(e) => updateService(index, 'color', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <input
            type="text"
            value={service.description || ''}
            onChange={(e) => updateService(index, 'description', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Description (e.g., Check Balance)"
          />
          
          <input
            type="text"
            value={service.number || ''}
            onChange={(e) => updateService(index, 'number', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="SMS Number"
          />
        </div>
      ))}
      
      <button
        onClick={addService}
        className="w-full border-2 border-dashed border-gray-300 rounded px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add SMS Service
      </button>
    </div>
  );
};

// Enhanced Field Editor that handles all field types
export const EnhancedFieldEditor = ({ field, value, onChange }) => {
  const handleChange = (newValue) => {
    onChange(field.key, newValue);
  };

  switch (field.type) {
    case 'color':
      return <ColorPickerEditor value={value} onChange={handleChange} />;
    
    case 'toggle':
      return <ToggleEditor value={value} onChange={handleChange} />;
    
    case 'select':
      return <SelectEditor value={value} onChange={handleChange} options={field.options || []} />;
    
    case 'array':
      return <ArrayEditor value={value} onChange={handleChange} itemType={field.itemType} />;
    
    case 'table':
      return <TableEditor value={value} onChange={handleChange} />;
    
    case 'numbersList':
      return <NumbersListEditor value={value} onChange={handleChange} />;
    
    case 'smsServices':
      return <SMSServicesEditor value={value} onChange={handleChange} />;
    
    case 'textarea':
      return (
        <textarea 
          className="w-full border rounded p-2 text-sm" 
          value={value || ''} 
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
        />
      );
    
    case 'number':
      return (
        <input 
          type="number" 
          className="w-full border rounded p-2 text-sm" 
          value={value ?? ''} 
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    
    case 'json':
      return (
        <textarea 
          className="w-full border rounded p-2 font-mono text-sm" 
          rows={6} 
          value={JSON.stringify(value || [], null, 2)} 
          onChange={(e) => {
            try { 
              handleChange(JSON.parse(e.target.value || '[]')); 
            } catch (_) { 
              /* ignore */ 
            }
          }}
        />
      );
    
    default: // text
      return (
        <input 
          className="w-full border rounded p-2 text-sm" 
          value={value || ''} 
          onChange={(e) => handleChange(e.target.value)}
        />
      );
  }
};



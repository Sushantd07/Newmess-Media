import React, { useState } from 'react';
import { Edit3, Save, X, Trash2, Plus, Move, Copy } from 'lucide-react';

const EditableTable = ({ 
  table, 
  onUpdate, 
  onDelete, 
  onMove, 
  isAdminMode, 
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: table.title || '',
    headers: table.headers || ['Service', 'Number'],
    rows: table.rows || [['', '']],
    color: table.color || 'blue'
  });

  const colorSchemes = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', text: 'text-green-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', text: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100', text: 'text-orange-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-100', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-100', text: 'text-yellow-700' }
  };

  const currentColors = colorSchemes[editData.color] || colorSchemes.blue;

  const handleSave = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: table.title || '',
      headers: table.headers || ['Service', 'Number'],
      rows: table.rows || [['', '']],
      color: table.color || 'blue'
    });
    setIsEditing(false);
  };

  const addRow = () => {
    setEditData(prev => ({
      ...prev,
      rows: [...prev.rows, new Array(prev.headers.length).fill('')]
    }));
  };

  const removeRow = (rowIndex) => {
    setEditData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, index) => index !== rowIndex)
    }));
  };

  const updateRow = (rowIndex, colIndex, value) => {
    setEditData(prev => ({
      ...prev,
      rows: prev.rows.map((row, index) => 
        index === rowIndex 
          ? row.map((cell, cellIndex) => cellIndex === colIndex ? value : cell)
          : row
      )
    }));
  };

  const addColumn = () => {
    setEditData(prev => ({
      ...prev,
      headers: [...prev.headers, `Column ${prev.headers.length + 1}`],
      rows: prev.rows.map(row => [...row, ''])
    }));
  };

  const removeColumn = (colIndex) => {
    setEditData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, index) => index !== colIndex),
      rows: prev.rows.map(row => row.filter((_, index) => index !== colIndex))
    }));
  };

  const updateHeader = (colIndex, value) => {
    setEditData(prev => ({
      ...prev,
      headers: prev.headers.map((header, index) => index === colIndex ? value : header)
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isEditing) {
    return (
      <div className={`${currentColors.bg} ${currentColors.border} border-2 rounded-xl p-4 shadow-md`}>
        <div className="space-y-4">
          {/* Title and Color */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold"
              placeholder="Table Title"
            />
            <select
              value={editData.color}
              onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>

          {/* Headers */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Headers</label>
              <button
                onClick={addColumn}
                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                title="Add Column"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${editData.headers.length}, 1fr)` }}>
              {editData.headers.map((header, colIndex) => (
                <div key={colIndex} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(colIndex, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                    placeholder={`Header ${colIndex + 1}`}
                  />
                  {editData.headers.length > 1 && (
                    <button
                      onClick={() => removeColumn(colIndex)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                      title="Remove Column"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Rows</label>
              <button
                onClick={addRow}
                className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                title="Add Row"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              {editData.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(${editData.headers.length}, 1fr)` }}>
                    {row.map((cell, colIndex) => (
                      <input
                        key={colIndex}
                        type="text"
                        value={cell}
                        onChange={(e) => updateRow(rowIndex, colIndex, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                        placeholder={`Cell ${rowIndex + 1}-${colIndex + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                    title="Remove Row"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentColors.bg} ${currentColors.border} border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group`}>
      {/* Admin Controls */}
      {isAdminMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-white/80 rounded hover:bg-white transition-colors"
            title="Edit Table"
          >
            <Edit3 className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1 bg-white/80 rounded hover:bg-red-100 transition-colors"
            title="Delete Table"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </button>
          <button
            onClick={() => onMove(index, 'up')}
            className="p-1 bg-white/80 rounded hover:bg-blue-100 transition-colors"
            title="Move Up"
          >
            <Move className="h-3 w-3 text-blue-600" />
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="space-y-3">
        {editData.title && (
          <h4 className={`font-semibold ${currentColors.text} text-lg`}>
            {editData.title}
          </h4>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className={currentColors.header}>
              <tr>
                {editData.headers.map((header, index) => (
                  <th key={index} className="px-3 py-2 text-left font-semibold text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="px-3 py-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="flex-1">{cell}</span>
                        {isAdminMode && cell && (
                          <button
                            onClick={() => copyToClipboard(cell)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditableTable; 
import React, { useState } from 'react';
import { Edit3, Save, X, Trash2, Move } from 'lucide-react';

const EditableCard = ({ 
  card, 
  onUpdate, 
  onDelete, 
  onMove, 
  isAdminMode, 
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.title || '',
    content: card.content || '',
    icon: card.icon || '📱',
    color: card.color || 'blue',
    subtitle: card.subtitle || ''
  });

  const colorSchemes = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' }
  };

  const currentColors = colorSchemes[editData.color] || colorSchemes.blue;

  const handleSave = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: card.title || '',
      content: card.content || '',
      icon: card.icon || '📱',
      color: card.color || 'blue',
      subtitle: card.subtitle || ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`${currentColors.bg} ${currentColors.border} border-2 rounded-xl p-4 shadow-md`}>
        <div className="space-y-3">
          {/* Icon and Color Selection */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={editData.icon}
              onChange={(e) => setEditData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg bg-white"
              placeholder="📱"
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              placeholder="Card Title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={editData.subtitle}
              onChange={(e) => setEditData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              placeholder="Card Subtitle"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm resize-none"
              rows={3}
              placeholder="Card content..."
            />
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
            title="Edit Card"
          >
            <Edit3 className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1 bg-white/80 rounded hover:bg-red-100 transition-colors"
            title="Delete Card"
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

      {/* Card Content */}
      <div className="flex items-start gap-3">
        <div className="text-3xl">{editData.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${currentColors.text} text-lg mb-1`}>
            {editData.title}
          </h4>
          {editData.subtitle && (
            <p className="text-sm text-gray-600 mb-2">{editData.subtitle}</p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed">
            {editData.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditableCard; 
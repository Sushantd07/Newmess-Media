import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, Save } from 'lucide-react';

const InlineEditor = ({ 
  children, 
  value, 
  onSave, 
  field, 
  type = 'text',
  className = '',
  placeholder = 'Click to edit...',
  isAdminMode = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    if (isAdminMode) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving inline edit:', error);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdminMode) {
    return <span className={className}>{children}</span>;
  }

  if (isEditing) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm resize-none min-h-[60px]"
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm"
            placeholder={placeholder}
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Save"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <span 
      className={`group cursor-pointer hover:bg-yellow-50 hover:border hover:border-yellow-200 rounded px-1 transition-colors ${className}`}
      onClick={handleEdit}
      title="Click to edit"
    >
      {children}
      <Edit3 className="inline-block h-3 w-3 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
};

export default InlineEditor; 
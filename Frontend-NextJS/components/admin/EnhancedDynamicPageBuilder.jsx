import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, GripVertical, Eye, Settings, Copy, Check } from 'lucide-react';
import { componentRegistry } from './ComponentRegistry.jsx';
import { EnhancedFieldEditor } from './EnhancedFieldEditors.jsx';

const EnhancedDynamicPageBuilder = ({ pageId, initialData, onSave }) => {
  const [title, setTitle] = useState(initialData?.title || 'Untitled Page');
  const [sections, setSections] = useState(initialData?.sections || []);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTitle(initialData?.title || 'Untitled Page');
    setSections(initialData?.sections || []);
  }, [initialData]);

  const selected = useMemo(() => (selectedIndex != null ? sections[selectedIndex] : null), [selectedIndex, sections]);

  const addSection = (key) => {
    const def = componentRegistry[key]?.defaults || {};
    setSections((prev) => [...prev, { component: key, props: def }]);
    setSelectedIndex(sections.length);
  };

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    if (selectedIndex === index) setSelectedIndex(null);
  };

  const move = (from, to) => {
    if (to < 0 || to >= sections.length) return;
    setSections((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setSelectedIndex(to);
  };

  const updateProp = (key, value) => {
    if (selectedIndex == null) return;
    setSections((prev) => prev.map((s, i) => (i === selectedIndex ? { ...s, props: { ...s.props, [key]: value } } : s)));
  };

  // Handle inline editing for NRI Support Card
  const handleDataChange = (section, rowIndex, field, value) => {
    if (selectedIndex == null) return;
    
    setSections((prev) => {
      const newSections = [...prev];
      const currentSection = newSections[selectedIndex];
      
      // Update the data based on the section and field
      if (section === 'phone') {
        // Update phone banking data
        const phoneData = currentSection.props.phoneBankingData || [
          { country: "USA", number: "855-999-6061" },
          { country: "Canada", number: "855-999-6061" },
          { country: "Singapore", number: "800-101-2850" },
          { country: "Kenya", number: "0-800-721-740" },
          { country: "Other Countries", number: "91-2260006000" }
        ];
        
        if (phoneData[rowIndex]) {
          phoneData[rowIndex][field] = value;
          currentSection.props.phoneBankingData = phoneData;
        }
      } else if (section === 'account') {
        // Update account opening data
        const accountData = currentSection.props.accountOpeningData || [
          { country: "USA", number: "855-207-8106" },
          { country: "Canada", number: "855-846-3731" },
          { country: "UK", number: "800-756-2993" },
          { country: "Singapore", number: "800-101-2798" }
        ];
        
        if (accountData[rowIndex]) {
          accountData[rowIndex][field] = value;
          currentSection.props.accountOpeningData = accountData;
        }
      }
      
      return newSections;
    });
  };

  const handleSave = async () => {
    const payload = { pageId, title, sections };
    onSave?.(payload);
    try {
      const res = await fetch(`/api/dynamic-pages/${encodeURIComponent(pageId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      move(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Dynamic Page Studio</h1>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-3 py-2 text-lg font-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page Title"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {copied ? 'Saved!' : 'Save Page'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Components */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
            <div className="space-y-3">
              {Object.entries(componentRegistry).map(([key, meta]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{meta.label}</h3>
                    <button
                      onClick={() => addSection(key)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded border p-3 mb-3">
                    {meta.preview ? meta.preview(meta.defaults) : (
                      <div className="text-sm text-gray-500">Preview not available</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {meta.schema?.length || 0} editable properties
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Builder */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {sections.map((s, i) => (
                  <div
                    key={i}
                    className={`border-2 rounded-lg transition-all ${
                      selectedIndex === i 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${draggedIndex === i ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="cursor-grab text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <button
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            onClick={() => setSelectedIndex(i)}
                          >
                            {componentRegistry[s.component]?.label || s.component}
                          </button>
                          {selectedIndex === i && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => move(i, i - 1)}
                            disabled={i === 0}
                          >
                            ↑
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => move(i, i + 1)}
                            disabled={i === sections.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            onClick={() => removeSection(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Component Preview */}
                      <div className="bg-white border rounded p-4">
                        {(() => {
                          const Comp = componentRegistry[s.component]?.component;
                          return Comp ? (
                            <Comp 
                              {...(s.props || {})} 
                              onDataChange={s.component === 'NRISupportCard' ? handleDataChange : undefined}
                            />
                          ) : (
                            <div className="text-gray-500 text-center py-8">
                              Component not found: {s.component}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {sections.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Plus className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
                    <p className="text-gray-500 mb-4">
                      Add components from the left panel to start building your page
                    </p>
                    <div className="text-sm text-gray-400">
                      Drag and drop components to reorder them
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
            {!selected ? (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a component to edit its properties</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <h3 className="font-medium text-blue-900 mb-1">
                    {componentRegistry[selected.component]?.label || selected.component}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {componentRegistry[selected.component]?.schema?.length || 0} properties available
                  </p>
                </div>
                
                <div className="space-y-4">
                  {(componentRegistry[selected.component]?.schema || []).map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <EnhancedFieldEditor
                        field={field}
                        value={selected.props?.[field.key]}
                        onChange={updateProp}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              <div className="space-y-4">
                {sections.map((s, i) => {
                  const Comp = componentRegistry[s.component]?.component;
                  return Comp ? (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 border-b">
                        {componentRegistry[s.component]?.label || s.component}
                      </div>
                      <div className="p-4">
                        <Comp {...(s.props || {})} />
                      </div>
                    </div>
                  ) : null;
                })}
                
                {sections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No components to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDynamicPageBuilder;

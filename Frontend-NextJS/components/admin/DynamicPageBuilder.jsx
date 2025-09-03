import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, GripVertical } from 'lucide-react';
import { componentRegistry } from './ComponentRegistry.jsx';

const Cards3Editor = ({ value = [], onChange }) => {
  const items = Array.isArray(value) ? value.slice(0, 3) : [];
  while (items.length < 3) items.push({ icon: '📞', title: '', subtitle: '', color: 'blue' });
  const set = (i, key, val) => {
    const next = items.map((c, idx) => (idx === i ? { ...c, [key]: val } : c));
    onChange(next);
  };
  const Color = ({ v, active, onClick }) => (
    <button type="button" onClick={onClick} className={`w-6 h-6 rounded-full border ${active ? 'ring-2 ring-blue-500' : ''} ${v === 'blue' ? 'bg-blue-400' : v === 'red' ? 'bg-red-400' : v === 'green' ? 'bg-green-400' : 'bg-gray-400'}`}></button>
  );
  return (
    <div className="space-y-3">
      {items.map((c, i) => (
        <div key={i} className="border rounded p-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs mb-1">Icon (emoji)</div>
              <input className="w-full border rounded p-2" value={c.icon} onChange={(e) => set(i, 'icon', e.target.value)} />
            </div>
            <div>
              <div className="text-xs mb-1">Color</div>
              <div className="flex items-center gap-2">
                {['blue','red','green','gray'].map(col => (
                  <Color key={col} v={col} active={c.color === col} onClick={() => set(i, 'color', col)} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs mb-1">Title</div>
              <input className="w-full border rounded p-2" value={c.title} onChange={(e) => set(i, 'title', e.target.value)} />
            </div>
            <div>
              <div className="text-xs mb-1">Subtitle</div>
              <input className="w-full border rounded p-2" value={c.subtitle} onChange={(e) => set(i, 'subtitle', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FieldEditor = ({ field, value, onChange }) => {
  const handleChange = (e) => onChange(field.key, e.target.value);
  if (field.type === 'textarea') {
    return (
      <textarea className="w-full border rounded p-2" value={value || ''} onChange={handleChange} />
    );
  }
  if (field.type === 'number') {
    return (
      <input type="number" className="w-full border rounded p-2" value={value ?? ''} onChange={handleChange} />
    );
  }
  if (field.type === 'cards3') {
    return <Cards3Editor value={value} onChange={(val) => onChange(field.key, val)} />;
  }
  if (field.type === 'json') {
    return (
      <textarea className="w-full border rounded p-2 font-mono text-sm" rows={6} value={JSON.stringify(value || [], null, 2)} onChange={(e) => {
        try { onChange(field.key, JSON.parse(e.target.value || '[]')); } catch (_) { /* ignore */ }
      }} />
    );
  }
  return <input className="w-full border rounded p-2" value={value || ''} onChange={handleChange} />;
};

const DynamicPageBuilder = ({ pageId, initialData, onSave }) => {
  const [title, setTitle] = useState(initialData?.title || 'Untitled Page');
  const [sections, setSections] = useState(initialData?.sections || []);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
      alert('Saved');
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3 border rounded p-3 space-y-2">
        <div className="font-semibold mb-2">Components</div>
        <div className="space-y-3">
          {Object.entries(componentRegistry).map(([key, meta]) => (
            <div key={key} className="border rounded p-2">
              <div className="text-sm font-medium mb-2">{meta.label}</div>
              <div className="bg-white rounded border mb-2 p-2">
                {meta.preview ? meta.preview(meta.defaults) : null}
              </div>
              <button className="w-full border rounded px-2 py-1" onClick={() => addSection(key)}>Add</button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-6 space-y-3">
        <div className="flex items-center gap-2">
          <input className="flex-1 border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white rounded px-3 py-2" onClick={handleSave}>
            <Save size={16} /> Save
          </button>
        </div>

        <div className="space-y-2">
          {sections.map((s, i) => (
            <div key={i} className={`border rounded p-2 ${selectedIndex === i ? 'ring-2 ring-blue-400' : ''}`}> 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="cursor-grab"><GripVertical size={16} /></span>
                  <button className="font-medium" onClick={() => setSelectedIndex(i)}>
                    {componentRegistry[s.component]?.label || s.component}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 border rounded" onClick={() => move(i, i - 1)}>Up</button>
                  <button className="px-2 py-1 border rounded" onClick={() => move(i, i + 1)}>Down</button>
                  <button className="px-2 py-1 border rounded text-red-600" onClick={() => removeSection(i)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600"></div>
            </div>
          ))}
          {sections.length === 0 && (
            <div className="border-2 border-dashed rounded p-8 text-center text-gray-500">Add components from the left panel</div>
          )}
        </div>
      </div>

      <div className="col-span-3 border rounded p-3">
        <div className="font-semibold mb-2">Properties</div>
        {!selected && <div className="text-gray-500 text-sm">Select a section to edit props</div>}
        {selected && (
          <div className="space-y-3">
            {(componentRegistry[selected.component]?.schema || []).map((field) => (
              <div key={field.key}>
                <div className="text-sm mb-1">{field.label}</div>
                <FieldEditor field={field} value={selected.props?.[field.key]} onChange={updateProp} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPageBuilder;



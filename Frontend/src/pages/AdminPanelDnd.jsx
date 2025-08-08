import React, { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "../components/SortableItem";

const initialFields = [
  { id: "1", label: "Name", type: "text" },
  { id: "2", label: "Email", type: "email" },
  { id: "3", label: "Phone", type: "tel" },
];

export default function AdminPanelDnd() {
  const [fields, setFields] = useState(initialFields);
  const [json, setJson] = useState(JSON.stringify(initialFields, null, 2));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newFields = arrayMove(items, oldIndex, newIndex);
        setJson(JSON.stringify(newFields, null, 2));
        return newFields;
      });
    }
  };

  const handleJsonChange = (e) => {
    setJson(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setFields(parsed);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel - Form Builder</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Drag & Drop Fields</h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableItem key={field.id} id={field.id} field={field} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">JSON Editor</h2>
          <textarea
            className="w-full h-48 border rounded p-2 font-mono text-sm"
            value={json}
            onChange={handleJsonChange}
          />
          <h2 className="text-xl font-semibold mt-6 mb-4">Live Preview</h2>
          <form className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block font-medium mb-1">{field.label}</label>
                <input
                  type={field.type}
                  className="w-full border rounded p-2"
                  placeholder={field.label}
                  disabled
                />
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}

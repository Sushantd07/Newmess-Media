import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, field }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f3f4f6" : "#fff",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between border rounded p-3 mb-2 shadow-sm cursor-move hover:bg-gray-100"
    >
      <span className="font-medium">{field.label}</span>
      <span className="text-xs text-gray-500">{field.type}</span>
    </div>
  );
}

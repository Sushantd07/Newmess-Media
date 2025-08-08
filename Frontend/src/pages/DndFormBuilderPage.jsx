
import React, { Suspense } from 'react';
const AdminPanelDnd = React.lazy(() => import('./AdminPanelDnd.jsx'));

export default function DndFormBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Drag & Drop Form Builder</h1>
      <p className="mb-4 text-gray-600">Use the sidebar to return to the dashboard or other admin tools.</p>
      <div className="w-full max-w-4xl">
        <Suspense fallback={<div>Loading...</div>}>
          <AdminPanelDnd />
        </Suspense>
      </div>
    </div>
  );
}

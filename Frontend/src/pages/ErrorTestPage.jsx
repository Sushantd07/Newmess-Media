import React, { useState } from 'react';
import LivePageInlineEditor from '../components/admin/LivePageInlineEditor';

const ErrorTestPage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState(null);

  // Simple test data
  const testData = {
    topContactCards: {
      heading: { text: "Test Contact Cards" },
      cards: [
        {
          title: "Test Card 1",
          number: "123-456-7890",
          subtitle: "Test Subtitle 1"
        }
      ]
    }
  };

  const handleSave = async (data) => {
    try {
      console.log('Saving data:', data);
      alert('Data saved successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Save error:', err);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Error Test Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Live Page Editor
          </button>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Errors
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Click "Open Live Page Editor" to test</li>
            <li>• Check browser console (F12) for any errors</li>
            <li>• Try clicking on text to edit</li>
            <li>• Report any errors you see</li>
          </ul>
        </div>
      </div>

      <LivePageInlineEditor
        contactData={testData}
        onSave={handleSave}
        onCancel={handleCancel}
        isVisible={showEditor}
      />
    </div>
  );
};

export default ErrorTestPage; 
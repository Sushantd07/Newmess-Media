import React, { useState, useEffect } from 'react';
import LivePageInlineEditor from '../components/admin/LivePageInlineEditor';

const LivePageDebugTest = () => {
  const [contactData, setContactData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Sample data that matches the expected structure
  const sampleContactData = {
    topContactCards: {
      heading: { text: "Top Contact Cards" },
      cards: [
        {
          title: "Customer Care",
          number: "1800 1234",
          subtitle: "24/7 Customer Support"
        },
        {
          title: "Phone Banking",
          number: "1800 425 3800",
          subtitle: "24/7 Phone Banking"
        },
        {
          title: "YONO App Support",
          number: "1800 11 22 11",
          subtitle: "24/7 YONO Support"
        }
      ]
    },
    helplineNumbersSection: {
      heading: { text: "Helpline Numbers" },
      table: {
        headers: ["Service", "Number", "Availability"],
        rows: [
          ["Cyber Crime", "1930", "24/7"],
          ["Phone Banking", "1800 1234", "24/7"],
          ["Customer Support", "1800 11 2211", "24/7"]
        ]
      }
    },
    allIndiaNumbersSection: {
      heading: { text: "All India Numbers" },
      table: {
        headers: ["Service", "Number", "Description"],
        rows: [
          ["WhatsApp Banking", "90226 90226", "Banking via WhatsApp"],
          ["Balance Enquiry", "92237 66666", "Missed Call Service"],
          ["Mini Statement", "92238 66666", "Missed Call Service"]
        ]
      }
    }
  };

  const handleSave = async (updatedData) => {
    console.log('Saving data:', updatedData);
    setContactData(updatedData);
    alert('Data saved successfully! Check console for details.');
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Page Editor Debug Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Data Structure:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(contactData || sampleContactData, null, 2)}
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
            onClick={() => setContactData(sampleContactData)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Load Sample Data
          </button>
          <button
            onClick={() => setContactData(null)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Data
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Click "Load Sample Data" to load test data</li>
            <li>• Click "Open Live Page Editor" to test the editor</li>
            <li>• Try clicking on text to edit it inline</li>
            <li>• Try dragging components to reorder them</li>
            <li>• Check the console for any errors</li>
          </ul>
        </div>
      </div>

      <LivePageInlineEditor
        contactData={contactData || sampleContactData}
        onSave={handleSave}
        onCancel={handleCancel}
        isVisible={showEditor}
      />
    </div>
  );
};

export default LivePageDebugTest; 
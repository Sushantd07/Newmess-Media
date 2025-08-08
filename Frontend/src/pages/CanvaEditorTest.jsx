import React, { useState } from 'react';
import CanvaStyleEditor from '../components/admin/CanvaStyleEditor';

const CanvaEditorTest = () => {
  const [showEditor, setShowEditor] = useState(false);
  
  // Sample contact numbers data
  const sampleContactData = {
    topContactCards: {
      heading: { text: 'Quick Contact Numbers', subText: 'Get in touch with us instantly' },
      cards: [
        {
          title: 'Customer Care',
          number: '1800-123-4567',
          subtitle: '24/7 Support Available'
        },
        {
          title: 'Emergency',
          number: '1800-999-8888',
          subtitle: 'For urgent matters only'
        },
        {
          title: 'Technical Support',
          number: '1800-555-4444',
          subtitle: 'For technical issues'
        }
      ]
    },
    helplineNumbersSection: {
      heading: { text: 'Helpline Numbers', subText: 'Specialized support lines' },
      table: {
        headers: ['Service', 'Number'],
        rows: [
          ['General Inquiries', '1800-123-4567'],
          ['Account Issues', '1800-234-5678'],
          ['Technical Support', '1800-345-6789'],
          ['Complaints', '1800-456-7890']
        ]
      }
    },
    allIndiaNumbersSection: {
      heading: { text: 'All India Numbers', subText: 'Pan India support' },
      table: {
        headers: ['Number', 'Description'],
        rows: [
          ['1800-111-2222', 'Toll Free Customer Care'],
          ['1800-333-4444', 'Toll Free Technical Support'],
          ['1800-555-6666', 'Toll Free Complaints'],
          ['1800-777-8888', 'Toll Free Emergency']
        ]
      }
    },
    smsServicesSection: {
      heading: { text: 'SMS Services', subText: 'Quick SMS commands' },
      services: [
        {
          code: 'BAL',
          description: 'Check Balance',
          number: '567676'
        },
        {
          code: 'MINI',
          description: 'Mini Statement',
          number: '567676'
        }
      ]
    }
  };

  const handleSave = async (updatedData) => {
    console.log('Saving updated data:', updatedData);
    // In a real app, this would save to the backend
    alert('Data saved successfully! Check console for details.');
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Canva-Style Editor Test
          </h1>
          <p className="text-gray-600 mb-8">
            This page demonstrates the Canva-style contact numbers editor with drag-and-drop functionality.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowEditor(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Open Canva-Style Editor
            </button>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Drag and drop components to reorder</li>
                <li>• Click components to edit or delete</li>
                <li>• Add new components from toolbar</li>
                <li>• Preview mode to see final result</li>
                <li>• Real-time editing with visual feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CanvaStyleEditor
        contactData={sampleContactData}
        onSave={handleSave}
        onCancel={() => setShowEditor(false)}
        isVisible={showEditor}
      />
    </div>
  );
};

export default CanvaEditorTest; 
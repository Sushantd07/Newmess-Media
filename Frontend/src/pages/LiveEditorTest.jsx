import React, { useState } from 'react';
import LivePageEditor from '../components/admin/LivePageEditor';

const LiveEditorTest = () => {
  const [showEditor, setShowEditor] = useState(false);
  
  // Sample contact numbers data matching the SBI page structure
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
        // Note: Only 3 cards to show the empty space for adding new content
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
    customerCareListSection: {
      heading: { text: 'Customer Care List', subText: 'Quick access to services' },
      links: [
        { name: 'SBI Customer Care', href: '#' },
        { name: 'Axis Bank Customer Care', href: '#' },
        { name: 'ICICI Bank Customer Care', href: '#' },
        { name: 'HDFC Bank Customer Care', href: '#' }
      ]
    }
  };

  const handleSave = async (updatedData) => {
    console.log('Saving updated data:', updatedData);
    alert('Data saved successfully! Check console for details.');
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Live Page Editor Test</h1>
          <p className="text-gray-600 mt-2">
            This demonstrates the Canva-style live page editing for contact numbers
          </p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showEditor 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showEditor ? 'Exit Live Editor' : 'Start Live Editor'}
            </button>
            
            {!showEditor && (
              <div className="text-sm text-gray-600">
                Click "Start Live Editor" to see the Canva-style editing experience
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!showEditor && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">How to Use Live Editor:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Click components</strong> to select and edit them</li>
              <li>• <strong>Drag components</strong> to reorder them (like Canva)</li>
              <li>• <strong>Hover over components</strong> to see the "+" button to add new content</li>
              <li>• <strong>Add text, tables, cards, or images</strong> in empty spaces</li>
              <li>• <strong>Edit directly on the live page</strong> - no separate editor needed</li>
            </ul>
          </div>
        </div>
      )}

      {/* Live Editor */}
      {showEditor && (
        <LivePageEditor
          contactData={sampleContactData}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
          isVisible={showEditor}
        />
      )}

      {/* Demo Content (shown when editor is off) */}
      {!showEditor && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Demo: SBI Contact Numbers Page</h2>
            <p className="text-gray-600 mb-6">
              This shows how the live editor would work on the actual SBI contact numbers page. 
              Notice there are only 3 cards in the top section, leaving space for a 4th card or other content.
            </p>
            
            <div className="space-y-6">
              {/* Top Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sampleContactData.topContactCards.cards.map((card, idx) => (
                  <div key={idx} className="p-4 rounded-xl shadow border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">{card.title}</h4>
                    <p className="text-lg font-extrabold text-blue-600 mt-1">{card.number}</p>
                    <p className="text-sm text-gray-600">{card.subtitle}</p>
                  </div>
                ))}
                {/* Empty space for 4th card */}
                <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">+</div>
                    <div className="text-sm">Empty Space</div>
                    <div className="text-xs">Add content here</div>
                  </div>
                </div>
              </div>

              {/* Tables Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Helpline Numbers</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3">Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleContactData.helplineNumbersSection.table.rows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-3 px-3">{row[0]}</td>
                          <td className="py-3 px-3 text-blue-600 font-semibold">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">All India Numbers</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                        <th className="py-2 px-3">Number</th>
                        <th className="py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleContactData.allIndiaNumbersSection.table.rows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-3 px-3 text-green-600 font-semibold">{row[0]}</td>
                          <td className="py-3 px-3">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveEditorTest; 
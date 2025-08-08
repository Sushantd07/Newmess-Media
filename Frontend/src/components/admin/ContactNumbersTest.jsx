import React, { useState } from 'react';
import ContactNumbersEditor from './ContactNumbersEditor';

const ContactNumbersTest = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [contactData, setContactData] = useState({
    tabTitle: "Contact Numbers",
    tabDescription: "Customer care, helpline, toll-free numbers",
    
    // Sample data for testing
    topContactCards: {
      heading: {
        key: "topContactCards",
        text: "Top Contact Cards",
        subText: "Most important contact numbers"
      },
      cards: [
        {
          title: "Customer Care",
          number: "1800-123-4567",
          subtitle: "24x7 Support",
          icon: "Phone",
          colors: {
            cardBg: "#ffffff",
            iconBg: "#3b82f6",
            textColor: "#1f2937"
          }
        },
        {
          title: "Credit Card Support",
          number: "1800-987-6543",
          subtitle: "Card related queries",
          icon: "CreditCard",
          colors: {
            cardBg: "#f0f9ff",
            iconBg: "#10b981",
            textColor: "#065f46"
          }
        }
      ]
    },
    
    helplineNumbersSection: {
      heading: {
        key: "helplineNumbers",
        text: "Helpline Numbers",
        subText: "Emergency and support numbers"
      },
      table: {
        headers: ["Service", "Number", "Timing", "Languages"],
        rows: [
          ["General Support", "1800-123-4567", "24x7", "English, Hindi"],
          ["Technical Support", "1800-987-6543", "9 AM - 6 PM", "English"],
          ["Complaints", "1800-555-0123", "24x7", "English, Hindi, Regional"]
        ]
      }
    },
    
    emailSupportSection: {
      heading: {
        key: "emailSupport",
        text: "Email Support",
        subText: "Write to us for support"
      },
      table: {
        headers: ["Service", "Email", "Response Time"],
        rows: [
          ["General Queries", "support@company.com", "24 hours"],
          ["Technical Issues", "tech@company.com", "48 hours"],
          ["Complaints", "complaints@company.com", "72 hours"]
        ]
      }
    }
  });

  const handleSave = async (data) => {
    console.log('Saving contact numbers data:', data);
    setContactData(data);
    setShowEditor(false);
    // In a real app, you would make an API call here
    alert('Contact numbers saved successfully!');
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Contact Numbers Editor Demo
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Demo Instructions
              </h2>
              <p className="text-blue-800 text-sm">
                This is a demonstration of the Contact Numbers Editor. Click the button below to open the editor 
                and explore all the features including:
              </p>
              <ul className="text-blue-800 text-sm mt-2 list-disc list-inside space-y-1">
                <li>Top Contact Cards with customizable colors</li>
                <li>Dynamic table editors for helpline numbers</li>
                <li>Email support configuration</li>
                <li>Section headings and descriptions</li>
                <li>Real-time preview and editing</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowEditor(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Open Contact Numbers Editor
              </button>
              
              <button
                onClick={() => {
                  console.log('Current contact data:', contactData);
                  alert('Check console for current data structure');
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                View Current Data
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Data Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-auto max-h-64">
                  {JSON.stringify(contactData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Numbers Editor */}
      <ContactNumbersEditor
        contactData={contactData}
        onSave={handleSave}
        onCancel={handleCancel}
        isVisible={showEditor}
      />
    </div>
  );
};

export default ContactNumbersTest; 
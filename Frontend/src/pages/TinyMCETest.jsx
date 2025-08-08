import React, { useState } from 'react';
import TinyMCEEditor from '../components/admin/TinyMCEEditor';
import { FileText, Download, Upload, AlertCircle } from 'lucide-react';

const TinyMCETest = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [savedContent, setSavedContent] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Sample Word content for testing
  const sampleWordContent = `
    <h1>HDFC Bank Complaint Redressal Process</h1>
    
    <h2>How to File a Complaint</h2>
    <p>Follow these steps to file a complaint with HDFC Bank:</p>
    
    <h3>Method 1: Online Complaint Portal</h3>
    <ol>
      <li><strong>Visit the official website</strong><br>
        Go to https://leads.hdfcbank.com/applications/webforms/apply/complaint_form_new.asp
      </li>
      <li><strong>Fill in your details</strong><br>
        Provide your account number, contact information, and complaint details
      </li>
      <li><strong>Submit the form</strong><br>
        Review and submit your complaint
      </li>
    </ol>
    
    <h3>Method 2: Customer Care</h3>
    <p>Call the customer care numbers:</p>
    <ul>
      <li><strong>Toll Free:</strong> 1800-202-6161</li>
      <li><strong>From Mobile:</strong> 022-61606161</li>
      <li><strong>From Landline:</strong> 022-61606161</li>
    </ul>
    
    <h2>Escalation Levels</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead style="background-color: #f8fafc;">
        <tr>
          <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600;">Level</th>
          <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600;">Department</th>
          <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600;">Timeline</th>
          <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600;">Contact</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: white;">
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Level 1</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Customer Care</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">24-48 hours</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">1800-202-6161</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Level 2</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Branch Manager</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">3-5 days</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Branch Contact</td>
        </tr>
        <tr style="background-color: white;">
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Level 3</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Regional Office</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">7-10 days</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">Regional Contact</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Important Documents Required</h2>
    <ul>
      <li>Account statement</li>
      <li>Transaction receipts</li>
      <li>Identity proof</li>
      <li>Address proof</li>
      <li>Complaint details with dates</li>
    </ul>
    
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <h3 style="color: #92400e; margin: 0 0 8px 0;">Important Note</h3>
      <p style="color: #92400e; margin: 0;">Always keep a copy of your complaint and reference number for future follow-up.</p>
    </div>
  `;

  const handleSave = async (content) => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSavedContent(content);
    setSaveStatus('success');
    
    // Clear success status after 3 seconds
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setSaveStatus(null);
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success':
        return <AlertCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TinyMCE Editor Test</h1>
              <p className="text-gray-600">Test the rich text editor with Word document paste functionality</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Open Editor
            </button>
            
            {saveStatus && (
              <div className="flex items-center gap-2 text-sm">
                {getSaveStatusIcon()}
                <span className={saveStatus === 'success' ? 'text-green-600' : 'text-blue-600'}>
                  {saveStatus === 'saving' ? 'Saving...' : 'Saved successfully!'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">How to Test Word Paste Functionality:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click "Open Editor" to launch the TinyMCE editor</li>
            <li>Copy the sample content below (or any Word document content)</li>
            <li>Paste it into the editor - it should automatically format headings, tables, and lists</li>
            <li>Edit the content using the toolbar buttons</li>
            <li>Use the preview mode to see how it will look</li>
            <li>Save the content to see it rendered below</li>
          </ol>
        </div>

        {/* Sample Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Word Content to Copy & Paste:</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-600 mb-2">Copy this content and paste it into the editor:</p>
            <div 
              className="text-sm text-gray-800 bg-white border border-gray-300 rounded p-3 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: sampleWordContent }}
            />
          </div>
        </div>

        {/* Saved Content Display */}
        {savedContent && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Content Preview:</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </div>
        )}

        {/* TinyMCE Editor */}
        <TinyMCEEditor
          initialValue={savedContent || sampleWordContent}
          onSave={handleSave}
          onCancel={handleCancel}
          isVisible={showEditor}
          title="TinyMCE Rich Text Editor Test"
          placeholder="Start typing or paste content from Word documents. You can include headings, tables, lists, and formatted text..."
          height={600}
          showToolbar={true}
          showPreview={true}
        />
      </div>
    </div>
  );
};

export default TinyMCETest; 
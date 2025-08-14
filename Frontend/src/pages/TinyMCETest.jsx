import React, { useState, useRef } from 'react';
import TinyMCEEditor from '../components/admin/TinyMCEEditor.jsx';

const TinyMCETest = () => {
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const editorRef = useRef(null);

  const sampleWordContent = `
<h1 style="font-size: 24px;">Method 2: HDFC Online Complaint Portal</h1>

<p>Fill out this complaint form.</p>

<p style="font-size: 18px;"><strong>1. Visit HDFC Complaint Portal:</strong></p>
<p>Go to: https://www.hdfcbank.com/personal/ways-to-bank/customer-service</p>

<p style="font-size: 18px;"><strong>2. Select Complaint Type:</strong></p>
<ul>
<li>Choose: "Customer" (for general users)</li>
<li>Click on: "Submit a Complaint"</li>
</ul>

<p style="font-size: 18px;"><strong>3. Fill Basic Details:</strong></p>
<ul>
<li>Account number (optional)</li>
<li>Name, Mobile, Email</li>
<li>Select Complaint Category & Sub-category</li>
</ul>

<p style="font-size: 18px;"><strong>4. Enter Complaint Details:</strong></p>
<ul>
<li>Write a brief description (100-500 characters)</li>
<li>Mention branch, ATM, transaction ID if available</li>
</ul>

<p style="font-size: 18px;"><strong>5. Submit Complaint:</strong></p>
<ul>
<li>Enter Captcha</li>
<li>Click Submit</li>
<li>Note down the Complaint Ticket Number</li>
</ul>

<p style="font-size: 18px;"><strong>Method 3: Branch Visit (Offline)</strong></p>
  `;

  const handleSave = (savedContent) => {
    setContent(savedContent);
    console.log('Content saved:', savedContent);
  };

  const handleLoadSample = () => {
    setContent(sampleWordContent);
    if (editorRef.current) {
      editorRef.current.setContent(sampleWordContent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TinyMCE Editor Test Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page tests the new TinyMCE editor with all the specified features:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">✅ Features Implemented</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Word document pasting with semantic headings</li>
                <li>• Visual size preservation during tag conversion</li>
                <li>• Custom syntax replacement ({{specialline}})</li>
                <li>• Full toolbar with headings, formatting, lists, tables</li>
                <li>• Both inline and modal editor modes</li>
                <li>• Clean HTML output for MongoDB</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🧪 Test Instructions</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Load sample content to see Word formatting</li>
                <li>• Paste content from Microsoft Word</li>
                <li>• Type {{specialline}} to test custom syntax</li>
                <li>• Use toolbar to edit headings and formatting</li>
                <li>• Try both inline and modal editor modes</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load Sample Word Content
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Open Modal Editor
            </button>
            <button
              onClick={() => setContent('')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Content
            </button>
          </div>
        </div>

        {/* Inline Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inline TinyMCE Editor</h2>
          <TinyMCEEditor
            ref={editorRef}
            initialValue={content}
            onSave={handleSave}
            isVisible={true}
            title="Inline Editor Test"
            placeholder="Start typing or paste content from Word documents..."
            height={500}
            showToolbar={true}
            showPreview={false}
            isInline={true}
            showSaveButton={true}
          />
        </div>

        {/* Modal Editor */}
        <TinyMCEEditor
          initialValue={content}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          isVisible={showModal}
          title="Modal Editor Test"
          placeholder="Start typing or paste content from Word documents..."
          height={600}
          showToolbar={true}
          showPreview={false}
          showSaveButton={true}
        />

        {/* Output Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated HTML Output</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
              {content || 'No content yet. Start typing or paste content to see the HTML output.'}
            </pre>
          </div>
        </div>

        {/* Frontend Rendering Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frontend Rendering Preview (How it will look on your website)</h2>
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div
              className="rich-html"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinyMCETest;

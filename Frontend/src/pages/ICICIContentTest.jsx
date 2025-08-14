import React, { useState } from 'react';
import structuredComplaintsService from '../services/structuredComplaintsService';
import TinyMCEEditor from '../components/admin/TinyMCEEditor.jsx';

const ICICIContentTest = () => {
  const [testContent, setTestContent] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContentChange = (content) => {
    setTestContent(content);
    
    if (content && content.trim().length > 0) {
      setIsProcessing(true);
      
      try {
        const structuredData = structuredComplaintsService.extractStructureFromContent(content);
        setExtractedData(structuredData);
        console.log('Extracted structured data:', structuredData);
      } catch (error) {
        console.error('Error extracting structure:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const sampleICICIContent = `
<h1>ICICI Bank Complaint Redressal Process</h1>

<p>If you have a complaint against ICICI Bank, follow these steps to get your issue resolved.</p>

<h2>Method 1: Online Complaint Portal</h2>
<p>Visit the ICICI Bank website and use their online complaint portal to submit your grievance.</p>
<ol>
<li>Go to www.icicibank.com</li>
<li>Click on "Customer Care"</li>
<li>Select "File a Complaint"</li>
<li>Fill in the required details</li>
<li>Submit your complaint</li>
</ol>

<h2>Method 2: Phone Banking</h2>
<p>Call ICICI Bank's customer care number to register your complaint.</p>
<ul>
<li>Call 1800-209-2090</li>
<li>Follow the IVR instructions</li>
<li>Speak to a customer service representative</li>
<li>Get a complaint reference number</li>
</ul>

<h3>Escalation Levels</h3>
<p>If your complaint is not resolved within 30 days, escalate to:</p>
<ul>
<li>Level 1: Branch Manager</li>
<li>Level 2: Regional Office</li>
<li>Level 3: Banking Ombudsman</li>
</ul>

<h3>Documents Required</h3>
<ul>
<li>Account statement</li>
<li>Transaction receipts</li>
<li>Identity proof</li>
<li>Address proof</li>
<li>Complaint details with dates</li>
</ul>

<h3>Resolution Timeline</h3>
<p>Standard resolution timeframes:</p>
<ul>
<li>Simple complaints: 3-5 days</li>
<li>Complex complaints: 7-10 days</li>
<li>Escalated complaints: 15-30 days</li>
</ul>

<div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
<h3 style="color: #92400e; margin: 0 0 8px 0;">Important Note</h3>
<p style="color: #92400e; margin: 0;">Always keep a copy of your complaint and reference number for future follow-up.</p>
</div>
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ICICI Bank Content Generation Test
          </h1>
          <p className="text-gray-600 mb-4">
            This page helps test the automatic content generation feature for ICICI bank complaints.
            Paste your content below and see how the left container (sidebar) is automatically generated.
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTestContent(sampleICICIContent)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load Sample ICICI Content
            </button>
            <button
              onClick={() => setTestContent('')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Content
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Editor</h2>
            <TinyMCEEditor
              initialValue={testContent}
              onSave={handleContentChange}
              isVisible={true}
              title="ICICI Bank Content Editor"
              placeholder="Paste your ICICI bank complaint content here..."
              height={400}
              isInline={true}
            />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Structure</h2>
            
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing content...
              </div>
            )}

            {extractedData && (
              <div className="space-y-4">
                {/* Main Heading */}
                {extractedData.mainHeading?.title && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-1">Main Heading</h3>
                    <p className="text-sm text-gray-700">{extractedData.mainHeading.title}</p>
                    {extractedData.mainHeading.description && (
                      <p className="text-xs text-gray-600 mt-1">{extractedData.mainHeading.description}</p>
                    )}
                  </div>
                )}

                {/* Complaint Methods */}
                {extractedData.complaintMethods?.methods?.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Complaint Methods ({extractedData.complaintMethods.methods.length})</h3>
                    <div className="space-y-2">
                      {extractedData.complaintMethods.methods.map((method, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-green-700">Method {method.methodNumber}: {method.title}</div>
                          {method.description && (
                            <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                          )}
                          {method.steps?.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-medium text-green-600">Steps: {method.steps.length}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escalation Levels */}
                {extractedData.escalationLevels?.levels?.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Escalation Levels ({extractedData.escalationLevels.levels.length})</h3>
                    <div className="space-y-2">
                      {extractedData.escalationLevels.levels.map((level, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-yellow-700">Level {level.levelNumber}: {level.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Required */}
                {extractedData.documentsRequired?.documents?.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Documents Required ({extractedData.documentsRequired.documents.length})</h3>
                    <div className="space-y-1">
                      {extractedData.documentsRequired.documents.map((doc, index) => (
                        <div key={index} className="text-sm text-gray-700">• {doc}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Timeline */}
                {extractedData.resolutionTimeline?.timelines?.length > 0 && (
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2">Resolution Timeline ({extractedData.resolutionTimeline.timelines.length})</h3>
                    <div className="space-y-2">
                      {extractedData.resolutionTimeline.timelines.map((timeline, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-indigo-700">{timeline.level}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                {extractedData.note && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-1">Important Note</h3>
                    <p className="text-sm text-gray-700">{extractedData.note}</p>
                  </div>
                )}

                {!extractedData.mainHeading?.title && 
                 extractedData.complaintMethods?.methods?.length === 0 &&
                 extractedData.escalationLevels?.levels?.length === 0 &&
                 extractedData.documentsRequired?.documents?.length === 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">No structured data could be extracted from the content. Try pasting content with clear headings and structure.</p>
                  </div>
                )}
              </div>
            )}

            {!extractedData && !isProcessing && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Paste content above to see the generated structure.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICICIContentTest; 
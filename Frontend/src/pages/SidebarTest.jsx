import React, { useState } from 'react';
import SidebarLayout from '../components/admin/SidebarLayout.jsx';

const SidebarTest = () => {
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [sidebarContent, setSidebarContent] = useState(`
<h3>Table of Contents</h3>
<ul>
<li><a href="#method1" style="text-decoration: none; color: #2563eb;">Method 1: Phone Banking</a></li>
<li><a href="#method2" style="text-decoration: none; color: #2563eb;">Method 2: Online Portal</a></li>
<li><a href="#method3" style="text-decoration: none; color: #2563eb;">Method 3: Branch Visit</a></li>
<li><a href="#method4" style="text-decoration: none; color: #2563eb;">Method 4: Email Support</a></li>
</ul>

<h4>Quick Links</h4>
<ul>
<li><a href="#contact" style="text-decoration: none; color: #2563eb;">Contact Information</a></li>
<li><a href="#faq" style="text-decoration: none; color: #2563eb;">FAQ Section</a></li>
<li><a href="#escalation" style="text-decoration: none; color: #2563eb;">Escalation Process</a></li>
</ul>
  `);

  const [mainContent, setMainContent] = useState(`
<h1 style="font-size: 24px;">HDFC Bank Complaint Resolution Guide</h1>

<p>This comprehensive guide provides multiple methods to file complaints with HDFC Bank and get your issues resolved quickly.</p>

<h2 style="font-size: 18px;">Method 1: Phone Banking</h2>
<p>Call HDFC Bank's dedicated customer service number:</p>
<ul>
<li>24/7 Customer Care: 1800-202-6161</li>
<li>NRI Support: 1800-202-6161</li>
<li>Credit Card Support: 1800-266-4332</li>
</ul>

<h2 style="font-size: 18px;">Method 2: Online Portal</h2>
<p>Visit the official HDFC Bank complaint portal:</p>
<ol>
<li>Go to: https://www.hdfcbank.com/personal/ways-to-bank/customer-service</li>
<li>Select "Customer" for general users</li>
<li>Click "Submit a Complaint"</li>
<li>Fill in your details and complaint description</li>
<li>Submit and note your complaint number</li>
</ol>

<h2 style="font-size: 18px;">Method 3: Branch Visit</h2>
<p>Visit your nearest HDFC Bank branch:</p>
<ul>
<li>Locate your nearest branch using the branch locator</li>
<li>Carry your ID proof and account details</li>
<li>Meet with the branch manager or customer service officer</li>
<li>Submit your complaint in writing</li>
</ul>

<h2 style="font-size: 18px;">Method 4: Email Support</h2>
<p>Send your complaint via email:</p>
<ul>
<li>General Inquiries: support@hdfcbank.com</li>
<li>Credit Card Issues: cardservices@hdfcbank.com</li>
<li>NRI Services: nri@hdfcbank.com</li>
</ul>

<h3 style="font-size: 16px;">Important Notes</h3>
<p>Always keep a record of your complaint number and follow up regularly. Most complaints are resolved within 7-10 working days.</p>
  `);

  const handleSaveSidebar = async (content) => {
    setSidebarContent(content);
    console.log('Sidebar content saved:', content);
  };

  const handleSaveMain = async (content) => {
    setMainContent(content);
    console.log('Main content saved:', content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sidebar Layout Test</h1>
              <p className="text-gray-600">Test the editable sidebar with table of contents</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-4 py-2 rounded-md font-medium ${
                  isAdminMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {isAdminMode ? 'Admin Mode' : 'View Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Layout */}
      <div className="h-[calc(100vh-80px)]">
        <SidebarLayout
          sidebarContent={sidebarContent}
          mainContent={mainContent}
          isAdminMode={isAdminMode}
          onSaveSidebar={handleSaveSidebar}
          onSaveMain={handleSaveMain}
          sidebarTitle="Table of Contents"
          mainTitle="HDFC Complaint Guide"
        />
      </div>
    </div>
  );
};

export default SidebarTest;




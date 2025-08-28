import React, { useRef } from 'react';
import { AlertCircle, Info, Phone, Mail, Globe, FileText, Search, Shield, ExternalLink, Save } from 'lucide-react';
import ComplaintsTabEditor from './admin/ComplaintsTabEditor';
import ComplaintsSidebar from './admin/ComplaintsSidebar';

const ComplaintsTab = ({ complaintsData, loading, error, complaintContent, isAdminMode = false, onSaveComplaints, onSaveStructuredComplaints, companyName = 'Company' }) => {
  const editorRef = useRef(null);
  
  // Debug logging

  console.log('🔍 isAdminMode:', isAdminMode);
  console.log('🔍 companyName:', companyName);
  console.log('🔍 onSaveComplaints:', typeof onSaveComplaints);
  console.log('🔍 onSaveStructuredComplaints:', typeof onSaveStructuredComplaints);
  console.log('🔍 editorRef.current:', editorRef.current);
  console.log('🔍 complaintContent length:', complaintContent?.length || 0);
  console.log('🔍 complaintContent preview:', complaintContent?.substring(0, 200));
  
  if (loading) {
    return (
      <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">Loading complaints data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Error loading complaints data: {error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have complaintContent but no structured complaintsData, show just the rich text content
  if (!complaintsData && complaintContent) {
    return (
      <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
            {/* Rich Text Complaint Content (SEO-visible in DOM) */}
            <div className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
              <div
                className="max-w-none rich-html"
                dangerouslySetInnerHTML={{ __html: complaintContent }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have neither complaintsData nor complaintContent
  if (!complaintsData && !complaintContent) {
    return (
      <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <div className="text-center text-gray-500">
              No complaints data available
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-4">
        {/* Sidebar (Left, 30%) */}
        <div className="flex flex-col gap-3 p-0 md:p-1">
          <ComplaintsSidebar
            complaintsData={complaintsData}
            isAdminMode={isAdminMode}
            onSaveStructuredData={onSaveStructuredComplaints}
            companyName={companyName}
          />
        </div>
        
        {/* Main Content (Right, 70%) */}
        <div className="flex flex-col gap-3 p-0 md:p-1">
          <div className="flex flex-col gap-4">
            
            {/* FULL EDIT MODE: Always-visible TinyMCE Editor */}
            {isAdminMode ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">Complaints Content Editor</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Full Edit Mode - Always Visible
                  </div>
                </div>
                
                {/* PROMINENT SAVE BUTTON ABOVE TEXT EDITOR - ALWAYS VISIBLE */}
                <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Save className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800 mb-1">Save Rich Text Editor Content</h3>
                        <p className="text-sm text-green-700">
                          💾 Saves to <strong>structuredComplaints</strong> collection via <strong>/api/structured-complaints/company/{companyName}</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 text-lg font-bold shadow-xl transition-all duration-200 flex items-center gap-3 hover:scale-105 border-2 border-green-500 transform hover:shadow-2xl"
                      onClick={() => {
                        console.log('🔘 PROMINENT SAVE BUTTON ABOVE TEXT EDITOR Clicked');
                        console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
                        console.log('🗄️ Collection: structuredComplaints');
                        if (editorRef.current) {
                          const content = editorRef.current.getContent();
                          console.log('📝 Content to save:', content.substring(0, 100) + '...');
                          if (onSaveComplaints) {
                            onSaveComplaints(content);
                          }
                        } else {
                          console.error('❌ Editor ref not available');
                        }
                      }}
                      type="button"
                    >
                      <Save className="w-6 h-6" />
                      Save Content to Backend
                    </button>
                  </div>
                </div>

                {/* Inline TinyMCE Editor */}
                <ComplaintsTabEditor
                  ref={editorRef}
                  complaintsData={complaintsData}
                  isAdminMode={isAdminMode}
                  onSave={onSaveComplaints}
                  companyName={companyName}
                  isFullEditMode={true}
                />
                
                {/* Floating Save Button - Always Visible in Admin Mode */}
                {isAdminMode && (
                  <div className="fixed bottom-6 right-6 z-[9999]">
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-700 hover:to-green-800 text-base font-bold shadow-2xl transition-all duration-200 flex items-center gap-3 hover:scale-110 border-2 border-white transform hover:shadow-2xl"
                      onClick={() => {
                        console.log('🔘 Floating Save Button Clicked');
                        console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
                        console.log('🗄️ Collection: structuredComplaints');
                        if (editorRef.current) {
                          const content = editorRef.current.getContent();
                          console.log('📝 Content to save:', content.substring(0, 100) + '...');
                          if (onSaveComplaints) {
                            onSaveComplaints(content);
                          }
                        } else {
                          console.error('❌ Editor ref not available');
                        }
                      }}
                      title="Save Content to Database"
                    >
                      <Save className="w-6 h-6" />
                      Save Content
                    </button>
                  </div>
                )}
                {/* Add clear button for admin */}
                <button
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all complaint tab information? This cannot be undone.')) {
                      // Clear local editor content only - don't save to backend immediately
                      // The editor will be cleared locally, user can save when ready
                    }
                  }}
                >
                  Clear Complaint Tab Information
                </button>
              </div>
            ) : (
              /* Regular Content Display for Non-Admin Users */
              <>
                {/* Rich Text Complaint Content (render exactly as saved) */}
                {complaintContent && (
                  <div className="mb-6">
                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      Complaint Redressal Process
                    </h3>
                    <div
                      className="max-w-none rich-html"
                      dangerouslySetInnerHTML={{ __html: complaintContent }}
                    />
                  </div>
                )}

                {/* Complaint Methods */}
                {complaintsData.complaintMethods && (
                  <div>
                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      {complaintsData.complaintMethods.heading?.text}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {complaintsData.complaintMethods.heading?.subText}
                    </p>
                    
                    {complaintsData.complaintMethods.methods?.map((method, index) => (
                      <div key={index} className="mb-6 p-4 border border-blue-100 rounded-lg" id={`method-${method.methodNumber}`}>
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Method {method.methodNumber}: {method.title}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">{method.description}</p>
                        
                        {/* Steps */}
                        {method.steps?.map((step, stepIndex) => (
                          <div key={stepIndex} className="mb-3 ml-4">
                            <h5 className="font-medium text-blue-700 mb-1">
                              Step {step.stepNumber}: {step.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            {step.details?.map((detail, detailIndex) => (
                              <div key={detailIndex} className="text-sm text-gray-700 ml-4 mb-1">
                                • {detail}
                              </div>
                            ))}
                          </div>
                        ))}
                        
                        {/* Contact Info */}
                        {method.contactInfo && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <h6 className="font-medium text-blue-800 mb-2">Contact Information:</h6>
                            {method.contactInfo.phoneNumbers?.map((phone, phoneIndex) => (
                                  <div key={phoneIndex} className="flex items-center gap-2 mb-1">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-mono text-green-700">{phone}</span>
                              </div>
                            ))}
                                {method.contactInfo.emailAddresses?.map((email, emailIndex) => (
                                  <div key={emailIndex} className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-700">{email}</span>
                              </div>
                                ))}
                                {method.contactInfo.websites?.map((website, websiteIndex) => (
                                  <div key={websiteIndex} className="flex items-center gap-2 mb-1">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 hover:underline">
                                      {website.title}
                                </a>
                              </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                )}

                {/* Escalation Levels */}
                {complaintsData.escalationLevels && (
                  <div>
                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      {complaintsData.escalationLevels.heading?.text}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {complaintsData.escalationLevels.heading?.subText}
                    </p>
                    
                    {complaintsData.escalationLevels.levels?.map((level, index) => (
                      <div key={index} className="mb-6 p-4 border border-blue-100 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Level {level.levelNumber}: {level.title}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">{level.description}</p>
                        
                        {/* Contact Details */}
                        {level.contactDetails && (
                              <div className="space-y-2">
                            {level.contactDetails.phoneNumbers?.map((phone, phoneIndex) => (
                                  <div key={phoneIndex} className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-mono text-green-700">{phone}</span>
                              </div>
                            ))}
                                {level.contactDetails.emailAddresses?.map((email, emailIndex) => (
                                  <div key={emailIndex} className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-700">{email}</span>
                                  </div>
                                ))}
                                {level.contactDetails.websites?.map((website, websiteIndex) => (
                                  <div key={websiteIndex} className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 hover:underline">
                                      {website.title}
                                </a>
                              </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                )}

                {/* Documents Required */}
                {complaintsData.documentsRequired && (
                  <div>
                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      {complaintsData.documentsRequired.heading?.text}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {complaintsData.documentsRequired.heading?.subText}
                    </p>
                    
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                      {complaintsData.documentsRequired.documents?.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resolution Timeline */}
                {complaintsData.resolutionTimeline && (
                  <div>
                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      {complaintsData.resolutionTimeline.heading?.text}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {complaintsData.resolutionTimeline.heading?.subText}
                    </p>
                    
                    <div className="space-y-3">
                      {complaintsData.resolutionTimeline.timelines?.map((timeline, index) => (
                        <div key={index} className="p-4 border border-blue-100 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-blue-800">{timeline.level}</h4>
                            <span className="text-sm font-semibold text-green-600">{timeline.days}</span>
                          </div>
                          <p className="text-sm text-gray-700">{timeline.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                {complaintsData.note && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Important Note</span>
                    </div>
                    <p className="text-sm text-yellow-700">{complaintsData.note}</p>
                  </div>
                    )}


              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsTab; 
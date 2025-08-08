import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Edit3, Save, X, Eye, EyeOff, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import TinyMCEEditor from './TinyMCEEditor';

const ComplaintsTabEditor = forwardRef(({
  complaintsData,
  isAdminMode = false,
  onSave,
  onCancel,
  isVisible = false,
  companyName = 'Company',
  isFullEditMode = false
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const editorComponentRef = useRef(null);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (editorComponentRef.current) {
        return editorComponentRef.current.getContent();
      }
      return editorContent;
    },
    setContent: (newContent) => {
      setEditorContent(newContent);
      if (editorComponentRef.current) {
        editorComponentRef.current.setContent(newContent);
      }
    }
  }));

  // Initialize editor content from complaints data
  useEffect(() => {
    if (complaintsData) {
      // Extract rich text content from complaints data
      let content = '';
      
      // If there's already rich text content, use it
      if (complaintsData.richTextContent) {
        content = complaintsData.richTextContent;
      } else {
        // Generate content from structured data
        content = generateContentFromStructuredData(complaintsData);
      }
      
      setEditorContent(content);
    }
  }, [complaintsData]);

  const generateContentFromStructuredData = (data) => {
    let content = '';
    
    // Main heading
    if (data.mainHeading?.title) {
      content += `<h1>${data.mainHeading.title}</h1>`;
    }
    
    if (data.mainHeading?.description) {
      content += `<p>${data.mainHeading.description}</p>`;
    }

    // Complaint Methods
    if (data.complaintMethods?.methods) {
      content += `<h2>Complaint Methods</h2>`;
      if (data.complaintMethods.heading?.subText) {
        content += `<p>${data.complaintMethods.heading.subText}</p>`;
      }
      
      data.complaintMethods.methods.forEach((method, index) => {
        content += `<h3>Method ${method.methodNumber}: ${method.title}</h3>`;
        content += `<p>${method.description}</p>`;
        
        if (method.steps) {
          content += `<ol>`;
          method.steps.forEach((step, stepIndex) => {
            content += `<li><strong>Step ${step.stepNumber}: ${step.title}</strong><br>${step.description}`;
            if (step.details) {
              content += `<ul>`;
              step.details.forEach(detail => {
                content += `<li>${detail}</li>`;
              });
              content += `</ul>`;
            }
            content += `</li>`;
          });
          content += `</ol>`;
        }
        
        if (method.contactInfo) {
          content += `<div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">`;
          content += `<h4>Contact Information:</h4>`;
          if (method.contactInfo.phoneNumbers) {
            method.contactInfo.phoneNumbers.forEach(phone => {
              content += `<p><strong>Phone:</strong> ${phone}</p>`;
            });
          }
          if (method.contactInfo.email) {
            content += `<p><strong>Email:</strong> <a href="mailto:${method.contactInfo.email}">${method.contactInfo.email}</a></p>`;
          }
          if (method.contactInfo.website) {
            content += `<p><strong>Website:</strong> <a href="${method.contactInfo.website}" target="_blank">Visit Website</a></p>`;
          }
          if (method.contactInfo.workingHours) {
            content += `<p><strong>Working Hours:</strong> ${method.contactInfo.workingHours}</p>`;
          }
          content += `</div>`;
        }
      });
    }

    // Escalation Levels
    if (data.escalationLevels?.levels) {
      content += `<h2>Escalation Levels</h2>`;
      if (data.escalationLevels.heading?.subText) {
        content += `<p>${data.escalationLevels.heading.subText}</p>`;
      }
      
      data.escalationLevels.levels.forEach((level, index) => {
        content += `<h3>Level ${level.levelNumber}: ${level.title}</h3>`;
        content += `<p>${level.description}</p>`;
        
        if (level.contactDetails) {
          content += `<div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">`;
          content += `<h4>${level.contactDetails.department}</h4>`;
          if (level.contactDetails.phoneNumbers) {
            level.contactDetails.phoneNumbers.forEach(phone => {
              content += `<p><strong>Phone:</strong> ${phone}</p>`;
            });
          }
          if (level.contactDetails.email) {
            content += `<p><strong>Email:</strong> <a href="mailto:${level.contactDetails.email}">${level.contactDetails.email}</a></p>`;
          }
          if (level.contactDetails.workingHours) {
            content += `<p><strong>Working Hours:</strong> ${level.contactDetails.workingHours}</p>`;
          }
          if (level.contactDetails.address) {
            content += `<p><strong>Address:</strong> ${level.contactDetails.address}</p>`;
          }
          content += `</div>`;
        }
        
        content += `<p><strong>Resolution Timeline:</strong> ${level.resolutionTimeline}</p>`;
        if (level.escalationNote) {
          content += `<p style="color: #2563eb; font-weight: 500;">${level.escalationNote}</p>`;
        }
      });
    }

    // Regional Nodal Officers
    if (data.regionalNodalOfficers?.table?.rows) {
      content += `<h2>Regional Nodal Officers</h2>`;
      content += `<p>${data.regionalNodalOfficers.description}</p>`;
      
      content += `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">`;
      content += `<thead style="background-color: #f8fafc;">`;
      content += `<tr>`;
      data.regionalNodalOfficers.table.headers.forEach(header => {
        content += `<th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600;">${header}</th>`;
      });
      content += `</tr>`;
      content += `</thead>`;
      content += `<tbody>`;
      data.regionalNodalOfficers.table.rows.forEach((row, index) => {
        content += `<tr style="${index % 2 === 0 ? 'background-color: white;' : 'background-color: #f8fafc;'}">`;
        content += `<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">${row.region}</td>`;
        content += `<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">${row.statesCovered}</td>`;
        content += `<td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${row.emailId}">${row.emailId}</a></td>`;
        content += `</tr>`;
      });
      content += `</tbody>`;
      content += `</table>`;
    }

    // RBI Banking Ombudsman
    if (data.rbiOmbudsman) {
      content += `<h2>RBI Banking Ombudsman</h2>`;
      content += `<p>${data.rbiOmbudsman.description}</p>`;
      
      if (data.rbiOmbudsman.portalInfo) {
        content += `<div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">`;
        content += `<h3>Portal Information:</h3>`;
        content += `<p><strong>Website:</strong> <a href="${data.rbiOmbudsman.portalInfo.url}" target="_blank">RBI CMS Portal</a></p>`;
        content += `<p><strong>Cost:</strong> ${data.rbiOmbudsman.portalInfo.cost}</p>`;
        content += `<p><strong>Resolution Timeline:</strong> ${data.rbiOmbudsman.portalInfo.resolutionTimeline}</p>`;
        content += `</div>`;
      }
      
      if (data.rbiOmbudsman.requirements) {
        content += `<h3>Requirements:</h3>`;
        content += `<ul>`;
        data.rbiOmbudsman.requirements.forEach(req => {
          content += `<li>${req}</li>`;
        });
        content += `</ul>`;
      }
    }

    // Best Practices
    if (data.bestPractices?.practices) {
      content += `<h2>Best Practices</h2>`;
      if (data.bestPractices.subtitle) {
        content += `<p>${data.bestPractices.subtitle}</p>`;
      }
      content += `<ul>`;
      data.bestPractices.practices.forEach(practice => {
        content += `<li>${practice}</li>`;
      });
      content += `</ul>`;
    }

    // FAQs
    if (data.faqs?.questions) {
      content += `<h2>Frequently Asked Questions</h2>`;
      if (data.faqs.heading?.subText) {
        content += `<p>${data.faqs.heading.subText}</p>`;
      }
      
      data.faqs.questions.forEach((faq, index) => {
        content += `<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">`;
        content += `<h3>Q: ${faq.question}</h3>`;
        content += `<p><strong>A:</strong> ${faq.answer}</p>`;
        content += `</div>`;
      });
    }

    // Documents Required
    if (data.documentsRequired?.documents) {
      content += `<h2>Documents Required</h2>`;
      if (data.documentsRequired.heading?.subText) {
        content += `<p>${data.documentsRequired.heading.subText}</p>`;
      }
      content += `<ul>`;
      data.documentsRequired.documents.forEach(doc => {
        content += `<li>${doc}</li>`;
      });
      content += `</ul>`;
    }

    // Resolution Timeline
    if (data.resolutionTimeline?.timelines) {
      content += `<h2>Resolution Timeline</h2>`;
      if (data.resolutionTimeline.heading?.subText) {
        content += `<p>${data.resolutionTimeline.heading.subText}</p>`;
      }
      
      data.resolutionTimeline.timelines.forEach((timeline, index) => {
        content += `<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">`;
        content += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">`;
        content += `<h3>${timeline.level}</h3>`;
        content += `<span style="color: #059669; font-weight: 600;">${timeline.days}</span>`;
        content += `</div>`;
        content += `<p>${timeline.description}</p>`;
        content += `</div>`;
      });
    }

    // Note
    if (data.note) {
      content += `<div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">`;
      content += `<h3 style="color: #92400e; margin: 0 0 8px 0;">Important Note</h3>`;
      content += `<p style="color: #92400e; margin: 0;">${data.note}</p>`;
      content += `</div>`;
    }

    return content;
  };

  const handleSaveContent = async (content) => {
    console.log('🚀 ComplaintsTabEditor handleSaveContent STARTED');
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      console.log('🔍 ComplaintsTabEditor handleSaveContent called with content:', content.substring(0, 100) + '...');
      console.log('🔍 Content length:', content.length);
      console.log('🔍 Company name:', companyName);
      
      // Prepare the data to save in the correct format for structured complaints API
      const structuredData = {
        richTextContent: content,
        mainHeading: {
          title: 'Complaint Redressal Process',
          description: `Complaint redressal process for ${companyName}`
        },
        processingStatus: 'completed',
        lastProcessed: new Date()
      };
      
      console.log('📤 ComplaintsTabEditor sending structuredData:', structuredData);
      console.log('📤 onSave function type:', typeof onSave);
      
      if (!onSave) {
        console.error('❌ onSave function is not provided');
        throw new Error('Save function not provided');
      }
      
      console.log('📤 Calling onSave function...');
      await onSave(structuredData);
      console.log('✅ ComplaintsTabEditor save successful');
      
      setSaveStatus('success');
      setShowEditor(false);
      
      // Clear success status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('❌ ComplaintsTabEditor save error:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      console.log('🏁 ComplaintsTabEditor handleSaveContent FINISHED');
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setSaveStatus(null);
    if (onCancel) {
      onCancel();
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved successfully!';
      case 'error':
        return 'Error saving content';
      default:
        return '';
    }
  };

  if (!isAdminMode) {
    return null;
  }

  // Full Edit Mode: Show editor inline
  if (isFullEditMode) {
    return (
      <div className="mb-6">
        {/* Sticky Save Button - Always Visible at Top */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Complaints Content Editor</span>
            </div>
            
            <div className="flex items-center gap-3">
              {saveStatus && (
                <div className="flex items-center gap-2 text-sm">
                  {getSaveStatusIcon()}
                  <span className={saveStatus === 'error' ? 'text-red-600' : saveStatus === 'success' ? 'text-green-600' : 'text-blue-600'}>
                    {getSaveStatusText()}
                  </span>
                </div>
              )}
              {/* Main Save Button - Always Visible */}
              <button
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
                onClick={() => {
                  if (editorComponentRef.current) {
                    const content = editorComponentRef.current.getContent();
                    handleSaveContent(content);
                  }
                }}
                disabled={isSaving}
                type="button"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save to Database
                  </>
                )}
              </button>
              {/* Auto-Convert Headings Button */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                onClick={() => {
                  if (editorComponentRef.current && editorComponentRef.current.autoConvertHeadings) {
                    editorComponentRef.current.autoConvertHeadings();
                  }
                }}
                type="button"
              >
                Auto-Convert Headings
              </button>
            </div>
          </div>
        </div>
        
        {/* Inline TinyMCE Editor */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TinyMCEEditor
            ref={editorComponentRef}
            initialValue={editorContent}
            onSave={handleSaveContent}
            onCancel={handleCancel}
            isVisible={true}
            title={`Edit ${companyName} Complaints Content`}
            placeholder="Start typing or paste content from Word documents. You can include headings, tables, lists, and formatted text..."
            height={500}
            showToolbar={true}
            showPreview={true}
            isInline={true}
            showSaveButton={true}
          />
        </div>
        {/* Clear Button for Admins */}
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all complaint tab information? This cannot be undone.')) {
              // Clear local editor content only
              setEditorContent('');
              if (editorComponentRef.current) {
                editorComponentRef.current.setContent('');
              }
              // Don't save to backend immediately - let user save when ready
            }
          }}
        >
          Clear Complaint Tab Information
        </button>
      </div>
    );
  }

  // Modal Edit Mode: Show editor in modal
  return (
    <>
      {/* Editor Toggle Button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Complaints Content Editor</span>
        </div>
        
        <div className="flex items-center gap-2">
          {saveStatus && (
            <div className="flex items-center gap-2 text-sm">
              {getSaveStatusIcon()}
              <span className={saveStatus === 'error' ? 'text-red-600' : saveStatus === 'success' ? 'text-green-600' : 'text-blue-600'}>
                {getSaveStatusText()}
              </span>
            </div>
          )}
          
          {/* Main Save Button for Modal Mode */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md"
            onClick={() => {
              if (editorComponentRef.current) {
                const content = editorComponentRef.current.getContent();
                handleSaveContent(content);
              }
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save to Database
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Content
          </button>
        </div>
      </div>

      {/* TinyMCE Editor */}
      <TinyMCEEditor
        ref={editorComponentRef}
        initialValue={editorContent}
        onSave={handleSaveContent}
        onCancel={handleCancel}
        isVisible={showEditor}
        title={`Edit ${companyName} Complaints Content`}
        placeholder="Start typing or paste content from Word documents. You can include headings, tables, lists, and formatted text..."
        height={600}
        showToolbar={true}
        showPreview={true}
        showSaveButton={false}
      />
    </>
  );
});

export default ComplaintsTabEditor; 
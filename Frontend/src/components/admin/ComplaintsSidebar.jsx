import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  Globe,
  Edit3,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';
import structuredComplaintsService from '../../services/structuredComplaintsService.js';
import TinyMCEEditor from './TinyMCEEditor.jsx';

const ComplaintsSidebar = ({
  complaintsData,
  isAdminMode = false,
  onSaveStructuredData,
  companyName = 'Company'
}) => {
  const [structuredData, setStructuredData] = useState({
    mainHeading: { title: '', description: '' },
    complaintMethods: {
      heading: { text: 'How to File a Complaint', subText: 'Choose from multiple methods to file your complaint' },
      methods: []
    },
    escalationLevels: {
      heading: { text: 'Escalation Levels', subText: 'Follow these levels if your complaint is not resolved' },
      levels: []
    },
    documentsRequired: {
      heading: { text: 'Documents Required', subText: 'Prepare these documents before filing your complaint' },
      documents: []
    },
    resolutionTimeline: {
      heading: { text: 'Resolution Timeline', subText: 'Expected timeframes for complaint resolution' },
      timelines: []
    },
    note: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (complaintsData) {
      setStructuredData(complaintsData);
    }
  }, [complaintsData]);

  // TinyMCE Configuration for Word processing
  const tinymceConfig = {
    apiKey: 'gi4afvtz4n48c4w80tpqcbmgql0x0w42677fzmr8j0va9zsn',
    height: 400,
    menubar: false,
    branding: false,
    elementpath: false,
    statusbar: true,
    resize: true,
    // Disable all validation and warnings
    domain_validation: false,
    api_key_validation: false,
    notifications: false,
    branding: false,
    elementpath: false,
    // Disable domain validation completely
    domain_validation: false,
    // Disable API key validation
    api_key_validation: false,
    // Disable all notifications
    notifications: false,
    // Disable branding and warnings
    branding: false,
    // Disable element path
    elementpath: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'paste', 'formatselect', 'codesample'
    ],
    toolbar: [
      'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
      'bullist numlist outdent indent | link image table | code preview fullscreen',
      'fontfamily fontsize blocks | forecolor backcolor | removeformat'
    ].join(' | '),
    content_style: `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.7; color: #222; margin: 0; padding: 18px; background: #fff; }
      h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; color: #1e293b; }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.2rem; }
      h4 { font-size: 1.1rem; }
      p { margin: 0.5em 0 1.2em 0; }
      ul, ol { margin: 0.5em 0 1.2em 2em; }
      li { margin: 0.3em 0; }
      table { border-collapse: collapse; width: 100%; margin: 1.5em 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.07); }
      th { background: #f8fafc; color: #1e293b; font-weight: 600; padding: 12px 16px; border-bottom: 2px solid #e2e8f0; }
      td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
      tr:nth-child(even) { background: #f8fafc; }
      tr:hover { background: #f1f5f9; }
      /* Hide TinyMCE warning banners */
      .tox-notification--warning,
      .tox-notification--error,
      .tox-notification--info {
        display: none !important;
      }
      /* Hide domain validation warnings */
      [data-mce-bogus="all"] {
        display: none !important;
      }
      /* Hide all notification banners */
      .tox-notification {
        display: none !important;
      }
      /* Hide specific warning messages */
      .tox-notification--warning,
      .tox-notification--error,
      .tox-notification--info {
        display: none !important;
      }
      /* Hide domain validation warnings */
      [data-mce-bogus="all"] {
        display: none !important;
      }
    `,
    paste_as_text: false,
    paste_enable_default_filters: true,
    paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,br,ul,ol,li,table,tr,td,th,tbody,thead,img,a,link,span,div",
    paste_retain_style_properties: "color background-color font-size font-family",
    paste_merge_formats: true,
    paste_convert_word_fake_lists: true,
    paste_remove_styles_if_webkit: false,
    table_default_styles: { width: '100%', borderCollapse: 'collapse' },
    table_default_attributes: { border: '1' },
    table_class_list: [ { title: 'None', value: '' }, { title: 'Bordered', value: 'table-bordered' }, { title: 'Striped', value: 'table-striped' } ],
    setup: (editor) => {
      // Enhanced paste handling with better content processing
      editor.on('paste', (e) => {
        // Process content after a short delay to ensure it's fully pasted
        setTimeout(() => { 
          const content = editor.getContent();
          if (content && content.trim().length > 0) {
            processContent(content);
          }
        }, 200);
      });
      
      // Process content on change with debouncing
      let changeTimeout;
      editor.on('change', () => {
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(() => {
          const content = editor.getContent();
          setEditorContent(content);
          if (content && content.trim().length > 0) {
            processContent(content);
          }
        }, 500);
      });
      
      // Remove any warning notifications
      editor.on('init', () => {
        const notifications = document.querySelectorAll('.tox-notification');
        notifications.forEach(notification => {
          notification.style.display = 'none';
        });
      });
      
      // Hide warnings on paste
      editor.on('paste', () => {
        setTimeout(() => {
          const notifications = document.querySelectorAll('.tox-notification');
          notifications.forEach(notification => {
            notification.style.display = 'none';
          });
        }, 100);
      });
    },
    paste_preprocess: (plugin, args) => {
      let content = args.content;
      
      // Enhanced Word document processing
      // Remove Word-specific tags and styles
      content = content.replace(/<o:p[^>]*>/g, '');
      content = content.replace(/<\/o:p>/g, '');
      content = content.replace(/<o:CustomDocumentProperties[^>]*>.*?<\/o:CustomDocumentProperties>/g, '');
      content = content.replace(/<w:WordDocument[^>]*>.*?<\/w:WordDocument>/g, '');
      content = content.replace(/<m:defJc[^>]*>.*?<\/m:defJc>/g, '');
      content = content.replace(/<m:wrapIndent[^>]*>.*?<\/m:wrapIndent>/g, '');
      content = content.replace(/<m:intLim[^>]*>.*?<\/m:intLim>/g, '');
      content = content.replace(/<m:naryLim[^>]*>.*?<\/m:naryLim>/g, '');
      
      // Convert Word headings to HTML headings with improved detection
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 1"[^"]*"[^>]*>/gi, '<h1>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 2"[^"]*"[^>]*>/gi, '<h2>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 3"[^"]*"[^>]*>/gi, '<h3>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 4"[^"]*"[^>]*>/gi, '<h4>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 5"[^"]*"[^>]*>/gi, '<h5>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 6"[^"]*"[^>]*>/gi, '<h6>');
      
      // Additional heading detection for bold/large text
      content = content.replace(/<p[^>]*style="[^"]*font-weight:\s*bold[^"]*"[^>]*>/gi, '<h2>');
      content = content.replace(/<p[^>]*style="[^"]*font-size:\s*[2-3][0-9]pt[^"]*"[^>]*>/gi, '<h2>');
      
      // Clean up paragraph tags that should be headings
      content = content.replace(/<\/p>(?=\s*<h[1-6]>)/gi, '');
      content = content.replace(/(?<=<\/h[1-6]>)\s*<p[^>]*>/gi, '');
      
      // Remove most inline styles except for tables
      content = content.replace(/(<(?!table|th|td)[a-z]+)([^>]*style="[^"]*")([^>]*>)/gi, '$1$3');
      
      // Add spacing between blocks
      content = content.replace(/<\/h([1-6])>/g, '</h$1>\n');
      content = content.replace(/<\/p>/g, '</p>\n');
      content = content.replace(/<\/li>/g, '</li>\n');
      
      // Clean up extra whitespace
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/>\s+</g, '><');
      
      args.content = content;
    }
  };

  // Process content and extract structured data
  const processContent = (content) => {
    if (!content) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Processing content for automatic structure extraction...');
      console.log('Content length:', content.length);
      
      // Use the service to extract structure
      const newStructuredData = structuredComplaintsService.extractStructureFromContent(content);
      
      console.log('Extracted structured data:', newStructuredData);
      
      // Update company name in description
      if (newStructuredData.mainHeading.title) {
        newStructuredData.mainHeading.description = 'Complaint redressal process for ' + companyName;
      }
      
      setStructuredData(newStructuredData);
      
      // Auto-save to database
      handleSaveStructuredData(newStructuredData);
      
    } catch (error) {
      console.error('Error processing content:', error);
      // Show user-friendly error message
      alert('There was an issue processing your content. Please try pasting again or check the console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveStructuredData = async (data) => {
    if (!onSaveStructuredData) return;
    
    setSaveStatus('saving');
    try {
      await onSaveStructuredData(data);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving structured data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Processing...';
      case 'success': return 'Auto-saved!';
      case 'error': return 'Save failed';
      default: return '';
    }
  };

  return (
    <div className="bg-white border border-blue-200 rounded-2xl shadow-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">Content Structure</span>
        </div>
        
        {isAdminMode && (
          <div className="flex items-center gap-2">
            {saveStatus && (
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon()}
                <span className={
                  saveStatus === 'error' ? 'text-red-600' : 
                  saveStatus === 'success' ? 'text-green-600' : 
                  'text-blue-600'
                }>
                  {getStatusText()}
                </span>
              </div>
            )}
            
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {showEditor ? 'Hide Editor' : 'Show Editor'}
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Headings Navigation */}
      {structuredData.complaintMethods?.methods?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-base font-bold text-blue-700 mb-2">Jump to Method</h3>
          <ul className="space-y-2">
            {structuredData.complaintMethods.methods.map((method, idx) => (
              <li key={idx}>
                <button
                  className="text-left w-full px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition-colors text-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    const anchor = document.getElementById(`method-${method.methodNumber}`);
                    if (anchor) {
                      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {`Method ${method.methodNumber}${method.title ? ': ' + method.title : ''}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Word Document Editor */}
      {isAdminMode && showEditor && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Paste Word Document</span>
            </div>
            <p className="text-xs text-gray-600">
              Paste your Word document here. The system will automatically extract and structure the content.
            </p>
          </div>
          <TinyMCEEditor
            initialValue={editorContent}
            onSave={(content) => {
              setEditorContent(content);
              processContent(content);
            }}
            isVisible={true}
            title="Word Document Processor"
            placeholder="Paste your Word document here... The system will automatically process and structure the content."
            height={400}
            showToolbar={true}
            showPreview={false}
            isInline={true}
            showSaveButton={false}
          />
          <div className="flex justify-end p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => processContent(editorContent)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Regenerate Sidebar
            </button>
          </div>
          {isProcessing && (
            <div className="p-3 bg-blue-50 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing content...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Structured Data Display */}
      <div className="space-y-4">
        {/* Main Heading */}
        {structuredData.mainHeading?.title && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-1">Main Heading</h3>
            <p className="text-sm text-gray-700">{structuredData.mainHeading.title}</p>
            {structuredData.mainHeading.description && (
              <p className="text-xs text-gray-600 mt-1">{structuredData.mainHeading.description}</p>
            )}
          </div>
        )}

        {/* Complaint Methods */}
        {structuredData.complaintMethods?.methods?.length > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Complaint Methods</h3>
            <div className="space-y-2">
              {structuredData.complaintMethods.methods.map((method, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-green-700">Method {method.methodNumber}: {method.title}</div>
                  {method.description && (
                    <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                  )}
                  {method.steps?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-green-600">Steps:</div>
                      <div className="ml-2">
                        {method.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="text-xs text-gray-600">
                            {step.stepNumber}. {step.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Escalation Levels */}
        {structuredData.escalationLevels?.levels?.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Escalation Levels</h3>
            <div className="space-y-2">
              {structuredData.escalationLevels.levels.map((level, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-yellow-700">Level {level.levelNumber}: {level.title}</div>
                  {level.description && (
                    <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Required */}
        {structuredData.documentsRequired?.documents?.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Documents Required</h3>
            <div className="space-y-1">
              {structuredData.documentsRequired.documents.map((doc, index) => (
                <div key={index} className="text-sm text-gray-700">• {doc}</div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Timeline */}
        {structuredData.resolutionTimeline?.timelines?.length > 0 && (
          <div className="p-3 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-2">Resolution Timeline</h3>
            <div className="space-y-2">
              {structuredData.resolutionTimeline.timelines.map((timeline, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-indigo-700">{timeline.level}</div>
                  <div className="text-xs text-gray-600">{timeline.days} - {timeline.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {structuredData.note && (
          <div className="p-3 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-1">Important Note</h3>
            <p className="text-sm text-gray-700">{structuredData.note}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isAdminMode && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveStructuredData(structuredData)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Structure
            </button>
            
            <button
              onClick={() => setStructuredData({
                mainHeading: { title: '', description: '' },
                complaintMethods: { heading: { text: '', subText: '' }, methods: [] },
                escalationLevels: { heading: { text: '', subText: '' }, levels: [] },
                documentsRequired: { heading: { text: '', subText: '' }, documents: [] },
                resolutionTimeline: { heading: { text: '', subText: '' }, timelines: [] },
                note: ''
              })}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsSidebar; 
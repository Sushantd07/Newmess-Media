import React, { useState } from 'react';
import { Settings, Save, X, Edit3, Eye, Layout, Type } from 'lucide-react';
import CompanyPageEditor from './CompanyPageEditor';

const AdminToggle = ({ companyData, onSave, onInlineSave, isAdminMode, setIsAdminMode, onOpenCanvaEditor, onRefresh }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showInlineMode, setShowInlineMode] = useState(false);
  const [showAutoConvert, setShowAutoConvert] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      await onSave(updatedData);
      setShowEditor(false);
      setIsAdminMode(false);
    } catch (error) {
      console.error('Error saving company data:', error);
    }
  };

  const handleInlineSave = async (field, value) => {
    try {
      if (onInlineSave) {
        await onInlineSave(field, value);
      }
    } catch (error) {
      console.error('Error saving inline edit:', error);
    }
  };

  const handleAutoConvertHeadings = () => {
    let convertedCount = 0;
    
    // Method 1: Try to find and click existing auto-convert buttons
    const autoConvertButtons = document.querySelectorAll('button[onclick*="autoConvertHeadings"], button:contains("Auto-Convert"), button:contains("Auto-Convert Headings")');
    autoConvertButtons.forEach(button => {
      try {
        button.click();
        convertedCount++;
      } catch (error) {
        console.log('Could not click auto-convert button:', error);
      }
    });
    
    // Also look for buttons with specific text content
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      const buttonText = button.textContent || button.innerText;
      if (buttonText && (buttonText.includes('Auto-Convert') || buttonText.includes('Auto Convert'))) {
        try {
          button.click();
          convertedCount++;
        } catch (error) {
          console.log('Could not click auto-convert button:', error);
        }
      }
    });
    
    // Method 2: Try to find textarea editors and apply auto-convert logic
    const textareas = document.querySelectorAll('textarea[data-auto-convert="true"]');
    textareas.forEach(textarea => {
      try {
        let content = textarea.value;
        
        // Apply auto-convert logic for plain text
        // Convert lines starting with numbers to headings
        content = content.replace(/^(\d+\.\s*)(.+)$/gm, '<h2>$2</h2>');
        
        // Convert all-caps lines to h2
        content = content.replace(/^([A-Z\s\d\-\.,:;!?]{8,})$/gm, '<h2>$1</h2>');
        
        // Convert lines with ** to h2
        content = content.replace(/^\*\*(.+?)\*\*$/gm, '<h2>$1</h2>');
        
        textarea.value = content;
        convertedCount++;
      } catch (error) {
        console.log('Could not convert textarea content:', error);
      }
    });
    
    // Method 3: Try to find any elements with autoConvertHeadings function and call them
    const elementsWithAutoConvert = document.querySelectorAll('[data-auto-convert="true"]');
    elementsWithAutoConvert.forEach(element => {
      if (element.autoConvertHeadings && typeof element.autoConvertHeadings === 'function') {
        try {
          element.autoConvertHeadings();
          convertedCount++;
        } catch (error) {
          console.log('Could not call autoConvertHeadings function:', error);
        }
      }
    });
    
    // Show feedback
    if (convertedCount > 0) {
      alert(`Auto-converted headings in ${convertedCount} editor(s)!`);
    } else {
      alert('No editors found or no content to convert. Make sure you have content in the editor first.');
    }
  };

  return (
    <>
      {/* Admin Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          {!isAdminMode ? (
            <button
              onClick={() => setIsAdminMode(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Admin Mode
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowInlineMode(!showInlineMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  showInlineMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <Eye className="h-4 w-4" />
                {showInlineMode ? 'Inline Active' : 'Inline Edit'}
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Full Editor
              </button>
              <button
                onClick={handleAutoConvertHeadings}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
              >
                <Type className="h-4 w-4" />
                Auto Headings
              </button>
              <button
                onClick={onOpenCanvaEditor}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                <Layout className="h-4 w-4" />
                Live Page Editor
              </button>
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  setShowInlineMode(false);
                  setShowAutoConvert(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
                Exit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Admin Mode Overlay */}
      {isAdminMode && (
        <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none">
          <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 pointer-events-auto max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Admin Mode Active</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {showInlineMode ? (
                <>
                  <p className="text-green-600 font-medium">• Inline Editing Mode</p>
                  <p>• Click on any text to edit directly</p>
                  <p>• Press Enter to save, Escape to cancel</p>
                  <p>• Changes save automatically</p>
                </>
              ) : showAutoConvert ? (
                <>
                  <p className="text-orange-600 font-medium">• Auto Headings Mode</p>
                  <p>• Click "Auto Headings" to convert text to headings</p>
                  <p>• Automatically converts bold/large text to proper headings</p>
                  <p>• Improves SEO and page structure</p>
                </>
              ) : (
                <>
                  <p>• Click "Inline Edit" to edit text directly on page</p>
                  <p>• Click "Full Editor" to open the complete editor</p>
                  <p>• Click "Auto Headings" to convert text to headings</p>
                  <p>• All changes are saved automatically</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company Page Editor */}
      <CompanyPageEditor
        companyData={companyData}
        onSave={handleSave}
        onCancel={() => setShowEditor(false)}
        onRefresh={onRefresh}
        isVisible={showEditor}
      />
    </>
  );
};

export default AdminToggle; 
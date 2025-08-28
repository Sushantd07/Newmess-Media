import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Edit3, Save, X, List, FileText, Settings } from 'lucide-react';
import TinyMCEEditor from './TinyMCEEditor.jsx';
import EditableTabManager from './EditableTabManager.jsx';

const EditableSidebar = forwardRef(({
  initialContent = '',
  isAdminMode = false,
  onSave,
  title = 'Table of Contents',
  className = '',
  tabs = [],
  onTabsChange,
  showTabManager = false
}, ref) => {
  const [content, setContent] = useState(initialContent);
  const [showEditor, setShowEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMode, setActiveMode] = useState('content'); // 'content' or 'tabs'
  const editorRef = useRef(null);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getContent: () => content,
    setContent: (newContent) => setContent(newContent),
    focus: () => editorRef.current?.focus(),
    getEditor: () => editorRef.current
  }));

  const handleSave = async (savedContent) => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(savedContent);
      }
      setContent(savedContent);
      setShowEditor(false);
    } catch (error) {
      console.error('Error saving sidebar content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  const generateTableOfContents = (htmlContent) => {
    // Simple function to generate TOC from headings
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, ''); // Remove HTML tags
      const id = `heading-${headings.length}`;
      headings.push({ level, text, id });
    }

    if (headings.length === 0) {
      return '<p>No headings found in content. Add headings to generate table of contents.</p>';
    }

    let toc = '<h3>Table of Contents</h3><ul>';
    headings.forEach((heading, index) => {
      const indent = (heading.level - 1) * 20;
      toc += `<li style="margin-left: ${indent}px;"><a href="#heading-${index}" style="text-decoration: none; color: #2563eb;">${heading.text}</a></li>`;
    });
    toc += '</ul>';

    return toc;
  };

  const handleGenerateTOC = () => {
    // This would get content from the main editor
    // For now, we'll use a placeholder
    const tocContent = generateTableOfContents(content);
    setContent(tocContent);
  };

  return (
    <div className={`w-1/4 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          {isAdminMode && (
            <div className="flex items-center gap-2">
              {showTabManager && (
                <button
                  onClick={() => setActiveMode(activeMode === 'tabs' ? 'content' : 'tabs')}
                  className={`p-1 rounded ${
                    activeMode === 'tabs' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                  title="Toggle Tab Manager"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleGenerateTOC}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Generate Table of Contents"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                title="Edit Content"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {showEditor ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Editing Sidebar Content</span>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <TinyMCEEditor
              ref={editorRef}
              initialValue={content}
              onSave={handleSave}
              onCancel={handleCancel}
              isVisible={true}
              title="Edit Sidebar Content"
              placeholder="Enter sidebar content or table of contents..."
              height={400}
              showToolbar={true}
              isInline={true}
              showSaveButton={true}
            />
          </div>
        ) : activeMode === 'tabs' && showTabManager ? (
          <EditableTabManager
            tabs={tabs}
            onTabsChange={onTabsChange}
            isAdminMode={isAdminMode}
            className="h-full"
          />
        ) : (
          <div
            className="rich-html text-sm"
            dangerouslySetInnerHTML={{ __html: content || '<p>No content available. Click edit to add content.</p>' }}
          />
        )}
      </div>

      {/* Footer */}
      {isAdminMode && !showEditor && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            {activeMode === 'tabs' && showTabManager ? (
              <>Admin: Managing tabs - Changes sync with full edit mode</>
            ) : (
              <>Admin: Click edit button to modify sidebar content</>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

EditableSidebar.displayName = 'EditableSidebar';

export default EditableSidebar;


import React, { useState, useRef } from 'react';
import EditableSidebar from './EditableSidebar.jsx';
import TinyMCEEditor from './TinyMCEEditor.jsx';

const SidebarLayout = ({
  sidebarContent = '',
  mainContent = '',
  isAdminMode = false,
  onSaveSidebar,
  onSaveMain,
  sidebarTitle = 'Table of Contents',
  mainTitle = 'Main Content',
  className = ''
}) => {
  const [sidebarContentState, setSidebarContentState] = useState(sidebarContent);
  const [mainContentState, setMainContentState] = useState(mainContent);
  const sidebarRef = useRef(null);
  const mainEditorRef = useRef(null);

  const handleSaveSidebar = async (content) => {
    setSidebarContentState(content);
    if (onSaveSidebar) {
      await onSaveSidebar(content);
    }
  };

  const handleSaveMain = async (content) => {
    setMainContentState(content);
    if (onSaveMain) {
      await onSaveMain(content);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${className}`}>
      {/* Sidebar - 25% width */}
      <EditableSidebar
        ref={sidebarRef}
        initialContent={sidebarContentState}
        isAdminMode={isAdminMode}
        onSave={handleSaveSidebar}
        title={sidebarTitle}
      />

      {/* Main Content - 75% width */}
      <div className="flex-1 flex flex-col">
        {/* Main Content Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">{mainTitle}</h2>
            </div>
            {isAdminMode && (
              <div className="text-sm text-gray-500">
                Admin Mode - Content is editable
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isAdminMode ? (
            <TinyMCEEditor
              ref={mainEditorRef}
              initialValue={mainContentState}
              onSave={handleSaveMain}
              isVisible={true}
              title="Edit Main Content"
              placeholder="Enter main content here..."
              height={600}
              showToolbar={true}
              isInline={true}
              showSaveButton={true}
            />
          ) : (
            <div
              className="rich-html"
              dangerouslySetInnerHTML={{ __html: mainContentState || '<p>No content available.</p>' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;





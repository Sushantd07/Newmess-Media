import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import TinyMCEEditor from './admin/TinyMCEEditor.jsx';

const RichTextEditor = forwardRef(({
  initialValue = '',
  onSave,
  onCancel,
  isVisible = false,
  title = 'Rich Text Editor',
  placeholder = 'Start typing your content here...',
  height = 500,
  showToolbar = true,
  showPreview = false,
  isInline = false,
  showSaveButton = true,
  className = ''
}, ref) => {
  const [content, setContent] = useState(initialValue);
  const editorRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getContent: () => content,
    setContent: (newContent) => setContent(newContent),
    focus: () => editorRef.current?.focus(),
    getEditor: () => editorRef.current
  }));

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <TinyMCEEditor
      ref={editorRef}
      initialValue={content}
      onSave={handleSave}
      onCancel={handleCancel}
      isVisible={isVisible}
      title={title}
      placeholder={placeholder}
      height={height}
      showToolbar={showToolbar}
      showPreview={showPreview}
      isInline={isInline}
      showSaveButton={showSaveButton}
      className={className}
    />
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;

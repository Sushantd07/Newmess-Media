import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = forwardRef(({
  initialValue = '',
  onSave,
  onCancel,
  isVisible = false,
  title = 'Text Editor',
  placeholder = 'Start typing or paste content from Word documents...',
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
    getContent: () => {
      // Process content before returning
      let processedContent = cleanWordStyles(content);
      processedContent = convertToSemanticTags(processedContent);
      processedContent = preserveListTypes(processedContent);
      return processedContent;
    },
    setContent: (newContent) => setContent(newContent),
    focus: () => editorRef.current?.focus(),
    getEditor: () => editorRef.current
  }));

  // Function to convert content to semantic tags while preserving font sizes
  const convertToSemanticTags = (html) => {
    let converted = html;
    
    // Convert paragraphs with large font sizes to headings while preserving the font size
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h1 style="font-size: $1px;">$2</h1>'
    );
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*1[6-9]px[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h2 style="font-size: $1px;">$2</h2>'
    );
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*1[4-5]px[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h3 style="font-size: $1px;">$2</h3>'
    );
    
    // Handle point sizes
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h1 style="font-size: $1pt;">$2</h1>'
    );
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h2 style="font-size: $1pt;">$2</h2>'
    );
    converted = converted.replace(
      /<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi,
      '<h3 style="font-size: $1pt;">$2</h3>'
    );
    
    // Convert bold paragraphs to h2
    converted = converted.replace(
      /<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi,
      '<h2 style="font-weight: bold;">$1</h2>'
    );
    converted = converted.replace(
      /<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi,
      '<h2 style="font-weight: bold;">$1</h2>'
    );
    
    return converted;
  };

  // Function to preserve list types
  const preserveListTypes = (html) => {
    let preserved = html;
    
    // Ensure ul tags stay as ul (bullet points)
    preserved = preserved.replace(/<ol[^>]*class="[^"]*ul[^"]*"[^>]*>/gi, '<ul>');
    preserved = preserved.replace(/<ol[^>]*style="[^"]*list-style-type:\s*disc[^"]*"[^>]*>/gi, '<ul>');
    
    // Ensure ol tags stay as ol (numbered lists)
    preserved = preserved.replace(/<ul[^>]*class="[^"]*ol[^"]*"[^>]*>/gi, '<ol>');
    preserved = preserved.replace(/<ul[^>]*style="[^"]*list-style-type:\s*decimal[^"]*"[^>]*>/gi, '<ol>');
    
    return preserved;
  };

  // Function to clean Word-specific styles
  const cleanWordStyles = (html) => {
    let cleaned = html;
    
    // Remove Word-specific classes
    cleaned = cleaned.replace(/class="[^"]*Mso[^"]*"/gi, '');
    cleaned = cleaned.replace(/class="[^"]*mso[^"]*"/gi, '');
    
    // Remove Word-specific styles but preserve font-size
    cleaned = cleaned.replace(/style="[^"]*mso-[^"]*"/gi, '');
    cleaned = cleaned.replace(/style="[^"]*text-indent:[^"]*"/gi, '');
    cleaned = cleaned.replace(/style="[^"]*line-height:[^"]*"/gi, '');
    cleaned = cleaned.replace(/style="[^"]*font-family:[^"]*"/gi, '');
    
    // Remove empty attributes
    cleaned = cleaned.replace(/style="\s*"/gi, '');
    cleaned = cleaned.replace(/class="\s*"/gi, '');
    
    // Ensure list types are preserved correctly
    // Don't convert between ul and ol - keep them as they are
    
    return cleaned;
  };

  const handleEditorChange = (newContent, editor) => {
    // Don't process content here - let the setup events handle it
    setContent(newContent);
  };

  const handleSave = () => {
    if (onSave) {
      // Process content before saving
      let processedContent = cleanWordStyles(content);
      processedContent = convertToSemanticTags(processedContent);
      processedContent = preserveListTypes(processedContent);
      onSave(processedContent);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };



  // TinyMCE configuration
  const tinymceConfig = {
    apiKey: 'gi4afvtz4n48c4w80tpqcbmgql0x0w42677fzmr8j0va9zsn',
    height: height,
    menubar: isInline ? false : 'file edit view insert format',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: showToolbar ? [
      'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify',
      'bullist numlist outdent indent | link table | removeformat'
    ].join(' | ') : false,
    toolbar_mode: 'wrap',
    content_style: `
      /* Minimal CSS only for lists to ensure proper rendering */
      ul {
        list-style-type: disc;
        margin: 0 0 0.5em 0;
        padding: 0 0 0 1.5em;
      }
      
      ol {
        list-style-type: decimal;
        margin: 0 0 0.5em 0;
        padding: 0 0 0 1.5em;
      }
      
      li {
        margin: 0.25em 0;
      }
    `,
    paste_as_text: false,
    paste_retain_style_properties: 'font-size font-weight font-style text-decoration color background-color',
    paste_webkit_styles: 'font-size font-weight font-style text-decoration color background-color',
    paste_enable_default_filters: true,
    paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ul,ol,li,table,tr,td,th,tbody,thead,tfoot,a[href],br,ul[style],ol[style],li[style]',
    paste_auto_cleanup_on_paste: false,
    paste_remove_styles_if_webkit: false,
    paste_remove_styles: false,
    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
         setup: (editor) => {
       editorRef.current = editor;
       
       // Handle paste events to automatically process content
       editor.on('paste', (e) => {
         setTimeout(() => {
           let html = editor.getContent();
           let processedContent = cleanWordStyles(html);
           processedContent = convertToSemanticTags(processedContent);
           processedContent = preserveListTypes(processedContent);
           editor.setContent(processedContent);
           setContent(processedContent);
         }, 100);
       });
    },
         placeholder: placeholder,
     branding: false,
     elementpath: false,
     resize: true,
     statusbar: true,
     browser_spellcheck: true,
     contextmenu: true,
     paste_data_images: true,
    // Critical: Ensure content is not modified by TinyMCE
    forced_root_block: false,
    keep_styles: true,
    remove_script_host: false,
    convert_urls: false,
    relative_urls: false,
    remove_trailing_brs: false,
    verify_html: false,
    cleanup: false,
    cleanup_on_startup: false,
    element_format: 'raw',
    entities: false,
    encoding: 'xml'
  };

  // If this is an inline editor, render it directly
  if (isInline) {
    return (
      <div className={`tinymce-editor-inline ${className}`}>
        <Editor
          {...tinymceConfig}
          value={content}
          onEditorChange={handleEditorChange}
        />
        {showSaveButton && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
              Cancel
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // If this is a modal editor, render it conditionally
  if (!isVisible) {
    return null;
  }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
                >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
                </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          <Editor
            {...tinymceConfig}
            value={content}
            onEditorChange={handleEditorChange}
          />
            </div>

        {/* Footer */}
        {showSaveButton && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
                </button>
              )}
                </div>
              )}
        </div>
      </div>
    );
});

TinyMCEEditor.displayName = 'TinyMCEEditor';

export default TinyMCEEditor; 

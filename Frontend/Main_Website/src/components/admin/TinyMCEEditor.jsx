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
    getContent: () => content,
    setContent: (newContent) => setContent(newContent),
    focus: () => editorRef.current?.focus(),
    getEditor: () => editorRef.current
  }));

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent);
  };

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

  // Custom syntax replacement function
  const processCustomSyntax = (content) => {
    // Replace {{specialline}} with custom HTML structure
    return content.replace(
      /\{\{specialline\}\}/g,
      '<div class="special-line"><hr /><p style="text-align:center; font-weight:bold; color:#555;">Special Highlighted Line</p><hr /></div>'
    );
  };

  // TinyMCE configuration
  const tinymceConfig = {
    apiKey: 'no-api-key', // Replace with your TinyMCE API key for production
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
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; }
      .special-line { margin: 20px 0; }
      .special-line hr { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
      .special-line p { margin: 10px 0; }
    `,
    paste_as_text: false,
    paste_retain_style_properties: 'font-size font-weight font-style text-decoration color background-color',
    paste_webkit_styles: 'font-size font-weight font-style text-decoration color background-color',
    paste_enable_default_filters: true,
    paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ul,ol,li,table,tr,td,th,tbody,thead,tfoot,a[href],br',
    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
    setup: (editor) => {
      editorRef.current = editor;

      // Handle paste events for Word document processing
      editor.on('paste', (e) => {
        setTimeout(() => {
          let html = editor.getContent();
          
          // Convert Word heading styles to semantic HTML tags
          // Preserve visual size while converting to proper heading tags
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h1 style="font-size: $1px;">$2</h1>'
          );
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*1[6-9]px[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h2 style="font-size: $1px;">$2</h2>'
          );
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*1[4-5]px[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h3 style="font-size: $1px;">$2</h3>'
          );

          // Handle point sizes as well
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h1 style="font-size: $1pt;">$2</h1>'
          );
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h2 style="font-size: $1pt;">$2</h2>'
          );
          html = html.replace(
            /<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi,
            '<h3 style="font-size: $1pt;">$2</h3>'
          );

          // Convert bold paragraphs to h2
          html = html.replace(
            /<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi,
            '<h2>$1</h2>'
          );
          html = html.replace(
            /<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi,
            '<h2>$1</h2>'
          );

          // Convert bold+underline paragraphs to h1
          html = html.replace(
            /<p[^>]*>\s*<b>\s*<u>(.*?)<\/u>\s*<\/b>\s*<\/p>/gi,
            '<h1>$1</h1>'
          );

          // Convert all-caps lines to h2 (if not already a heading)
          html = html.replace(
            /<p[^>]*>([A-Z\s\d\-\.,:;!?]{8,})<\/p>/g,
            '<h2>$1</h2>'
          );

          // Remove duplicate headings
          html = html.replace(
            /<h([1-6])>\s*<h[1-6]>(.*?)<\/h[1-6]>\s*<\/h[1-6]>/gi,
            '<h$1>$2</h$1>'
          );

          // Clean up unnecessary inline styles
          html = html.replace(/style="[^"]*font-family:[^"]*"/gi, '');
          html = html.replace(/style="[^"]*mso-[^"]*"/gi, '');
          html = html.replace(/class="[^"]*Mso[^"]*"/gi, '');

          // Process custom syntax
          html = processCustomSyntax(html);

          editor.setContent(html);
          setContent(html);
        }, 100);
      });

      // Handle keyup events for custom syntax replacement
      editor.on('keyup', (e) => {
        if (e.keyCode === 32 || e.keyCode === 13) { // Space or Enter
          setTimeout(() => {
            let html = editor.getContent();
            const newHtml = processCustomSyntax(html);
            if (newHtml !== html) {
              editor.setContent(newHtml);
              setContent(newHtml);
            }
          }, 50);
        }
      });

      // Handle input events for real-time custom syntax replacement
      editor.on('input', () => {
        setTimeout(() => {
          let html = editor.getContent();
          const newHtml = processCustomSyntax(html);
          if (newHtml !== html) {
            editor.setContent(newHtml);
            setContent(newHtml);
          }
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
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles_if_webkit: false,
    paste_remove_styles: false,
    paste_retain_style_properties: 'font-size font-weight font-style text-decoration color background-color',
    paste_webkit_styles: 'font-size font-weight font-style text-decoration color background-color'
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





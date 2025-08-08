import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = forwardRef(({
  initialValue = `<div class="editor-layout">
  <div class="sidebar">
    <h3>📋 Quick Navigation</h3>
    <ul>
      <li>📎 Complete HDFC Bank Complaint and Grievance Resolution Guide</li>
      <li>📄 How to Register Your HDFC Bank Complaint Online and Offline</li>
      <li>📞 Method 1: HDFC Customer Care (Fastest Way)</li>
      <li>🌐 Method 2: HDFC Online Complaint Portal</li>
      <li>📋 What You Need for RBI Complaint</li>
      <li>📝 Best Practices for Filing HDFC Bank Complaints</li>
      <li>📄 Documentation Tips for Effective Complaint Resolution</li>
      <li>❓ Frequently Asked Questions About HDFC Complaint Process</li>
    </ul>
  </div>
  <div class="main-content">
    <h1 style="margin-top: 0; margin-bottom: 10px;">Complete HDFC Bank Complaint and Grievance Resolution Guide</h1>
    <h2 style="margin-top: 15px; margin-bottom: 15px;">How to Register Your HDFC Bank Complaint Online and Offline</h2>
    <p style="margin-bottom: 20px;">Here are some easy ways to register your complaint with HDFC Bank. Just follow any of these steps to quickly raise your issue and get help on time:</p>
    
    <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 1: HDFC Customer Care (Fastest Way)</h2>
    <h3 style="margin-top: 20px; margin-bottom: 10px;">HDFC Customer Care Contact Details:</h3>
    <ul style="margin-bottom: 20px;">
      <li><strong>Toll-Free Numbers:</strong> 1800 1600, 1800 2600</li>
      <li><strong>Email Support:</strong> <a href="mailto:support@hdfcbank.com">support@hdfcbank.com</a></li>
    </ul>
    
    <h3 style="margin-top: 20px; margin-bottom: 10px;">Alternative Options:</h3>
    <ul style="margin-bottom: 20px;">
      <li>Connect with Eva/Chat Bot for quick solutions to common queries.</li>
      <li>Visit/Contact your nearest branch.</li>
      <li>Fill out this <a href="#">complaint form</a>.</li>
    </ul>
    
    <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 2: HDFC Online Complaint Portal</h2>
    <h3 style="margin-top: 20px; margin-bottom: 10px;">Visit HDFC Complaint Portal:</h3>
    <p style="margin-bottom: 15px;">Go to: <a href="https://www.hdfcbank.com/personal/ways-to-bank/customer-service" target="_blank">https://www.hdfcbank.com/personal/ways-to-bank/customer-service</a></p>
    
    <h3 style="margin-top: 20px; margin-bottom: 10px;">Select Complaint Type:</h3>
    <ul style="margin-bottom: 20px;">
      <li>Choose: "Customer" (for general users)</li>
      <li>Click on: "Submit a Complaint"</li>
    </ul>
    
    <h3 style="margin-top: 20px; margin-bottom: 10px;">Fill Basic Details:</h3>
    <ul style="margin-bottom: 20px;">
      <li>Account number (optional)</li>
      <li>Personal information</li>
      <li>Complaint description</li>
    </ul>
  </div>
</div>`,
  onSave,
  onCancel,
  isVisible = false,
  title = 'Rich Text Editor',
  placeholder = 'Start typing or paste content from Word...',
  height = 500,
  showToolbar = true,
  showPreview = true,
  className = '',
  isInline = false,
  showSaveButton = true
}, ref) => {
  const [content, setContent] = useState(initialValue);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  // Utility: Auto-format all tables in HTML string
  function autoFormatTables(html) {
    // Add a class to all tables for custom styling
    html = html.replace(/<table(?![^>]*class=)/g, '<table class="auto-compact-table"');
    html = html.replace(/<table class="(.*?)"/g, (match, cls) => {
      if (!cls.includes('auto-compact-table')) {
        return `<table class="${cls} auto-compact-table"`;
      }
      return match;
    });
    return html;
  }

  const tinymceConfig = {
    apiKey: 'gi4afvtz4n48c4w80tpqcbmgql0x0w42677fzmr8j0va9zsn',
    height: height,
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
    toolbar: showToolbar ? [
      'formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
      'undo redo | bullist numlist outdent indent | link image table | code preview fullscreen',
      'fontfamily fontsize blocks | forecolor backcolor | removeformat | customsave'
    ].join(' | ') : false,
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
      table, table.auto-compact-table { border-collapse: collapse; width: 100%; margin: 1.2em 0; border: 1px solid #e2e8f0; border-radius: 6px; overflow: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.07); font-size: 0.97em; }
      table th, table td, table.auto-compact-table th, table.auto-compact-table td { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
      table th, table.auto-compact-table th { background: #f8fafc; color: #1e293b; font-weight: 600; position: sticky; top: 0; z-index: 1; }
      table tr:nth-child(even), table.auto-compact-table tr:nth-child(even) { background: #f8fafc; }
      table tr:hover, table.auto-compact-table tr:hover { background: #f1f5f9; }
      table, table.auto-compact-table { display: block; overflow-x: auto; max-width: 100%; }
      
      /* Two-column layout for editor content */
      .editor-layout { display: flex; gap: 20px; min-height: 100vh; }
      .sidebar { width: 30%; background: #f8f9fa; padding: 15px; border-right: 1px solid #e2e8f0; max-height: 100vh; overflow-y: auto; }
      .main-content { width: 70%; padding: 15px; }
      
      /* Sidebar styling */
      .sidebar h3 { margin-top: 0; margin-bottom: 15px; color: #1e293b; font-size: 1.1rem; }
      .sidebar ul { list-style: none; padding: 0; margin: 0; }
      .sidebar li { padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; line-height: 1.4; }
      .sidebar li:last-child { border-bottom: none; }
      
      /* Main content styling */
      .main-content h1 { margin-top: 0; margin-bottom: 10px; color: #1e293b; font-size: 1.8rem; }
      .main-content h2 { color: #374151; margin-top: 20px; margin-bottom: 10px; font-size: 1.4rem; }
      .main-content h3 { color: #4b5563; margin-top: 15px; margin-bottom: 8px; font-size: 1.1rem; }
      .main-content p { margin-bottom: 15px; line-height: 1.6; }
      .main-content ul { margin-bottom: 15px; }
      .main-content li { margin-bottom: 5px; }
      
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
    paste_retain_style_properties: "color background-color font-size font-family font-weight text-align",
    paste_merge_formats: true,
    paste_convert_word_fake_lists: true,
    paste_remove_styles_if_webkit: false,
    paste_remove_styles: false,
    paste_keep_unsupported_src: true,
    paste_data_images: true,
    paste_auto_cleanup_on_paste: true,
    paste_strip_class_attributes: "all",
    table_default_styles: { width: '100%', borderCollapse: 'collapse' },
    table_default_attributes: { border: '1' },
    table_class_list: [ { title: 'None', value: '' }, { title: 'Bordered', value: 'table-bordered' }, { title: 'Striped', value: 'table-striped' } ],
    paste_preprocess: (plugin, args) => {
      let content = args.content;
      
      console.log('Processing pasted content:', content.substring(0, 200) + '...');
      
      // Remove Word-specific tags and styles
      content = content.replace(/<o:p[^>]*>/g, '');
      content = content.replace(/<\/o:p>/g, '');
      content = content.replace(/<o:CustomDocumentProperties[^>]*>.*?<\/o:CustomDocumentProperties>/g, '');
      content = content.replace(/<w:WordDocument[^>]*>.*?<\/w:WordDocument>/g, '');
      content = content.replace(/<m:defJc[^>]*>.*?<\/m:defJc>/g, '');
      content = content.replace(/<m:wrapIndent[^>]*>.*?<\/m:wrapIndent>/g, '');
      content = content.replace(/<m:intLim[^>]*>.*?<\/m:intLim>/g, '');
      content = content.replace(/<m:naryLim[^>]*>.*?<\/m:naryLim>/g, '');
      
      // Enhanced Word heading detection
      // Convert Word headings to HTML headings with improved detection
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 1\"[^"]*"[^>]*>/gi, '<h1>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 2\"[^"]*"[^>]*>/gi, '<h2>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 3\"[^"]*"[^>]*>/gi, '<h3>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 4\"[^"]*"[^>]*>/gi, '<h4>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 5\"[^"]*"[^>]*>/gi, '<h5>');
      content = content.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 6\"[^"]*"[^>]*>/gi, '<h6>');
      
      // Aggressively convert <p class="MsoNormal"> with large font-size or bold to headings
      // H1: font-size >= 20pt, H2: 16-19pt, H3: 14-15pt, H4: bold only
      content = content.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>/gi, '<h1>');
      content = content.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>/gi, '<h2>');
      content = content.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>/gi, '<h3>');
      content = content.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-weight:\s*bold[^"]*"[^>]*>/gi, '<h4>');
      
      // Also convert <p class="MsoNormal"><b>...</b></p> to <h4>...</h4>
      content = content.replace(/<p class="MsoNormal"[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi, '<h4>$1</h4>');
      
      // Enhanced font-size detection for any paragraph
      content = content.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
      content = content.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
      content = content.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
      
      // Convert <p><b>...</b></p> and <p><strong>...</strong></p> to <h2>...</h2>
      content = content.replace(/<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi, '<h2>$1</h2>');
      content = content.replace(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>');
      
      // Convert <p><b><u>...</u></b></p> to <h1>...</h1>
      content = content.replace(/<p[^>]*>\s*<b>\s*<u>(.*?)<\/u>\s*<\/b>\s*<\/p>/gi, '<h1>$1</h1>');
      
      // Convert all-caps lines to h2 (if not already a heading)
      content = content.replace(/<p[^>]*>([A-Z\s\d\-\.,:;!?]{8,})<\/p>/g, '<h2>$1</h2>');
      
      // Clean up paragraph tags that should be headings
      content = content.replace(/<\/p>(?=\s*<h[1-6]>)/gi, '');
      content = content.replace(/(?<=<\/h[1-6]>)\s*<p[^>]*>/gi, '');
      
      // Enhanced table formatting
      content = content.replace(/<table(?![^>]*class=)/g, '<table class="auto-compact-table"');
      content = content.replace(/<table class="(.*?)"/g, (match, cls) => {
        if (!cls.includes('auto-compact-table')) {
          return `<table class="${cls} auto-compact-table"`;
        }
        return match;
      });
      
      // Remove most inline styles except for tables and headings
      content = content.replace(/(<(?!table|th|td|h[1-6])[a-z]+)([^>]*style="[^"]*")([^>]*>)/gi, '$1$3');
      
      // Add spacing between blocks
      content = content.replace(/<\/h([1-6])>/g, '</h$1>\n');
      content = content.replace(/<\/p>/g, '</p>\n');
      content = content.replace(/<\/li>/g, '</li>\n');
      
      // Clean up extra whitespace
      content = content.replace(/\s+/g, ' ');
      content = content.replace(/>\s+</g, '><');
      
      console.log('Processed content:', content.substring(0, 200) + '...');
      
      args.content = content;
    },
    // Additional settings to suppress warnings
    setup: (editor) => {
      // Add custom save button to toolbar
      editor.ui.registry.addButton('customsave', {
        text: '💾 Save',
        tooltip: 'Save Content',
        onAction: () => {
          if (onSave) {
            const content = editor.getContent();
            onSave(content);
          }
        }
      });

      // Remove any warning notifications
      editor.on('init', () => {
        const notifications = document.querySelectorAll('.tox-notification');
        notifications.forEach(notification => {
          notification.style.display = 'none';
        });
      });
      
      // Enhanced paste handling with better content processing
      editor.on('paste', (e) => {
        // Process content after a short delay to ensure it's fully pasted
        setTimeout(() => {
          const content = editor.getContent();
          if (content && content.trim().length > 0) {
            console.log('Content pasted, length:', content.length);
          }
        }, 200);
        
        // Hide warnings on paste
        setTimeout(() => {
          const notifications = document.querySelectorAll('.tox-notification');
          notifications.forEach(notification => {
            notification.style.display = 'none';
          });
        }, 100);
      });
      
      // Process content on change with debouncing
      let changeTimeout;
      editor.on('change', () => {
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(() => {
          const content = editor.getContent();
          if (content && content.trim().length > 0) {
            console.log('Content changed, length:', content.length);
          }
        }, 500);
      });
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(content);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    if (onCancel) onCancel();
  };

  const handleEditorChange = (content) => {
    // Auto-format tables before setting content
    const formatted = autoFormatTables(content);
    setContent(formatted);
  };

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
    
    // Hide any warning notifications after initialization
    setTimeout(() => {
      const notifications = document.querySelectorAll('.tox-notification');
      notifications.forEach(notification => {
        notification.style.display = 'none';
      });
    }, 500);
  };

  const autoConvertHeadings = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      let html = editor.getContent();
      
      console.log('Auto-converting headings...');
      
      // Enhanced Word document heading detection
      
      // Convert <p> with large font-size to headings (Word format)
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
      
      // Convert <p> with large font-size to headings (Word pt format)
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
      html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
      
      // Convert Word MsoNormal paragraphs with large font sizes
      html = html.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
      html = html.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
      html = html.replace(/<p class="MsoNormal"[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
      
      // Convert <p><b>...</b></p> and <p><strong>...</strong></p> to <h2>...</h2>
      html = html.replace(/<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi, '<h2>$1</h2>');
      html = html.replace(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>');
      
      // Convert <p><b><u>...</u></b></p> to <h1>...</h1>
      html = html.replace(/<p[^>]*>\s*<b>\s*<u>(.*?)<\/u>\s*<\/b>\s*<\/p>/gi, '<h1>$1</h1>');
      
      // Convert all-caps lines to h2 (if not already a heading)
      html = html.replace(/<p[^>]*>([A-Z\s\d\-\.,:;!?]{8,})<\/p>/g, '<h2>$1</h2>');
      
      // Convert Word style names to headings
      html = html.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 1\"[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$1</h1>');
      html = html.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 2\"[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$1</h2>');
      html = html.replace(/<p[^>]*style="[^"]*mso-style-name:\"Heading 3\"[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$1</h3>');
      
      // Remove duplicate headings (e.g., <h2><h2>Title</h2></h2>)
      html = html.replace(/<h([1-6])>\s*<h[1-6]>(.*?)<\/h[1-6]>\s*<\/h[1-6]>/gi, '<h$1>$2</h$1>');
      
      // Clean up any remaining Word-specific tags
      html = html.replace(/<o:p[^>]*>/g, '');
      html = html.replace(/<\/o:p>/g, '');
      
      console.log('Auto-conversion completed');
      
      editor.setContent(html);
    }
  };

  // Expose autoConvertHeadings to parent via ref
  useImperativeHandle(ref, () => ({
    autoConvertHeadings,
    getContent: () => {
      if (editorRef.current) {
        return editorRef.current.getContent();
      }
      return content;
    },
    setContent: (newContent) => {
      setContent(newContent);
      if (editorRef.current) {
        editorRef.current.setContent(newContent);
      }
    }
  }));

  if (!isVisible) return null;

  // In the render, above the editor, always show the tip and button
  const headingTipAndButton = (
    <div className="mb-2">
      <div className="text-xs text-blue-700 mb-1">
        <strong>Word Document Tips:</strong> When pasting from Word, the editor will automatically detect and convert:
        <br />• Large font sizes (20pt+) → H1 headings
        <br />• Medium font sizes (16-19pt) → H2 headings  
        <br />• Bold text → H2 headings
        <br />• All-caps text → H2 headings
        <br />• Word style names (Heading 1, 2, 3) → Proper headings
        <br />Use the "Auto-Convert Headings" button below to manually convert any remaining text.
      </div>
      <button
        className="mb-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={autoConvertHeadings}
        type="button"
      >
        Auto-Convert Headings
      </button>
    </div>
  );

  if (isInline) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-xs text-blue-700 mb-2">Tip: Use the dropdown to select Heading 1, Heading 2, etc. for section titles. This helps with SEO and page structure.</div>
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showPreview && (
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-white hover:bg-gray-100 rounded-md transition-colors border"
                title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              >
                {isPreviewMode ? 'Preview' : 'Edit'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-colors">
              Cancel
            </button>
            {showSaveButton && (
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </div>
        <div className="bg-white">
          {headingTipAndButton}
          {isPreviewMode ? (
            <div className="p-4 border-b border-gray-200">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            <Editor
              apiKey={tinymceConfig.apiKey}
              onInit={handleEditorInit}
              value={content}
              onEditorChange={handleEditorChange}
              init={tinymceConfig}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>
    );
  }

  if (!isInline) {
    return (
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              {showPreview && (
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                >
                  {isPreviewMode ? 'Preview' : 'Edit'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                Cancel
              </button>
              {showSaveButton && (
                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors">
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
          {/* Full width editor */}
          <div className="flex-1 h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              {headingTipAndButton}
            </div>
            <div className="flex-1 overflow-hidden">
              {isPreviewMode ? (
                <div className="h-full overflow-y-auto p-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              ) : (
                <div className="h-full">
                  <Editor
                    apiKey={tinymceConfig.apiKey}
                    onInit={handleEditorInit}
                    value={content}
                    onEditorChange={handleEditorChange}
                    init={{
                      ...tinymceConfig,
                      height: '100%',
                      min_height: 400
                    }}
                    placeholder={placeholder}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default TinyMCEEditor; 
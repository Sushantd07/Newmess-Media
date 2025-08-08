import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import React, { useState, useMemo } from 'react';

const RichTextEditor = () => {
  const [content, setContent] = useState('');

  const editorConfig = useMemo(() => ({
    height: 500,
    menubar: true,
    plugins: [
      'paste',
      'table',
      'link',
      'code',
      'lists',
      'formatselect'
    ],
    toolbar:
      'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | formatselect | link table code',
    paste_as_text: true,
    content_style: `
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 10px 0;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
      }
      th, td {
        padding: 6px 10px;
        border: 1px solid #ddd;
        text-align: left;
        vertical-align: middle;
      }
      th {
        background-color: #f9f9f9;
        font-weight: bold;
      }
      td {
        background-color: #fff;
      }
      tr:nth-child(even) td {
        background-color: #f7f7f7;
      }
    `,
    setup: (editor) => {
      editor.on('keydown', (e) => {
        if (e.ctrlKey) {
          switch (e.key) {
            case '1':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h1');
              break;
            case '2':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h2');
              break;
            case '3':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h3');
              break;
            case '4':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h4');
              break;
            case '5':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h5');
              break;
            case '6':
              e.preventDefault();
              editor.execCommand('FormatBlock', false, 'h6');
              break;
          }
        }
      });
    },
  }), []);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSubmit = () => {
    console.log('Submitted Content:', content);
    // You can send the content to your backend here
  };

  return (
    <div>
      <Editor
        apiKey="no-api-key" // Replace with your TinyMCE API key for production
        value={content}
        onEditorChange={(newContent, editor) => {
          setContent(newContent);
        }}
        init={editorConfig}

      />
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
};

export default RichTextEditor;
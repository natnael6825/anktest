// CustomQuillEditor.jsx

import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Import icons from react-icons (FontAwesome)
import { FaCamera, FaLink } from 'react-icons/fa';

function CustomQuillEditor({ value, onChange }) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current.getEditor();

    // Listen to text changes to detect newline insertion and normal text input
    quill.on('text-change', (delta, oldDelta, source) => {
      let containsNewline = false;
      let containsNonNewline = false;

      delta.ops.forEach(op => {
        if (typeof op.insert === 'string') {
          if (op.insert === '\n') {
            containsNewline = true;
          } else {
            containsNonNewline = true;
          }
        }
      });

      if (containsNewline) {
        const range = quill.getSelection();
        if (range) {
          const bounds = quill.getBounds(range.index);
          setToolbarPosition({
            top: bounds.top + bounds.height,
            left: bounds.left - 40,  // Adjust this offset as needed
          });
          setShowToolbar(true);
        }
      }

      // If user starts typing normal text, hide the toolbar
      if (containsNonNewline) {
        setShowToolbar(false);
      }
    });

    // Hide the toolbar when clicking inside the editor
    const hideToolbar = () => setShowToolbar(false);
    quill.root.addEventListener('click', hideToolbar);

    // Enable drag and drop for images
    const editorContainer = quill.root;
    const handleDragOver = (e) => {
      e.preventDefault(); // Allow drop
    };
    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          insertImageFromFile(file);
        }
      }
    };

    editorContainer.addEventListener('dragover', handleDragOver);
    editorContainer.addEventListener('drop', handleDrop);

    // Cleanup event listeners on unmount
    return () => {
      quill.root.removeEventListener('click', hideToolbar);
      editorContainer.removeEventListener('dragover', handleDragOver);
      editorContainer.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Reads an image file and inserts it as an embed.
  const insertImageFromFile = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', e.target.result);
      setShowToolbar(false);
    };
    reader.onerror = function (err) {
      console.error('Error reading file', err);
    };
    reader.readAsDataURL(file);
  };

  // Handler for the file input change event.
  const handleFileInputChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        insertImageFromFile(file);
      }
      e.target.value = ""; // Clear file input for future selections
    }
  };

  // Trigger the hidden file input when the image button is clicked.
  const handleImageButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler to insert or format a link.
  const insertLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range && range.length === 0) {
        quill.insertText(range.index, 'Link', 'link', url);
      } else {
        quill.format('link', url);
      }
    }
    setShowToolbar(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
      />
      {/* Hidden file input for image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      {showToolbar && (
        <div
          style={{
            position: 'absolute',
            top: toolbarPosition.top,
            left: toolbarPosition.left,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column', // Stack icons vertically (like Telegraph)
            gap: '5px',
          }}
        >
          <button
            onClick={handleImageButtonClick}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Insert Image"
          >
            <FaCamera size={18} color="#555" />
          </button>
          <button
            onClick={insertLink}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Insert Link"
          >
            <FaLink size={18} color="#555" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomQuillEditor;

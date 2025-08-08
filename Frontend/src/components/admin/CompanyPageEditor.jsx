import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Edit3, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  FileText,
  Phone,
  HelpCircle,
  PlayCircle,
  Building2,
  Type,
  RotateCcw,
  Layout,
  List,
  Navigation,
  Eraser
} from 'lucide-react';
import ContactNumbersEditor from './ContactNumbersEditor';
import { getContactNumbers, updateContactNumbers } from '../../services/contactNumbersService';
import { Editor } from '@tinymce/tinymce-react';

const CompanyPageEditor = ({ 
  companyData, 
  onSave, 
  onCancel,
  isVisible = false 
}) => {
  const [editingData, setEditingData] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [newTabName, setNewTabName] = useState('');
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [complaintContent, setComplaintContent] = useState('');
  const richTextRef = useRef(null);
  const [showContactNumbersEditor, setShowContactNumbersEditor] = useState(false);
  const [contactNumbersData, setContactNumbersData] = useState(null);
  const [complaintEditorRef, setComplaintEditorRef] = useState(null);
  const [showSidebarEditor, setShowSidebarEditor] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [editingSidebarItem, setEditingSidebarItem] = useState(null);

  // Initialize editing data
  useEffect(() => {
    if (companyData) {
      setEditingData(JSON.parse(JSON.stringify(companyData)));
      setComplaintContent(companyData.complaintContent || '');
    }
  }, [companyData]);

  const handleEditField = (field, value) => {
    setEditingField(field);
    setTempValue(value || '');
  };

  const handleSaveField = () => {
    if (editingField) {
      setEditingData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      setEditingField(null);
      setTempValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleTabEdit = (tabId, newName) => {
    setEditingData(prev => ({
      ...prev,
      tabs: prev.tabs?.map(tab => 
        tab.id === tabId ? { ...tab, label: newName } : tab
      ) || []
    }));
    setEditingTab(null);
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newTab = {
        id: `tab-${Date.now()}`,
        label: newTabName.trim(),
        icon: FileText,
        content: ''
      };
      setEditingData(prev => ({
        ...prev,
        tabs: [...(prev.tabs || []), newTab]
      }));
      setNewTabName('');
      setShowAddTabModal(false);
    }
  };

  const handleDeleteTab = (tabId) => {
    setEditingData(prev => ({
      ...prev,
      tabs: prev.tabs?.filter(tab => tab.id !== tabId) || []
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const dataToSave = {
        ...editingData,
        complaintContent
      };
      await onSave(dataToSave);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleOpenContactNumbersEditor = async () => {
    try {
      // Fetch contact numbers data
      const response = await getContactNumbers(editingData.slug);
      if (response.success) {
        setContactNumbersData(response.data.tabData);
        setShowContactNumbersEditor(true);
      }
    } catch (error) {
      console.error('Error fetching contact numbers:', error);
      // If no contact numbers exist, start with empty data
      setContactNumbersData({});
      setShowContactNumbersEditor(true);
    }
  };

  const handleSaveContactNumbers = async (contactData) => {
    try {
      await updateContactNumbers(editingData.slug, contactData);
      setShowContactNumbersEditor(false);
      // You could show a success message here
    } catch (error) {
      console.error('Error saving contact numbers:', error);
      // You could show an error message here
    }
  };

  const handleAutoConvertHeadings = () => {
    if (complaintEditorRef) {
      try {
        const editor = complaintEditorRef;
        let html = editor.getContent();
        
        // Apply auto-convert logic (same as in TinyMCEEditor)
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
        
        // Convert <p><b>...</b></p> and <p><strong>...</strong></p> to <h2>...</h2>
        html = html.replace(/<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi, '<h2>$1</h2>');
        html = html.replace(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>');
        
        // Convert <p><b><u>...</u></b></p> to <h1>...</h1>
        html = html.replace(/<p[^>]*>\s*<b>\s*<u>(.*?)<\/u>\s*<\/b>\s*<\/p>/gi, '<h1>$1</h1>');
        
        // Convert all-caps lines to h2 (if not already a heading)
        html = html.replace(/<p[^>]*>([A-Z\s\d\-\.,:;!?]{8,})<\/p>/g, '<h2>$1</h2>');
        
        // Remove duplicate headings
        html = html.replace(/<h([1-6])>\s*<h[1-6]>(.*?)<\/h[1-6]>\s*<\/h[1-6]>/gi, '<h$1>$2</h$1>');
        
        // Set the converted content back
        editor.setContent(html);
        setComplaintContent(html);
        
        alert('Auto-converted headings successfully!');
      } catch (error) {
        console.error('Error auto-converting headings:', error);
        alert('Error auto-converting headings. Please try again.');
      }
    } else {
      alert('Editor not ready. Please wait a moment and try again.');
    }
  };

  const handleClearComplaintContent = () => {
    if (window.confirm('Are you sure you want to clear all complaint content? This cannot be undone.')) {
      setComplaintContent('');
      if (complaintEditorRef) {
        complaintEditorRef.setContent('');
      }
      // Don't save to backend immediately - let user save when ready
    }
  };

  const handleAutoFormatContent = () => {
    if (complaintEditorRef) {
      try {
        const editor = complaintEditorRef;
        let html = editor.getContent();
        
        // Step 1: Convert to proper headings first
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]px[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*(2[0-9]|[3-9][0-9])pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[6-9]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>');
        html = html.replace(/<p[^>]*style="[^"]*font-size:\s*1[4-5]pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>');
        html = html.replace(/<p[^>]*>\s*<b>(.*?)<\/b>\s*<\/p>/gi, '<h2>$1</h2>');
        html = html.replace(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>');
        html = html.replace(/<p[^>]*>\s*<b>\s*<u>(.*?)<\/u>\s*<\/b>\s*<\/p>/gi, '<h1>$1</h1>');
        html = html.replace(/<p[^>]*>([A-Z\s\d\-\.,:;!?]{8,})<\/p>/g, '<h2>$1</h2>');
        
        // Step 2: Add card formatting to content sections
        html = html.replace(
          /<h([1-3])>(.*?)<\/h[1-3]>\s*<p>(.*?)<\/p>/gi,
          '<div class="content-card" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; margin: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h$1 style="color: #495057; margin-top: 0; margin-bottom: 12px;">$2</h$1><p style="margin: 0; line-height: 1.6; color: #6c757d;">$3</p></div>'
        );
        
        // Step 3: Format bullet points and lists
        html = html.replace(
          /<ul>(.*?)<\/ul>/gis,
          '<div class="list-card" style="background: #ffffff; border-left: 4px solid #007bff; padding: 12px 16px; margin: 12px 0; border-radius: 4px;"><ul style="margin: 0; padding-left: 20px;">$1</ul></div>'
        );
        
        // Step 4: Format important information boxes
        html = html.replace(
          /<p><strong>(.*?)<\/strong>(.*?)<\/p>/gi,
          '<div class="info-card" style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 6px; padding: 12px; margin: 12px 0;"><p style="margin: 0;"><strong style="color: #0056b3;">$1</strong>$2</p></div>'
        );
        
        // Step 5: Format formulas and code blocks
        html = html.replace(
          /<p>(.*?=.*?)<\/p>/gi,
          '<div class="formula-card" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 12px; margin: 12px 0; font-family: monospace; text-align: center;"><p style="margin: 0; font-weight: bold; color: #495057;">$1</p></div>'
        );
        
        // Step 6: Add spacing and improve readability
        html = html.replace(/<\/h([1-3])>/g, '</h$1>\n');
        html = html.replace(/<\/p>/g, '</p>\n');
        
        // Set the formatted content back
        editor.setContent(html);
        setComplaintContent(html);
        
        alert('Content auto-formatted successfully with cards and better structure!');
      } catch (error) {
        console.error('Error auto-formatting content:', error);
        alert('Error auto-formatting content. Please try again.');
      }
    } else {
      alert('Editor not ready. Please wait a moment and try again.');
    }
  };

  const handleGenerateSidebar = () => {
    if (complaintEditorRef) {
      try {
        const editor = complaintEditorRef;
        const html = editor.getContent();
        
        // Extract headings from content
        const headingMatches = html.match(/<h([1-3])>(.*?)<\/h[1-3]>/gi);
        const headings = headingMatches ? headingMatches.map(match => {
          const level = match.match(/<h([1-3])>/i)[1];
          const text = match.replace(/<h[1-3]>(.*?)<\/h[1-3]>/i, '$1');
          return { level: parseInt(level), text: text.trim() };
        }) : [];
        
        if (headings.length === 0) {
          alert('No headings found in content. Please add some headings first.');
          return;
        }
        
        // Convert headings to sidebar items
        const items = headings.map((heading, index) => ({
          id: `item-${index}`,
          text: heading.text,
          level: heading.level,
          target: `#heading-${index}`,
          icon: heading.level === 1 ? '📌' : heading.level === 2 ? '📎' : '📄'
        }));
        
        setSidebarItems(items);
        
        // Generate sidebar HTML
        let sidebarHTML = `
          <div class="sidebar-container" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; margin: 16px 0; max-width: 300px;">
            <h3 style="color: #495057; margin-top: 0; margin-bottom: 16px; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 8px;">
              📋 Table of Contents
            </h3>
            <nav style="margin: 0;">
              <ul style="list-style: none; padding: 0; margin: 0;">
        `;
        
        headings.forEach((heading, index) => {
          const indent = (heading.level - 1) * 16;
          const icon = heading.level === 1 ? '📌' : heading.level === 2 ? '📎' : '📄';
          sidebarHTML += `
            <li style="margin: ${heading.level === 1 ? '12px 0 8px 0' : '6px 0'};">
              <a href="#heading-${index}" style="display: flex; align-items: center; text-decoration: none; color: #495057; font-size: ${heading.level === 1 ? '14px' : '13px'}; font-weight: ${heading.level === 1 ? '600' : '500'}; padding: 4px 0; border-radius: 4px; transition: all 0.2s;">
                <span style="margin-right: 8px; font-size: 12px;">${icon}</span>
                <span style="margin-left: ${indent}px;">${heading.text}</span>
              </a>
            </li>
          `;
        });
        
        sidebarHTML += `
              </ul>
            </nav>
          </div>
        `;
        
        // Insert sidebar at the beginning of content
        const updatedHTML = sidebarHTML + '\n' + html;
        editor.setContent(updatedHTML);
        setComplaintContent(updatedHTML);
        
        alert(`Generated sidebar with ${headings.length} headings! You can now edit the sidebar manually.`);
      } catch (error) {
        console.error('Error generating sidebar:', error);
        alert('Error generating sidebar. Please try again.');
      }
    } else {
      alert('Editor not ready. Please wait a moment and try again.');
    }
  };

  const handleRemoveAutoFormat = () => {
    if (complaintEditorRef) {
      try {
        const editor = complaintEditorRef;
        let html = editor.getContent();
        
        // Remove card formatting
        html = html.replace(/<div class="content-card"[^>]*>(.*?)<\/div>/gis, '$1');
        html = html.replace(/<div class="list-card"[^>]*>(.*?)<\/div>/gis, '$1');
        html = html.replace(/<div class="info-card"[^>]*>(.*?)<\/div>/gis, '$1');
        html = html.replace(/<div class="formula-card"[^>]*>(.*?)<\/div>/gis, '$1');
        
        // Remove sidebar
        html = html.replace(/<div class="sidebar-container"[^>]*>.*?<\/div>/gis, '');
        
        // Clean up extra spacing
        html = html.replace(/\n\s*\n/g, '\n');
        html = html.trim();
        
        editor.setContent(html);
        setComplaintContent(html);
        setSidebarItems([]);
        
        alert('Auto formatting removed successfully!');
      } catch (error) {
        console.error('Error removing auto format:', error);
        alert('Error removing auto format. Please try again.');
      }
    } else {
      alert('Editor not ready. Please wait a moment and try again.');
    }
  };

  const handleEditSidebar = () => {
    setShowSidebarEditor(true);
  };

  const handleAddSidebarItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      text: '',
      level: 1,
      target: '',
      icon: '📌'
    };
    setSidebarItems([...sidebarItems, newItem]);
    setEditingSidebarItem(newItem.id);
  };

  const handleUpdateSidebarItem = (id, field, value) => {
    setSidebarItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDeleteSidebarItem = (id) => {
    setSidebarItems(items => items.filter(item => item.id !== id));
  };

  const handleSaveSidebar = () => {
    if (complaintEditorRef) {
      try {
        const editor = complaintEditorRef;
        const html = editor.getContent();
        
        // Remove existing sidebar
        let updatedHTML = html.replace(/<div class="sidebar-container"[^>]*>.*?<\/div>/gis, '');
        
        // Generate new sidebar from edited items
        if (sidebarItems.length > 0) {
          let sidebarHTML = `
            <div class="sidebar-container" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; margin: 16px 0; max-width: 300px;">
              <h3 style="color: #495057; margin-top: 0; margin-bottom: 16px; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 8px;">
                📋 Table of Contents
              </h3>
              <nav style="margin: 0;">
                <ul style="list-style: none; padding: 0; margin: 0;">
          `;
          
          sidebarItems.forEach((item, index) => {
            const indent = (item.level - 1) * 16;
            sidebarHTML += `
              <li style="margin: ${item.level === 1 ? '12px 0 8px 0' : '6px 0'};">
                <a href="${item.target}" onclick="handleSidebarNavigation('${item.target}', '${item.text}'); return false;" style="display: flex; align-items: center; text-decoration: none; color: #495057; font-size: ${item.level === 1 ? '14px' : '13px'}; font-weight: ${item.level === 1 ? '600' : '500'}; padding: 4px 0; border-radius: 4px; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.backgroundColor='#e9ecef'" onmouseout="this.style.backgroundColor='transparent'">
                  <span style="margin-right: 8px; font-size: 12px;">${item.icon}</span>
                  <span style="margin-left: ${indent}px;">${item.text}</span>
                </a>
              </li>
            `;
          });
          
          sidebarHTML += `
                </ul>
              </nav>
            </div>
          `;
          
          updatedHTML = sidebarHTML + '\n' + updatedHTML;
        }
        
        editor.setContent(updatedHTML);
        setComplaintContent(updatedHTML);
        setShowSidebarEditor(false);
        setEditingSidebarItem(null);
        
        // Add navigation function to window for sidebar clicks
        window.handleSidebarNavigation = (target, text) => {
          handleSidebarNavigation(target, text);
        };
        
        alert('Sidebar updated successfully! You can now click on sidebar items to navigate.');
      } catch (error) {
        console.error('Error saving sidebar:', error);
        alert('Error saving sidebar. Please try again.');
      }
    } else {
      alert('Editor not ready. Please wait a moment and try again.');
    }
  };

  const handleSidebarNavigation = (target, text) => {
    try {
      if (target.startsWith('#')) {
        // Internal navigation - find element with matching ID
        const elementId = target.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          // Scroll to element
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Highlight the element briefly
          element.style.backgroundColor = '#fff3cd';
          element.style.border = '2px solid #ffc107';
          setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.border = '';
          }, 2000);
          
          alert(`Navigated to: ${text}`);
        } else {
          // Try to find by class or create a section
          const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const matchingSection = Array.from(sections).find(section => 
            section.textContent.toLowerCase().includes(text.toLowerCase())
          );
          
          if (matchingSection) {
            matchingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the section
            matchingSection.style.backgroundColor = '#fff3cd';
            matchingSection.style.border = '2px solid #ffc107';
            setTimeout(() => {
              matchingSection.style.backgroundColor = '';
              matchingSection.style.border = '';
            }, 2000);
            
            alert(`Navigated to: ${text}`);
          } else {
            // Create a new section if not found
            if (complaintEditorRef) {
              const editor = complaintEditorRef;
              const currentContent = editor.getContent();
              
              // Add ID to the target
              const newSection = `<h2 id="${elementId}" style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-top: 24px;">${text}</h2><p>Content for ${text} goes here...</p>`;
              
              const updatedContent = currentContent + '\n' + newSection;
              editor.setContent(updatedContent);
              setComplaintContent(updatedContent);
              
              // Scroll to the new section
              setTimeout(() => {
                const newElement = document.getElementById(elementId);
                if (newElement) {
                  newElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  newElement.style.backgroundColor = '#fff3cd';
                  newElement.style.border = '2px solid #ffc107';
                  setTimeout(() => {
                    newElement.style.backgroundColor = '';
                    newElement.style.border = '';
                  }, 2000);
                }
              }, 100);
              
              alert(`Created and navigated to new section: ${text}`);
            }
          }
        }
      } else if (target.startsWith('http')) {
        // External navigation
        window.open(target, '_blank');
        alert(`Opening external link: ${text}`);
      } else {
        // Custom navigation - show options
        const navigationOptions = [
          'Create new section',
          'Navigate to existing content',
          'Open external link',
          'Cancel'
        ];
        
        const choice = prompt(`Navigation target: ${target}\n\nChoose action:\n1. Create new section\n2. Navigate to existing content\n3. Open external link\n4. Cancel\n\nEnter 1-4:`, '1');
        
        switch (choice) {
          case '1':
            // Create new section
            if (complaintEditorRef) {
              const editor = complaintEditorRef;
              const currentContent = editor.getContent();
              const sectionId = target.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
              
              const newSection = `<h2 id="${sectionId}" style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-top: 24px;">${text}</h2><p>Content for ${text} goes here...</p>`;
              
              const updatedContent = currentContent + '\n' + newSection;
              editor.setContent(updatedContent);
              setComplaintContent(updatedContent);
              
              setTimeout(() => {
                const newElement = document.getElementById(sectionId);
                if (newElement) {
                  newElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  newElement.style.backgroundColor = '#fff3cd';
                  newElement.style.border = '2px solid #ffc107';
                  setTimeout(() => {
                    newElement.style.backgroundColor = '';
                    newElement.style.border = '';
                  }, 2000);
                }
              }, 100);
              
              alert(`Created and navigated to new section: ${text}`);
            }
            break;
            
          case '2':
            // Navigate to existing content
            const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
            const matchingContent = Array.from(sections).find(section => 
              section.textContent.toLowerCase().includes(text.toLowerCase())
            );
            
            if (matchingContent) {
              matchingContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
              matchingContent.style.backgroundColor = '#fff3cd';
              matchingContent.style.border = '2px solid #ffc107';
              setTimeout(() => {
                matchingContent.style.backgroundColor = '';
                matchingContent.style.border = '';
              }, 2000);
              
              alert(`Navigated to existing content: ${text}`);
            } else {
              alert(`No matching content found for: ${text}`);
            }
            break;
            
          case '3':
            // Open external link
            const url = prompt('Enter URL:', 'https://');
            if (url && url.startsWith('http')) {
              window.open(url, '_blank');
              alert(`Opening external link: ${url}`);
            }
            break;
            
          default:
            alert('Navigation cancelled');
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert(`Navigation error: ${error.message}`);
    }
  };

  const EditableField = ({ field, value, label, type = 'text', className = '' }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <div className="flex items-center gap-2">
            {type === 'textarea' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm resize-none"
                rows={4}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm"
                autoFocus
              />
            )}
            <button
              onClick={handleSaveField}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {value || 'Not set'}
            </div>
            <button
              onClick={() => handleEditField(field, value)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };



  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Company Page: {editingData.name}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'General Info', icon: Building2 },
                { id: 'contact', label: 'Contact Numbers', icon: Phone },
                { id: 'complaints', label: 'Complaint Process', icon: FileText },
                { id: 'tabs', label: 'Manage Tabs', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Info Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  General Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    field="name"
                    value={editingData.name}
                    label="Company Name"
                  />
                  <EditableField
                    field="founded"
                    value={editingData.founded}
                    label="Founded Year"
                  />
                  <EditableField
                    field="headquarters"
                    value={editingData.headquarters}
                    label="Headquarters"
                  />
                  <EditableField
                    field="rating"
                    value={editingData.rating}
                    label="Rating (0-5)"
                    type="number"
                  />
                  <EditableField
                    field="website"
                    value={editingData.website}
                    label="Website URL"
                  />
                  <EditableField
                    field="phone"
                    value={editingData.phone}
                    label="Main Phone Number"
                  />
                </div>
                
                <EditableField
                  field="description"
                  value={editingData.description}
                  label="Company Description"
                  type="textarea"
                />
              </div>
            )}

            {/* Contact Numbers Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Contact Numbers
                  </h3>
                  <button
                    onClick={handleOpenContactNumbersEditor}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Edit Contact Numbers
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Click the "Edit Contact Numbers" button to open the comprehensive contact numbers editor. 
                    You can edit all sections including top contact cards, helpline numbers, state-wise numbers, 
                    SMS services, IVR menu, and more.
                  </p>
                </div>
              </div>
            )}

            {/* Complaint Process Tab */}
            {activeTab === 'complaints' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Complaint Redressal Process
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAutoConvertHeadings}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
                      title="Convert bold/large text to proper headings"
                    >
                      <Type className="w-4 h-4" />
                      Auto Convert Headings
                    </button>
                    <button
                      onClick={handleAutoFormatContent}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                      title="Format content with cards and better structure"
                    >
                      <Layout className="w-4 h-4" />
                      Auto Format
                    </button>
                    <button
                      onClick={handleGenerateSidebar}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                      title="Generate table of contents sidebar"
                    >
                      <List className="w-4 h-4" />
                      Generate Sidebar
                    </button>
                    <button
                      onClick={handleEditSidebar}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                      title="Edit sidebar content manually"
                    >
                      <Navigation className="w-4 h-4" />
                      Edit Sidebar
                    </button>
                    <button
                      onClick={handleRemoveAutoFormat}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                      title="Remove auto formatting and cards"
                    >
                      <Eraser className="w-4 h-4" />
                      Remove Format
                    </button>
                    <button
                      onClick={() => {
                        const target = prompt('Enter navigation target (e.g., #contact-numbers, https://example.com):', '#');
                        const text = prompt('Enter display text:', 'Navigation Item');
                        if (target && text) {
                          handleSidebarNavigation(target, text);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm"
                      title="Quick navigation to any section"
                    >
                      <Navigation className="w-4 h-4" />
                      Quick Nav
                    </button>
                    <button
                      onClick={handleClearComplaintContent}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      title="Clear all complaint content"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear Content
                    </button>
                  </div>
                </div>
                
                {/* Helpful Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Quick Tips:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Auto Convert Headings:</strong> Converts bold text, large fonts, and all-caps text to proper H1, H2, H3 headings</li>
                        <li>• <strong>Auto Format:</strong> Creates card-based layouts with better visual structure and readability</li>
                        <li>• <strong>Generate Sidebar:</strong> Automatically creates a table of contents from your headings</li>
                        <li>• <strong>Edit Sidebar:</strong> Manually edit sidebar items with custom navigation targets</li>
                        <li>• <strong>Quick Nav:</strong> Instantly navigate to any section or create new sections</li>
                        <li>• <strong>Remove Format:</strong> Remove auto formatting and return to plain text</li>
                        <li>• <strong>Clear Content:</strong> Removes all existing complaint content to start fresh</li>
                        <li>• <strong>SEO Friendly:</strong> Proper headings and structure improve search engine optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Process Content
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <Editor
                      apiKey="gi4afvtz4n48c4w80tpqcbmgql0x0w42677fzmr8j0va9zsn"
                      onInit={(evt, editor) => {
                        // Store editor reference for auto-convert functionality
                        setComplaintEditorRef(editor);
                        
                        // Hide any warning notifications after initialization
                        setTimeout(() => {
                          const notifications = document.querySelectorAll('.tox-notification');
                          notifications.forEach(notification => {
                            notification.style.display = 'none';
                          });
                        }, 500);
                      }}
                      value={complaintContent}
                      onEditorChange={(content) => setComplaintContent(content)}
                      init={{
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
                          body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                            font-size: 14px; 
                            line-height: 1.6; 
                            color: #333; 
                            margin: 0; 
                            padding: 16px; 
                          }
                          
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
                          
                          /* Table Styling */
                          table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 16px 0; 
                            border: 1px solid #e2e8f0; 
                            border-radius: 8px; 
                            overflow: hidden; 
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
                          }
                          
                          table th { 
                            background-color: #f8fafc; 
                            color: #1e293b; 
                            font-weight: 600; 
                            padding: 12px 16px; 
                            text-align: left; 
                            border-bottom: 2px solid #e2e8f0; 
                            font-size: 14px; 
                          }
                          
                          table td { 
                            padding: 12px 16px; 
                            border-bottom: 1px solid #f1f5f9; 
                            vertical-align: top; 
                            font-size: 14px; 
                          }
                          
                          table tr:nth-child(even) { 
                            background-color: #f8fafc; 
                          }
                          
                          table tr:hover { 
                            background-color: #f1f5f9; 
                          }
                          
                          /* Heading Styles */
                          h1 { 
                            font-size: 24px; 
                            font-weight: 700; 
                            color: #1e293b; 
                            margin: 24px 0 16px 0; 
                            line-height: 1.3; 
                          }
                          
                          h2 { 
                            font-size: 20px; 
                            font-weight: 600; 
                            color: #1e293b; 
                            margin: 20px 0 12px 0; 
                            line-height: 1.4; 
                          }
                          
                          h3 { 
                            font-size: 18px; 
                            font-weight: 600; 
                            color: #334155; 
                            margin: 16px 0 8px 0; 
                            line-height: 1.4; 
                          }
                          
                          h4 { 
                            font-size: 16px; 
                            font-weight: 600; 
                            color: #475569; 
                            margin: 12px 0 6px 0; 
                            line-height: 1.4; 
                          }
                          
                          /* List Styling */
                          ul, ol { 
                            margin: 12px 0; 
                            padding-left: 24px; 
                          }
                          
                          li { 
                            margin: 4px 0; 
                            line-height: 1.6; 
                          }
                          
                          /* Link Styling */
                          a { 
                            color: #2563eb; 
                            text-decoration: underline; 
                          }
                          
                          a:hover { 
                            color: #1d4ed8; 
                          }
                          
                          /* Blockquote */
                          blockquote { 
                            border-left: 4px solid #3b82f6; 
                            margin: 16px 0; 
                            padding: 8px 16px; 
                            background-color: #f8fafc; 
                            font-style: italic; 
                          }
                          
                          /* Code */
                          code { 
                            background-color: #f1f5f9; 
                            padding: 2px 6px; 
                            border-radius: 4px; 
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                            font-size: 13px; 
                          }
                          
                          pre { 
                            background-color: #1e293b; 
                            color: #e2e8f0; 
                            padding: 16px; 
                            border-radius: 8px; 
                            overflow-x: auto; 
                            margin: 16px 0; 
                          }
                          
                          pre code { 
                            background: none; 
                            padding: 0; 
                            color: inherit; 
                          }
                          
                          /* Paste cleanup */
                          .mce-content-body { 
                            font-family: inherit; 
                          }
                        `,
                        paste_as_text: false,
                        paste_enable_default_filters: true,
                        paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,br,ul,ol,li,table,tr,td,th,tbody,thead,img,a,link,span,div",
                        paste_retain_style_properties: "color background-color font-size font-family",
                        paste_merge_formats: true,
                        paste_convert_word_fake_lists: true,
                        paste_remove_styles_if_webkit: false,
                        table_default_styles: {
                          width: '100%',
                          borderCollapse: 'collapse'
                        },
                        table_default_attributes: {
                          border: '1'
                        },
                        table_class_list: [
                          { title: 'None', value: '' },
                          { title: 'Bordered', value: 'table-bordered' },
                          { title: 'Striped', value: 'table-striped' }
                        ],
                        link_list: [
                          { title: 'My page 1', value: 'https://www.example.com' },
                          { title: 'My page 2', value: 'https://www.example.com' }
                        ],
                        image_advtab: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        formats: {
                          h1: { block: 'h1', styles: { fontSize: '24px', fontWeight: '700' } },
                          h2: { block: 'h2', styles: { fontSize: '20px', fontWeight: '600' } },
                          h3: { block: 'h3', styles: { fontSize: '18px', fontWeight: '600' } },
                          h4: { block: 'h4', styles: { fontSize: '16px', fontWeight: '600' } }
                        },
                        setup: (editor) => {
                          editor.on('init', () => {
                            console.log('TinyMCE Editor initialized');
                            // Remove any warning notifications
                            const notifications = document.querySelectorAll('.tox-notification');
                            notifications.forEach(notification => {
                              notification.style.display = 'none';
                            });
                          });
                          
                          editor.on('paste', (e) => {
                            console.log('Paste event detected');
                            // Hide warnings on paste
                            setTimeout(() => {
                              const notifications = document.querySelectorAll('.tox-notification');
                              notifications.forEach(notification => {
                                notification.style.display = 'none';
                              });
                            }, 100);
                          });
                          
                          editor.on('change', () => {
                            const content = editor.getContent();
                            setComplaintContent(content);
                          });
                        },
                        extended_valid_elements: 'table[*],tr[*],td[*],th[*],tbody[*],thead[*]',
                        invalid_elements: 'script,iframe,object,embed,form,input,textarea,select,button',
                        extended_valid_elements: 'span[*],div[*],p[*],br,strong,b,em,i,u,strike,s,sub,sup,h1,h2,h3,h4,h5,h6,ul,ol,li,table,tr,td,th,tbody,thead,tfoot,caption,colgroup,col,blockquote,pre,code,hr,img,a,link,meta,title,style,script,iframe,object,embed,param,area,map,base,basefont,bdo,br,font,frame,frameset,noframes,acronym,abbr,applet,isindex,dir,fieldset,label,legend,button,select,optgroup,option,textarea,input,form,fieldset,legend,label,button,select,optgroup,option,textarea,input,form',
                        paste_preprocess: (plugin, args) => {
                          // Clean up Word paste content
                          let content = args.content;
                          
                          // Remove Word-specific styles and convert to clean HTML
                          content = content.replace(/<o:p[^>]*>/g, '');
                          content = content.replace(/<\/o:p>/g, '');
                          content = content.replace(/<o:CustomDocumentProperties[^>]*>.*?<\/o:CustomDocumentProperties>/g, '');
                          content = content.replace(/<w:WordDocument[^>]*>.*?<\/w:WordDocument>/g, '');
                          content = content.replace(/<m:mathPr[^>]*>.*?<\/m:mathPr>/g, '');
                          content = content.replace(/<m:mathFont[^>]*>.*?<\/m:mathFont>/g, '');
                          content = content.replace(/<m:brkBin[^>]*>.*?<\/m:brkBin>/g, '');
                          content = content.replace(/<m:brkBinSub[^>]*>.*?<\/m:brkBinSub>/g, '');
                          content = content.replace(/<m:smallFrac[^>]*>.*?<\/m:smallFrac>/g, '');
                          content = content.replace(/<m:dispDef[^>]*>.*?<\/m:dispDef>/g, '');
                          content = content.replace(/<m:lMargin[^>]*>.*?<\/m:lMargin>/g, '');
                          content = content.replace(/<m:rMargin[^>]*>.*?<\/m:rMargin>/g, '');
                          content = content.replace(/<m:defJc[^>]*>.*?<\/m:defJc>/g, '');
                          content = content.replace(/<m:wrapIndent[^>]*>.*?<\/m:wrapIndent>/g, '');
                          content = content.replace(/<m:intLim[^>]*>.*?<\/m:intLim>/g, '');
                          content = content.replace(/<m:naryLim[^>]*>.*?<\/m:naryLim>/g, '');
                          
                          // Convert Word headings to proper HTML headings
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 1"[^"]*"[^>]*>/gi, '<h1>');
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 2"[^"]*"[^>]*>/gi, '<h2>');
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 3"[^"]*"[^>]*>/gi, '<h3>');
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 4"[^"]*"[^>]*>/gi, '<h4>');
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 5"[^"]*"[^>]*>/gi, '<h5>');
                          content = content.replace(/<p[^>]*style="[^"]*mso-style-name:"Heading 6"[^"]*"[^>]*>/gi, '<h6>');
                          
                          // Clean up paragraph tags that should be headings
                          content = content.replace(/<\/p>(?=\s*<h[1-6]>)/gi, '');
                          content = content.replace(/(?<=<\/h[1-6]>)\s*<p[^>]*>/gi, '');
                          
                          args.content = content;
                        }
                      }}
                      placeholder="Start typing or paste content from Word documents. You can include headings, tables, lists, and formatted text..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Manage Tabs Tab */}
            {activeTab === 'tabs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Manage Tabs
                  </h3>
                  <button
                    onClick={() => setShowAddTabModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tab
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(editingData.tabs || []).map((tab) => (
                    <div
                      key={tab.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTab(tab.id);
                            setNewTabName(tab.label);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTab(tab.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Changes
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save all changes? This will update the company information.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tab Modal */}
      {showAddTabModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Tab
            </h3>
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Enter tab name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddTab}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Add Tab
              </button>
              <button
                onClick={() => setShowAddTabModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Numbers Editor Modal */}
      <ContactNumbersEditor
        contactData={contactNumbersData}
        onSave={handleSaveContactNumbers}
        onCancel={() => setShowContactNumbersEditor(false)}
        isVisible={showContactNumbersEditor}
      />

      {/* Sidebar Editor Modal */}
      {showSidebarEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Sidebar Navigation</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSidebar}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Sidebar
                </button>
                <button
                  onClick={() => {
                    setShowSidebarEditor(false);
                    setEditingSidebarItem(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <button
                  onClick={handleAddSidebarItem}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Navigation Item
                </button>
              </div>
              
              <div className="space-y-4">
                {sidebarItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Icon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select
                          value={item.icon}
                          onChange={(e) => handleUpdateSidebarItem(item.id, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="📌">📌 Main</option>
                          <option value="📎">📎 Sub</option>
                          <option value="📄">📄 Item</option>
                          <option value="🔗">🔗 Link</option>
                          <option value="📋">📋 List</option>
                          <option value="📝">📝 Note</option>
                          <option value="⚠️">⚠️ Warning</option>
                          <option value="✅">✅ Check</option>
                        </select>
                      </div>
                      
                      {/* Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleUpdateSidebarItem(item.id, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Navigation text"
                        />
                      </div>
                      
                      {/* Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                        <select
                          value={item.level}
                          onChange={(e) => handleUpdateSidebarItem(item.id, 'level', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>Level 1 (Main)</option>
                          <option value={2}>Level 2 (Sub)</option>
                          <option value={3}>Level 3 (Item)</option>
                        </select>
                      </div>
                      
                      {/* Target */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target (Navigation)</label>
                        <input
                          type="text"
                          value={item.target}
                          onChange={(e) => handleUpdateSidebarItem(item.id, 'target', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="#section-id or URL"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleDeleteSidebarItem(item.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {sidebarItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No sidebar items yet. Click "Add Navigation Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPageEditor;
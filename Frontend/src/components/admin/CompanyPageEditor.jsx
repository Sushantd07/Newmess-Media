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
    Eraser,
    Star
  } from 'lucide-react';
  import ContactNumbersEditor from './ContactNumbersEditor';
  import { getContactNumbers, updateContactNumbers } from '../../services/contactNumbersService';
  import { structuredComplaintsService } from '../../services/structuredComplaintsService';
  import TinyMCEEditor from './TinyMCEEditor.jsx';
  import SimpleTabManager from './SimpleTabManager.jsx';

  const CompanyPageEditor = ({ 
    companyData, 
    onSave, 
    onCancel,
    onRefresh,
    isVisible = false 
  }) => {
    const [editingData, setEditingData] = useState({});
    const [activeTab, setActiveTab] = useState('contact');
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    // Removed unused tab management state variables
    const [complaintContent, setComplaintContent] = useState('');
    const richTextRef = useRef(null);
    const [showContactNumbersEditor, setShowContactNumbersEditor] = useState(false);
    const [contactNumbersData, setContactNumbersData] = useState(null);
    const [isLoadingContactNumbers, setIsLoadingContactNumbers] = useState(false);

    const [showSidebarEditor, setShowSidebarEditor] = useState(false);
    const [sidebarItems, setSidebarItems] = useState([]);
    const [editingSidebarItem, setEditingSidebarItem] = useState(null);
    const [isSavingComplaints, setIsSavingComplaints] = useState(false);

    // Initialize editing data
    useEffect(() => {
      if (companyData) {
        setEditingData(JSON.parse(JSON.stringify(companyData)));
        setComplaintContent(companyData.complaintContent || '');
      }
    }, [companyData]);

    // Auto-load contact numbers data when component mounts
    useEffect(() => {
      const loadContactNumbersData = async () => {
        if (editingData?.slug) {
          setIsLoadingContactNumbers(true);
          try {
            const response = await getContactNumbers(editingData.slug);
            if (response.success) {
              setContactNumbersData(response.data.tabData);
            } else {
              // If no contact numbers exist, start with empty data
              setContactNumbersData({});
            }
          } catch (error) {
            console.error('Error auto-loading contact numbers:', error);
            setContactNumbersData({});
          } finally {
            setIsLoadingContactNumbers(false);
          }
        }
      };

      loadContactNumbersData();
    }, [editingData?.slug]);



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

    // Removed unused tab management functions - now handled by SimpleTabManager

    const handleSaveChanges = async () => {
      try {
        console.log('🚀 CompanyPageEditor handleSaveChanges STARTED');
        console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
        console.log('🗄️ Collection: structuredComplaints');
        console.log('💾 Action: POST request to save rich text content');
        
        // Debug: Log all editingData properties
        console.log('🔍 editingData:', editingData);
        console.log('🔍 editingData.slug:', editingData?.slug);
        console.log('🔍 editingData._id:', editingData?._id);
        console.log('🔍 editingData.name:', editingData?.name);
        
        // Check if slug is available, if not try to get from URL
        if (!editingData?.slug) {
          const urlSlug = window.location.pathname.split('/').pop();
          console.log('🔍 Trying to get slug from URL:', urlSlug);
          
          if (urlSlug && urlSlug !== 'complain' && urlSlug !== 'contactnumber' && urlSlug !== 'quickhelp' && urlSlug !== 'videoguide' && urlSlug !== 'overview') {
            console.log('✅ Using slug from URL:', urlSlug);
            editingData.slug = urlSlug;
          } else {
            console.error('❌ No company slug available');
            alert('Error: Company slug not found. Please check if the company data is loaded properly.');
            return;
          }
        }
        
        // First, save the complaint content to structuredComplaints collection
        if (complaintContent && complaintContent.trim() !== '') {
          console.log('📝 Saving complaint content to structuredComplaints collection');
          console.log('🌐 Company Slug:', editingData.slug);
          console.log('📝 Content to save:', complaintContent.substring(0, 100) + '...');
          
          // Prepare structured data for complaints
          const structuredData = {
            richTextContent: complaintContent,
            mainHeading: {
              title: 'Complaint Redressal Process',
              description: `Complaint redressal process for ${editingData.name || editingData.companyName}`
            },
            processingStatus: 'completed',
            lastProcessed: new Date()
          };
          
          console.log('📤 Sending structuredData to structuredComplaints:', structuredData);
          console.log('🌐 API Endpoint: http://localhost:3000/api/structured-complaints/company/' + editingData.slug);
          console.log('📊 Database Collection: structuredComplaints');
          
          // Save to structuredComplaints collection
          const result = await structuredComplaintsService.saveStructuredComplaints(editingData.slug, structuredData);
          console.log('✅ Complaint content saved to structuredComplaints collection');
          console.log('📊 Result:', result);
        }
        
        // Then, save other company data to subcategories collection (excluding complaintContent)
        const dataToSave = {
          ...editingData,
          // Remove complaintContent from subcategories save since it's now in structuredComplaints
          complaintContent: undefined
        };
        
        console.log('📝 Saving other company data to subcategories collection');
        await onSave(dataToSave);
        
        console.log('✅ All data saved successfully');
        setShowSaveModal(false);
        
        alert('✅ Content saved successfully! Complaint content saved to structuredComplaints collection, other data saved to subcategories collection.');
        
        // Try to trigger refresh through parent callback first
        if (onRefresh && typeof onRefresh === 'function') {
          console.log('🔄 Calling parent refresh function...');
          onRefresh();
        }
        
        // Force a page refresh to show the updated content
        console.log('🔄 Forcing page refresh to show updated content...');
        setTimeout(() => {
          // Try to trigger a manual refresh first
          if (window.location.reload) {
            window.location.reload();
          } else {
            // Fallback: navigate to the same page
            window.location.href = window.location.href;
          }
        }, 1500);
        
      } catch (error) {
        console.error('❌ Error saving changes:', error);
        console.error('🚫 Error details:', error.message);
        alert('❌ Error saving content: ' + error.message);
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
      if (richTextRef.current && typeof richTextRef.current.autoConvertHeadings === 'function') {
        try {
          richTextRef.current.autoConvertHeadings();
          alert('Auto-converted headings successfully!');
        } catch (e) {
          console.error('Auto-convert error:', e);
          alert('Error auto-converting headings.');
        }
      } else {
        alert('Editor not ready. Please wait a moment and try again.');
      }
    };

    const handleClearComplaintContent = () => {
      if (window.confirm('Are you sure you want to clear all complaint content? This cannot be undone.')) {
        setComplaintContent('');
        if (richTextRef.current) {
          richTextRef.current.setContent('');
        }
        // Don't save to backend immediately - let user save when ready
      }
    };

    const handleAutoFormatContent = () => {
      if (richTextRef.current) {
        try {
          const editor = richTextRef.current;
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
      if (richTextRef.current) {
        try {
          const editor = richTextRef.current;
          const html = editor.getContent();
          
          // Extract headings from content (more flexible regex)
          const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
          const headings = [];
          let match;

          while ((match = headingRegex.exec(html)) !== null) {
            const level = parseInt(match[1]);
            const text = match[2].replace(/<[^>]*>/g, ''); // Remove HTML tags
            headings.push({ level, text: text.trim() });
          }

          // If no headings found, try to find bold text or large text
          if (headings.length === 0) {
            const boldRegex = /<strong[^>]*>(.*?)<\/strong>/gi;
            const largeTextRegex = /<p[^>]*style="[^"]*font-size:\s*(1[6-9]|2[0-9])px[^"]*"[^>]*>(.*?)<\/p>/gi;
            
            const boldMatches = [];
            while ((match = boldRegex.exec(html)) !== null) {
              boldMatches.push(match[1].replace(/<[^>]*>/g, ''));
            }
            
            const largeTextMatches = [];
            while ((match = largeTextRegex.exec(html)) !== null) {
              largeTextMatches.push(match[2].replace(/<[^>]*>/g, ''));
            }

            if (boldMatches.length === 0 && largeTextMatches.length === 0) {
              alert('No headings found in content. Add H1, H2, H3 tags or bold text to generate table of contents.');
              return;
            }

            // Use bold text or large text as headings
            const allMatches = [...boldMatches, ...largeTextMatches];
            const items = allMatches.map((text, index) => ({
              id: `item-${Date.now()}-${index}`,
              text: text,
              target: `#section-${index}`,
              level: 2,
              icon: '📌'
            }));

            setSidebarItems(items);
            alert(`Generated ${items.length} sidebar items from bold/large text!`);
            return;
          }
          
          // Convert headings to sidebar items
          const items = headings.map((heading, index) => ({
            id: `item-${Date.now()}-${index}`,
            text: heading.text,
            level: heading.level,
            target: `#heading-${index}`,
            icon: heading.level === 1 ? '📌' : heading.level === 2 ? '📎' : '📄'
          }));
          
          setSidebarItems(items);
          alert(`Generated ${items.length} sidebar items from headings!`);
        } catch (error) {
          console.error('Error generating sidebar:', error);
          alert('Error generating sidebar. Please try again.');
        }
      } else {
        alert('Editor not ready. Please wait a moment and try again.');
      }
    };

    const handleRemoveAutoFormat = () => {
      if (richTextRef.current) {
        try {
          const editor = richTextRef.current;
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
        text: 'New Navigation Item',
        level: 1,
        target: '',
        icon: '📌',
        searchText: '' // Text to search for in content
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
      if (richTextRef.current) {
        try {
          const editor = richTextRef.current;
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

    // Save structured complaints content to backend
    const handleSaveStructuredComplaints = async (content) => {
      console.log('🚀 CompanyPageEditor handleSaveStructuredComplaints STARTED');
      console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
      console.log('🗄️ Collection: structuredComplaints');
      console.log('💾 Action: POST request to save rich text content');
      
      // Debug: Log all editingData properties
      console.log('🔍 editingData:', editingData);
      console.log('🔍 editingData.slug:', editingData?.slug);
      console.log('🔍 editingData._id:', editingData?._id);
      console.log('🔍 editingData.name:', editingData?.name);
      
      if (!editingData?.slug) {
        console.error('❌ No company slug available');
        console.error('❌ editingData:', editingData);
        
        // Try to get slug from URL if not available in editingData
        const urlSlug = window.location.pathname.split('/').pop();
        console.log('🔍 Trying to get slug from URL:', urlSlug);
        
        if (urlSlug && urlSlug !== 'complain' && urlSlug !== 'contactnumber' && urlSlug !== 'quickhelp' && urlSlug !== 'videoguide' && urlSlug !== 'overview') {
          console.log('✅ Using slug from URL:', urlSlug);
          editingData.slug = urlSlug;
        } else {
          alert('Error: Company slug not found. Please check if the company data is loaded properly.');
          return;
        }
      }

      if (!content || content.trim() === '') {
        console.error('❌ No content to save');
        alert('Error: No content to save');
        return;
      }

      setIsSavingComplaints(true);
      
      try {
        console.log('🌐 Company Slug:', editingData.slug);
        console.log('📝 Content to save:', content.substring(0, 100) + '...');
        
        // Prepare structured data
        const structuredData = {
          richTextContent: content,
          mainHeading: {
            title: 'Complaint Redressal Process',
            description: `Complaint redressal process for ${editingData.name}`
          },
          processingStatus: 'completed',
          lastProcessed: new Date()
        };
        
        console.log('📤 Sending structuredData:', structuredData);
        console.log('🌐 API Endpoint: http://localhost:3000/api/structured-complaints/company/' + editingData.slug);
        console.log('📊 Database Collection: structuredComplaints');
        
        // Call the service to save data
        const result = await structuredComplaintsService.saveStructuredComplaints(editingData.slug, structuredData);
        
        console.log('✅ CompanyPageEditor save successful');
        console.log('💾 Data saved to structuredComplaints collection');
        console.log('📊 Result:', result);
        
        alert('✅ Content saved successfully to structuredComplaints collection!');
        
        // Force a page refresh to show the updated content
        console.log('🔄 Forcing page refresh to show updated content...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.error('❌ CompanyPageEditor save error:', error);
        console.error('🚫 Failed to save to structuredComplaints collection');
        console.error('🚫 Error details:', error.message);
        alert('❌ Error saving content: ' + error.message);
      } finally {
        setIsSavingComplaints(false);
      }
    };

    const handleSidebarNavigation = (target, text, searchText) => {
      try {
        // First try to find text in the TinyMCE editor
        if (richTextRef.current) {
          const editor = richTextRef.current;
          const editorElement = document.querySelector('.tox-edit-area iframe');
          
          if (editorElement && editorElement.contentDocument) {
            const editorDoc = editorElement.contentDocument;
            const editorBody = editorDoc.body;
            
            // Search for text in editor content
            const searchTerm = searchText || text;
            const walker = document.createTreeWalker(
              editorBody,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            
            let node;
            let foundElement = null;
            while (node = walker.nextNode()) {
              if (node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundElement = node.parentElement;
                break;
              }
            }
            
            if (foundElement) {
              // Scroll to the found element
              foundElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              
              // Highlight the element briefly
              const originalBackground = foundElement.style.backgroundColor;
              const originalBorder = foundElement.style.border;
              
              foundElement.style.backgroundColor = '#fff3cd';
              foundElement.style.border = '2px solid #ffc107';
              
              setTimeout(() => {
                foundElement.style.backgroundColor = originalBackground;
                foundElement.style.border = originalBorder;
              }, 2000);
              
              return;
            }
          }
        }
        
        // Fallback: try to find by target ID
        if (target && target.startsWith('#')) {
          const elementId = target.substring(1);
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.style.backgroundColor = '#fff3cd';
            element.style.border = '2px solid #ffc107';
            setTimeout(() => {
              element.style.backgroundColor = '';
              element.style.border = '';
            }, 2000);
            return;
          }
        }
        
        // Last resort: search in any visible text
        const allElements = document.querySelectorAll('*');
        for (let el of allElements) {
          if (el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase())) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.style.backgroundColor = '#fff3cd';
            el.style.border = '2px solid #ffc107';
            setTimeout(() => {
              el.style.backgroundColor = '';
              el.style.border = '';
            }, 2000);
            break;
          }
        }
        
      } catch (error) {
        console.error('Navigation error:', error);
        alert(`Could not navigate to: ${text}`);
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
                  { id: 'contact', label: 'Contact Numbers', icon: Phone },
                  { id: 'general', label: 'General Info', icon: Building2 },
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
                      Contact Numbers Management
                    </h3>
                    <button
                      onClick={handleOpenContactNumbersEditor}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Edit Contact Numbers
                    </button>
                  </div>

                  {/* Loading State */}
                  {isLoadingContactNumbers && (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading contact numbers...</span>
                      </div>
                    </div>
                  )}

                                  {/* Contact Numbers Display */}
                  {!isLoadingContactNumbers && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Helpline Numbers */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Helpline Numbers
                            </h4>
                          </div>
                          <div className="p-4">
                            {contactNumbersData?.tabs?.numbers?.helplineNumbersSection?.table?.rows ? (
                              <div className="space-y-3">
                                {contactNumbersData.tabs.numbers.helplineNumbersSection.table.rows.map((row, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm font-medium text-gray-700">{row[0]}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-blue-600 font-mono">{row[1]}</span>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(row[1])}
                                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                        title="Copy number"
                                      >
                                        <FileText className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Phone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No helpline numbers configured</p>
                                <p className="text-xs text-gray-400">Click "Edit Contact Numbers" to add</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* All India Numbers */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              All India Numbers
                            </h4>
                          </div>
                          <div className="p-4">
                            {contactNumbersData?.tabs?.numbers?.allIndiaNumbersSection?.table?.rows ? (
                              <div className="space-y-3">
                                {contactNumbersData.tabs.numbers.allIndiaNumbersSection.table.rows.map((row, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div className="flex-1">
                                      <div className="text-sm font-mono text-blue-600">{row[0]}</div>
                                      <div className="text-xs text-gray-600">{row[1]}</div>
                                    </div>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(row[0])}
                                      className="p-1 text-gray-400 hover:text-green-600 rounded"
                                      title="Copy number"
                                    >
                                      <FileText className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Phone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No all India numbers configured</p>
                                <p className="text-xs text-gray-400">Click "Edit Contact Numbers" to add</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Top Contact Cards */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Top Contact Cards
                            </h4>
                          </div>
                          <div className="p-4">
                            {contactNumbersData?.tabs?.numbers?.topContactCards?.cards ? (
                              <div className="space-y-2">
                                {contactNumbersData.tabs.numbers.topContactCards.cards.map((card, index) => (
                                  <div key={index} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                    <div className="text-sm font-medium text-gray-700 mb-1">{card.title}</div>
                                    <div className="text-xs text-blue-600 font-mono">{card.number}</div>
                                    {card.subtitle && (
                                      <div className="text-xs text-gray-500">{card.subtitle}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No top contact cards configured</p>
                                <p className="text-xs text-gray-400">Click "Edit Contact Numbers" to add</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Content */}
                      {/* Quick Actions */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => handleOpenContactNumbersEditor()}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit All Contact Numbers
                      </button>
                      <button
                        onClick={() => {
                          if (contactNumbersData) {
                            const allNumbers = [];
                            if (contactNumbersData.tabs?.numbers?.helplineNumbersSection?.table?.rows) {
                              contactNumbersData.tabs.numbers.helplineNumbersSection.table.rows.forEach((row) => {
                                allNumbers.push(`${row[0]}: ${row[1]}`);
                              });
                            }
                            if (contactNumbersData.tabs?.numbers?.allIndiaNumbersSection?.table?.rows) {
                              contactNumbersData.tabs.numbers.allIndiaNumbersSection.table.rows.forEach((row) => {
                                allNumbers.push(`${row[0]} - ${row[1]}`);
                              });
                            }
                            if (contactNumbersData.tabs?.numbers?.topContactCards?.cards) {
                              contactNumbersData.tabs.numbers.topContactCards.cards.forEach((card) => {
                                allNumbers.push(`${card.title}: ${card.number}`);
                              });
                            }
                            const text = allNumbers.join('\n');
                            navigator.clipboard.writeText(text);
                            alert('All contact numbers copied to clipboard!');
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Copy All Numbers
                      </button>
                      <button
                        onClick={() => {
                          if (contactNumbersData) {
                            console.log('Current contact numbers data:', contactNumbersData);
                            alert('Check console for contact numbers data structure');
                          } else {
                            alert('No contact numbers data available');
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Data Structure
                      </button>
                    </div>
                  </div>

                  {/* Additional Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SMS Services */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          SMS Services
                        </h4>
                      </div>
                      <div className="p-4">
                        {contactNumbersData?.tabs?.numbers?.smsServicesSection?.services ? (
                          <div className="space-y-3">
                            {contactNumbersData.tabs.numbers.smsServicesSection.services.map((service, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded">
                                <div className="text-sm font-medium text-gray-700 mb-1">{service.description}</div>
                                <div className="text-xs text-blue-600 font-mono mb-1">Code: {service.code}</div>
                                <div className="text-xs text-gray-600">To: {service.number}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No SMS services configured</p>
                            <p className="text-xs text-gray-400">Click "Edit Contact Numbers" to add</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Support */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="bg-orange-600 text-white px-4 py-3 rounded-t-lg">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Email Support
                        </h4>
                      </div>
                      <div className="p-4">
                        {contactNumbersData?.tabs?.numbers?.emailSupportSection?.table?.rows ? (
                          <div className="space-y-3">
                            {contactNumbersData.tabs.numbers.emailSupportSection.table.rows.map((row, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded">
                                <div className="text-sm font-medium text-gray-700 mb-1">{row[0]}</div>
                                <div className="text-xs text-blue-600 font-mono">{row[1]}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No email support configured</p>
                            <p className="text-xs text-gray-400">Click "Edit Contact Numbers" to add</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              )}

              {/* Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Contact Numbers Management:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Helpline Numbers:</strong> Service-specific contact numbers with 24x7 availability</li>
                      <li>• <strong>All India Numbers:</strong> General customer care and support numbers</li>
                      <li>• <strong>Top Contact Cards:</strong> Main contact numbers displayed prominently</li>
                      <li>• <strong>SMS Services:</strong> SMS codes and numbers for various services</li>
                      <li>• <strong>Email Support:</strong> Email addresses for different support categories</li>
                      <li>• <strong>Quick Actions:</strong> Copy numbers, edit data, and view data structure</li>
                      <li>• <strong>Real-time Updates:</strong> Changes are saved immediately to the database</li>
                    </ul>
                  </div>
                </div>
              </div>

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
                      <button
                        onClick={() => {
                          const sampleContent = `
  <h1 style="font-size: 24px;">HDFC Bank Complaint Resolution Guide</h1>

  <p>This comprehensive guide provides multiple methods to file complaints with HDFC Bank and get your issues resolved quickly.</p>

  <h2 style="font-size: 18px;">Method 1: Phone Banking</h2>
  <p>Call HDFC Bank's dedicated customer service number:</p>
  <ul>
  <li>24/7 Customer Care: 1800-202-6161</li>
  <li>NRI Support: 1800-202-6161</li>
  <li>Credit Card Support: 1800-266-4332</li>
  </ul>

  <h2 style="font-size: 18px;">Method 2: Online Portal</h2>
  <p>Visit the official HDFC Bank complaint portal:</p>
  <ol>
  <li>Go to: https://www.hdfcbank.com/personal/ways-to-bank/customer-service</li>
  <li>Select "Customer" for general users</li>
  <li>Click "Submit a Complaint"</li>
  <li>Fill in your details and complaint description</li>
  <li>Submit and note your complaint number</li>
  </ol>

  <h2 style="font-size: 18px;">Method 3: Branch Visit</h2>
  <p>Visit your nearest HDFC Bank branch:</p>
  <ul>
  <li>Locate your nearest branch using the branch locator</li>
  <li>Carry your ID proof and account details</li>
  <li>Meet with the branch manager or customer service officer</li>
  <li>Submit your complaint in writing</li>
  </ul>

  <h3 style="font-size: 16px;">Contact Information</h3>
  <p>For additional support, you can contact:</p>
  <ul>
  <li>Email: support@hdfcbank.com</li>
  <li>Website: www.hdfcbank.com</li>
  <li>Mobile App: HDFC Bank Mobile Banking</li>
  </ul>

  <h3 style="font-size: 16px;">Important Notes</h3>
  <p>Always keep a record of your complaint number and follow up regularly. Most complaints are resolved within 7-10 working days.</p>
                          `;
                          if (richTextRef.current) {
                            richTextRef.current.setContent(sampleContent);
                            setComplaintContent(sampleContent);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                        title="Load sample content with headings"
                      >
                        📝 Load Sample
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
                  
                  {/* SAVE BUTTON ABOVE TEXT EDITOR - PROMINENT AND CLEAR */}
                  <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Save className="w-6 h-6 text-green-600" />
                        <div>
                          <span className="text-lg font-bold text-green-800">Save Rich Text Editor Content</span>
                          <div className="text-sm text-green-700 mt-1">
                            💾 Saves to <strong>structuredComplaints</strong> collection via <strong>/api/structured-complaints/company/{editingData.slug}</strong>
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-bold shadow-lg transition-all duration-200 flex items-center gap-3 hover:scale-105 border-2 border-green-500"
                        onClick={() => {
                          console.log('🔘 SAVE BUTTON ABOVE TEXT EDITOR Clicked');
                          console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
                          console.log('🗄️ Collection: structuredComplaints');
                          if (richTextRef.current) {
                            const content = richTextRef.current.getContent();
                            console.log('📝 Content to save:', content.substring(0, 100) + '...');
                            console.log('📝 Word formatting preserved:', content.includes('style=') || content.includes('font-size') || content.includes('font-weight'));
                            handleSaveStructuredComplaints(content);
                          } else {
                            console.error('❌ Editor ref not available');
                          }
                        }}
                        disabled={isSavingComplaints}
                        type="button"
                      >
                        {isSavingComplaints ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Saving to Database...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Content to Backend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    {/* Sidebar - 25% width */}
                    <div className="w-1/4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      {/* Sidebar Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <List className="w-5 h-5 text-blue-600" />
                            <h4 className="text-sm font-semibold text-gray-800">Table of Contents</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                // Enable editing mode for all items
                                if (sidebarItems.length > 0) {
                                  setEditingSidebarItem(sidebarItems[0].id);
                                }
                              }}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
                              title="Quick Edit Mode"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleGenerateSidebar}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                              title="Generate from headings"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sidebar Content */}
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {sidebarItems.length > 0 ? (
                          <div className="space-y-1">
                            {sidebarItems.map((item, index) => (
                              <div key={item.id} className="group">
                                                                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    {editingSidebarItem === item.id ? (
                                      // Inline editing mode
                                      <div className="flex-1 flex items-center gap-2">
                                        <select
                                          value={item.icon}
                                          onChange={(e) => handleUpdateSidebarItem(item.id, 'icon', e.target.value)}
                                          className="text-xs border border-gray-300 rounded px-1 py-1"
                                        >
                                          <option value="📌">📌</option>
                                          <option value="📎">📎</option>
                                          <option value="📄">📄</option>
                                          <option value="🔗">🔗</option>
                                          <option value="📍">📍</option>
                                          <option value="⭐">⭐</option>
                                          <option value="📞">📞</option>
                                          <option value="🌐">🌐</option>
                                          <option value="📧">📧</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={item.text}
                                          onChange={(e) => handleUpdateSidebarItem(item.id, 'text', e.target.value)}
                                          className="flex-1 text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Navigation text"
                                          style={{ marginLeft: `${(item.level - 1) * 12}px` }}
                                        />
                                        <input
                                          type="text"
                                          value={item.searchText || ''}
                                          onChange={(e) => handleUpdateSidebarItem(item.id, 'searchText', e.target.value)}
                                          className="flex-1 text-sm border border-green-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                                          placeholder="Text to search"
                                        />
                                        <button
                                          onClick={() => setEditingSidebarItem(null)}
                                          className="p-1 text-green-600 hover:text-green-800 rounded"
                                          title="Save"
                                        >
                                          <Check className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      // Display mode
                                      <>
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleSidebarNavigation(item.target, item.text, item.searchText);
                                          }}
                                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 flex-1 cursor-pointer"
                                          title={`Navigate to: ${item.searchText || item.text}`}
                                          style={{ marginLeft: `${(item.level - 1) * 12}px` }}
                                        >
                                          <span className="text-xs">{item.icon}</span>
                                          <span className="truncate">{item.text}</span>
                                          {item.searchText && (
                                            <span className="text-xs text-gray-400 ml-1">({item.searchText})</span>
                                          )}
                                        </a>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => setEditingSidebarItem(item.id)}
                                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                            title="Edit"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteSidebarItem(item.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <List className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500 mb-2">No sidebar items yet</p>
                            <p className="text-xs text-gray-400">Click the document icon to generate from headings</p>
                          </div>
                        )}
                        
                        {/* Instructions */}
                        {sidebarItems.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-xs text-blue-700 mb-2">
                              <strong>💡 How to Edit:</strong>
                            </p>
                            <ul className="text-xs text-blue-600 space-y-1">
                              <li>• Click the <Edit3 className="w-3 h-3 inline" /> icon next to any item to edit inline</li>
                              <li>• <strong>Navigation Text:</strong> What users see in the sidebar</li>
                              <li>• <strong>Search Text:</strong> Exact text to find in your content</li>
                              <li>• Click the <Check className="w-3 h-3 inline" /> to save changes</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {/* Sidebar Footer */}
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button
                        onClick={handleAddSidebarItem}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                      
                      <button
                        onClick={() => {
                          // Add some sample navigation items
                          const sampleItems = [
                            {
                              id: `sample-${Date.now()}-1`,
                              text: 'Phone Banking',
                              searchText: 'Phone Banking',
                              target: '',
                              level: 2,
                              icon: '📞'
                            },
                            {
                              id: `sample-${Date.now()}-2`,
                              text: 'Online Portal',
                              searchText: 'Online Portal',
                              target: '',
                              level: 2,
                              icon: '🌐'
                            },
                            {
                              id: `sample-${Date.now()}-3`,
                              text: 'Contact Information',
                              searchText: 'Contact Information',
                              target: '',
                              level: 3,
                              icon: '📧'
                            }
                          ];
                          setSidebarItems([...sidebarItems, ...sampleItems]);
                        }}
                        className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        🧪 Add Sample Items
                      </button>
                      </div>
                    </div>

                    {/* Main Editor - 75% width */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complaint Process Content
                      </label>
                      <TinyMCEEditor
                        ref={richTextRef}
                        initialValue={complaintContent}
                        onSave={(content) => {
                          console.log('🔄 TinyMCEEditor onSave called with content length:', content?.length || 0);
                          console.log('📝 Word formatting preserved:', content.includes('style=') || content.includes('font-size') || content.includes('font-weight'));
                          setComplaintContent(content);
                          handleSaveStructuredComplaints(content);
                        }}
                        onCancel={() => {}}
                        isVisible={true}
                        title="Complaint Process Editor"
                        placeholder="Start typing or paste content from Word..."
                        height={400}
                        showToolbar={true}
                        showPreview={false}
                        className="w-full"
                        isInline={true}
                        showSaveButton={false}
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
                  </div>
                  
                  <SimpleTabManager 
                    companyData={editingData}
                    onSave={(updatedData) => {
                      setEditingData(updatedData);
                      // Trigger a refresh if needed
                      if (onRefresh) {
                        onRefresh();
                      }
                    }}
                  />
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

        

        {/* Contact Numbers Editor Modal */}
        <ContactNumbersEditor
          contactData={contactNumbersData}
          onSave={handleSaveContactNumbers}
          onCancel={() => setShowContactNumbersEditor(false)}
          isVisible={showContactNumbersEditor}
        />

        {/* Floating Save Button - Always Visible */}
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-700 hover:to-green-800 text-base font-bold shadow-2xl transition-all duration-200 flex items-center gap-3 hover:scale-110 border-2 border-white transform hover:shadow-2xl"
            onClick={() => {
              console.log('🔘 Floating Save Button Clicked');
              console.log('📍 Route: /api/structured-complaints/company/{companySlug}');
              console.log('🗄️ Collection: structuredComplaints');
              if (richTextRef.current) {
                const content = richTextRef.current.getContent();
                console.log('📝 Content to save:', content.substring(0, 100) + '...');
                console.log('📝 Word formatting preserved:', content.includes('style=') || content.includes('font-size') || content.includes('font-weight'));
                handleSaveStructuredComplaints(content);
              } else {
                console.error('❌ Editor ref not available');
              }
            }}
            disabled={isSavingComplaints}
            title="Save Content to Database"
          >
            {isSavingComplaints ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Save Content
              </>
            )}
          </button>
        </div>

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
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                        
                        {/* Search Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Search Text</label>
                          <input
                            type="text"
                            value={item.searchText || ''}
                            onChange={(e) => handleUpdateSidebarItem(item.id, 'searchText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Text to find in content"
                          />
                        </div>
                        
                        {/* Target */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target (Optional)</label>
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
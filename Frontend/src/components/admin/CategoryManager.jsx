import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Star, CheckCircle, X, Save, ArrowLeft, Eye as EyeIcon, Settings, Monitor, ChevronUp, ChevronDown, Upload, FileImage, Trash2 as TrashIcon } from 'lucide-react';
import CategoryArrangementModal from './CategoryArrangementModal.jsx';

const CategoryManager = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📁',
    color: '#3B82F6',
    order: 0,
    isActive: true,
    featured: false,
    showOnFrontPage: false,
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    badges: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [keywordInput, setKeywordInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showArrangementModal, setShowArrangementModal] = useState(false);
  const [showFrontPageModal, setShowFrontPageModal] = useState(false);
  const [frontPageCategories, setFrontPageCategories] = useState([]);
  const [maxFrontPageCategories, setMaxFrontPageCategories] = useState(8);
  // Icon upload states
  const [iconUpload, setIconUpload] = useState({
    file: null,
    preview: null,
    uploading: false,
    error: null
  });

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleKeywordInput = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#3B82F6',
      order: 0,
      isActive: true,
      featured: false,
      showOnFrontPage: false,
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      badges: []
    });
    setIconUpload({
      file: null,
      preview: null,
      uploading: false,
      error: null
    });
    setKeywordInput('');
    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Form validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Category name is required' });
      setLoading(false);
      return;
    }

    try {
      const url = isEditing 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories/create';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Category updated successfully!' : 'Category created successfully!' 
        });
        resetForm();
        fetchCategories();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save category' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6',
      order: category.order || 0,
      isActive: category.isActive !== undefined ? category.isActive : true,
      featured: category.featured || false,
      showOnFrontPage: category.showOnFrontPage || false,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      keywords: category.keywords || [],
      badges: category.badges || []
    });
    // Set icon preview if category has an icon
    if (category.icon && category.icon.startsWith('/')) {
      setIconUpload(prev => ({
        ...prev,
        preview: category.icon
      }));
    }
    setIsEditing(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Category deleted successfully!' });
        setDeleteConfirm(null);
        fetchCategories();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete category' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Front Page Management Functions
  const handleFrontPageSetup = () => {
    // Initialize with current front page categories or default to first 8
    const currentFrontPage = categories.filter(cat => cat.showOnFrontPage).slice(0, maxFrontPageCategories);
    setFrontPageCategories(currentFrontPage.length > 0 ? currentFrontPage : categories.slice(0, maxFrontPageCategories));
    setShowFrontPageModal(true);
  };

  const handleFrontPageSave = async () => {
    try {
      // Update categories with front page settings
      const updatePromises = frontPageCategories.map((category, index) => {
        return fetch(`/api/categories/${category._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...category,
            showOnFrontPage: true,
            frontPageOrder: index + 1
          })
        });
      });

      // Also update categories that are no longer on front page
      const categoriesToRemove = categories.filter(cat => 
        !frontPageCategories.find(fpc => fpc._id === cat._id)
      );
      
      const removePromises = categoriesToRemove.map(category => {
        return fetch(`/api/categories/${category._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...category,
            showOnFrontPage: false,
            frontPageOrder: null
          })
        });
      });

      await Promise.all([...updatePromises, ...removePromises]);
      
      setMessage({ type: 'success', text: 'Front page categories updated successfully!' });
      setShowFrontPageModal(false);
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update front page categories' });
    }
  };

  const addCategoryToFrontPage = (category) => {
    if (frontPageCategories.length < maxFrontPageCategories) {
      setFrontPageCategories(prev => [...prev, category]);
    }
  };

  const removeCategoryFromFrontPage = (categoryId) => {
    setFrontPageCategories(prev => prev.filter(cat => cat._id !== categoryId));
  };

  const moveCategoryUp = (index) => {
    if (index > 0) {
      const newOrder = [...frontPageCategories];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setFrontPageCategories(newOrder);
    }
  };

  const moveCategoryDown = (index) => {
    if (index < frontPageCategories.length - 1) {
      const newOrder = [...frontPageCategories];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setFrontPageCategories(newOrder);
    }
  };

  // Icon Upload Functions
  const handleIconFileSelect = (file) => {
    if (!file) return;

    // Debug logging
    console.log('🔍 File selected:', file);
    console.log('🔍 File name:', file.name);
    console.log('🔍 File type:', file.type);
    console.log('🔍 File size:', file.size, 'bytes');
    console.log('🔍 File extension:', file.name.split('.').pop().toLowerCase());

    // Validate file type - support multiple image formats
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    console.log('🔍 Allowed types:', allowedTypes);
    console.log('🔍 Allowed extensions:', allowedExtensions);
    console.log('🔍 File extension:', fileExtension);
    console.log('🔍 Is type allowed?', allowedTypes.includes(file.type));
    console.log('🔍 Is extension allowed?', allowedExtensions.includes(fileExtension));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      console.log('❌ File type validation failed');
      setIconUpload(prev => ({
        ...prev,
        error: 'Please select an image file (SVG, PNG, JPG, GIF, WebP)'
      }));
      return;
    }

    console.log('✅ File type validation passed');

    // Validate file size (max 2MB for all image types)
    console.log('🔍 File size validation - Max allowed:', 2 * 1024 * 1024, 'bytes');
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ File size validation failed - File too large');
      setIconUpload(prev => ({
        ...prev,
        error: 'File size must be less than 2MB'
      }));
      return;
    }
    console.log('✅ File size validation passed');

    // Create preview
    console.log('🔍 Starting file preview creation...');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log('🔍 File preview created successfully');
      console.log('🔍 Preview result length:', e.target.result.length);
      setIconUpload(prev => ({
        ...prev,
        file,
        preview: e.target.result,
        error: null
      }));
    };
    
    reader.onerror = (error) => {
      console.error('❌ Error reading file:', error);
    };
    
    // For SVG files, read as text. For other images, read as data URL
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      console.log('🔍 Reading SVG file as text...');
      reader.readAsText(file);
    } else {
      console.log('🔍 Reading image file as data URL...');
      reader.readAsDataURL(file);
    }
  };

  const handleIconDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleIconFileSelect(file);
  };

  const handleIconDragOver = (e) => {
    e.preventDefault();
  };

  const uploadIcon = async () => {
    if (!iconUpload.file) return;

    console.log('🔍 Starting icon upload...');
    console.log('🔍 File to upload:', iconUpload.file);
    console.log('🔍 Category name:', formData.name || 'category');

    setIconUpload(prev => ({ ...prev, uploading: true, error: null }));

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('icon', iconUpload.file);
      
      // Send category name for custom filename
      const categoryName = formData.name || 'category';
      uploadFormData.append('categoryName', categoryName);
      
      console.log('🔍 FormData created with file and category name:', categoryName);

      console.log('🔍 Making API request to /api/categories/upload-icon');
      const response = await fetch('/api/categories/upload-icon', {
        method: 'POST',
        body: uploadFormData
      });

      console.log('🔍 API response status:', response.status);
      console.log('🔍 API response headers:', response.headers);
      
      const data = await response.json();
      console.log('🔍 API response data:', data);

      if (data.success) {
        // Update form data with the new icon path
        setFormData(prev => ({
          ...prev,
          icon: data.iconPath
        }));

        // Update preview to show the uploaded icon
        setIconUpload(prev => ({
          ...prev,
          preview: data.iconPath,
          file: null
        }));

        setMessage({ type: 'success', text: 'Icon uploaded successfully!' });
      } else {
        setIconUpload(prev => ({
          ...prev,
          error: data.message || 'Failed to upload icon'
        }));
      }
    } catch (error) {
      setIconUpload(prev => ({
        ...prev,
        error: 'Network error. Please try again.'
      }));
    } finally {
      setIconUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  const removeIcon = () => {
    setFormData(prev => ({ ...prev, icon: '' }));
    setIconUpload({
      file: null,
      preview: null,
      uploading: false,
      error: null
    });
  };

  const iconOptions = [
    '📁', '🏢', '🏦', '📱', '💻', '🚗', '✈️', '🏥', '🎓', '🛒', '🍕', '🏠', '⚡', '💡', '🔧', '📞', '📧', '🌐', '💰', '📊'
  ];

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  // Preview Component
  const CategoryPreview = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <EyeIcon className="h-4 w-4" />
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </div>
      
      {showPreview && (
        <div className="space-y-4">
          {/* Exact AllCategories Page Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
            <h4 className="font-medium text-gray-900 mb-3">How it appears on All Categories page:</h4>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-orange-50 hover:border-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: formData.color || '#f97316' }}
                    >
                      <span className="text-2xl">{formData.icon}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {formData.order || 0}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {formData.name || 'Category Name'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {formData.description || 'Category description will appear here...'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 text-sm font-medium group-hover:underline">
                    View All →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CategoryGrid Component Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h4 className="font-medium text-gray-900 mb-3">How it appears in CategoryGrid component:</h4>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4">
              <div className="grid grid-cols-4 gap-4">
                <button
                  className="flex flex-col items-center rounded-lg p-3 shadow-sm border border-orange-500 bg-orange-50 scale-105 shadow-md hover:bg-orange-100 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-1 text-xl">
                    <span className="text-orange-600">{formData.icon}</span>
                  </div>
                  <span className="text-xs text-gray-700 font-semibold text-center">
                    {formData.name || 'Category Name'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* SEO Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <h4 className="font-medium text-gray-900 mb-3">SEO Information:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">URL Slug:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  /category/{formData.slug || 'category-slug'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Keywords:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.keywords.length > 0 ? (
                    formData.keywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No keywords added</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Manager</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage categories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFrontPageSetup}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Manage Front Page Categories"
          >
            <Monitor className="h-4 w-4" />
            Front Page Setup
          </button>
          <button
            onClick={() => setShowArrangementModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Arrange Category Order"
          >
            <Settings className="h-4 w-4" />
            Arrange Categories
          </button>
          {isEditing && (
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Create
          </button>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Create New Category</h2>
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Banking"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badges (e.g., Banking · Government · Public Sector)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.badges) ? formData.badges.join(' · ') : ''}
                  onChange={(e) => {
                    const parts = e.target.value.split('·').map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, badges: parts }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Banking · Government · Public Sector"
                />
                <p className="text-xs text-gray-500 mt-1">Use the middle dot separator (·). Stored as an array.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  {/* Icon Upload Area */}
                  <div className="space-y-3">
                    {/* Current Icon Display */}
                    {formData.icon && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                          {formData.icon.startsWith('/') ? (
                            <img src={formData.icon} alt="Category Icon" className="w-6 h-6" />
                          ) : (
                            <span className="text-xl">{formData.icon}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Current Icon</p>
                          <p className="text-xs text-gray-500">{formData.icon}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        iconUpload.file || iconUpload.preview
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      onDrop={handleIconDrop}
                      onDragOver={handleIconDragOver}
                    >
                      <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg,.gif,.webp"
                        onChange={(e) => handleIconFileSelect(e.target.files[0])}
                        className="hidden"
                        id="icon-upload"
                      />
                      
                      {!iconUpload.file && !iconUpload.preview ? (
                        <label htmlFor="icon-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            Drop image file here or <span className="text-blue-600 hover:text-blue-700">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SVG, PNG, JPG, GIF, WebP files, max 2MB
                          </p>
                        </label>
                      ) : (
                        <div className="space-y-3">
                          {/* Preview */}
                          <div className="flex items-center justify-center">
                            {iconUpload.preview && (
                              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                                {iconUpload.preview.includes('<svg') ? (
                                  // SVG content - render as HTML
                                  <div 
                                    className="w-10 h-10"
                                    dangerouslySetInnerHTML={{ __html: iconUpload.preview }}
                                  />
                                ) : iconUpload.preview.startsWith('data:') ? (
                                  // Data URL (PNG/JPG) - render as img tag
                                  <img src={iconUpload.preview} alt="Preview" className="w-10 h-10 object-contain" />
                                ) : iconUpload.preview.startsWith('/') ? (
                                  // File path - render as img tag
                                  <img src={iconUpload.preview} alt="Preview" className="w-10 h-10 object-contain" />
                                ) : (
                                  // Fallback
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Preview</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Upload Button */}
                          {iconUpload.file && (
                            <button
                              type="button"
                              onClick={uploadIcon}
                              disabled={iconUpload.uploading}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {iconUpload.uploading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Upload Icon
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Error Display */}
                    {iconUpload.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        {iconUpload.error}
                      </div>
                    )}
                  </div>
                </div>


              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (Press Enter to add)
                </label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type keyword and press Enter"
                />
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-generated fields display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Auto-generated fields (click to edit):</h4>
                <div className="text-sm">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug:</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Auto-generated slug"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 This field is auto-generated but can be manually edited if needed
                </p>
              </div>

              {/* Status Checkboxes */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showOnFrontPage"
                    checked={formData.showOnFrontPage}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show on Front Page</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isEditing ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <CategoryPreview />
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Existing Categories</h2>
          <p className="text-gray-600 mt-1">Manage your categories</p>
        </div>
        
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-600">Create your first category to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl overflow-hidden"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      >
                        {(() => {
                          // Debug logging
                          console.log(`🔍 Category: ${category.name}`);
                          console.log(`🔍 Icon value:`, category.icon);
                          console.log(`🔍 Icon type:`, typeof category.icon);
                          console.log(`🔍 Starts with /:`, category.icon && category.icon.startsWith('/'));
                          console.log(`🔍 Contains <svg:`, category.icon && category.icon.includes('<svg'));
                          console.log(`🔍 Starts with data::`, category.icon && category.icon.startsWith('data:'));
                          
                          if (category.icon && category.icon.startsWith('/')) {
                            if (category.icon.includes('<svg')) {
                              console.log(`✅ Rendering SVG content for ${category.name}`);
                              return (
                                <div 
                                  className="w-8 h-8"
                                  dangerouslySetInnerHTML={{ __html: category.icon }}
                                />
                              );
                            } else {
                              console.log(`✅ Rendering image file for ${category.name}: ${category.icon}`);
                              return (
                                <img 
                                  src={category.icon} 
                                  alt={`${category.name} icon`} 
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => console.error(`❌ Image failed to load: ${category.icon}`, e)}
                                  onLoad={() => console.log(`✅ Image loaded successfully: ${category.icon}`)}
                                />
                              );
                            }
                          } else if (category.icon && category.icon.startsWith('data:')) {
                            console.log(`✅ Rendering data URL for ${category.name}`);
                            return (
                              <img 
                                src={category.icon} 
                                alt={`${category.name} icon`} 
                                className="w-8 h-8 object-contain"
                              />
                            );
                          } else {
                            console.log(`📁 No icon for ${category.name}, showing default`);
                            return '📁';
                          }
                        })()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          {category.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {category.isActive ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <EyeOff className="h-3 w-3" />
                              Inactive
                            </span>
                          )}
                          {category.featured && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          {category.showOnFrontPage && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                              <Monitor className="h-3 w-3" />
                              Front Page
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            Order: {category.order || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? 
              This action cannot be undone and will also delete all associated subcategories.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Front Page Management Modal */}
      {showFrontPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Front Page Category Management</h3>
                <p className="text-gray-600 mt-1">Select which categories appear on the front page and in what order</p>
              </div>
              <button
                onClick={() => setShowFrontPageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Max Categories Setting */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Categories on Front Page
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxFrontPageCategories}
                onChange={(e) => setMaxFrontPageCategories(parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600 mt-1">
                This controls how many categories are displayed on the front page (recommended: 6-12)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Categories */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Categories</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {categories
                    .filter(cat => !frontPageCategories.find(fpc => fpc._id === cat._id))
                    .map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg overflow-hidden"
                            style={{ backgroundColor: category.color || '#3B82F6' }}
                          >
                            {category.icon && category.icon.startsWith('/') ? (
                              category.icon.includes('<svg') ? (
                                // SVG content - render as HTML
                                <div 
                                  className="w-6 h-6"
                                  dangerouslySetInnerHTML={{ __html: category.icon }}
                                />
                              ) : (
                                // Image file - render as img tag
                                <img 
                                  src={category.icon} 
                                  alt={`${category.name} icon`} 
                                  className="w-6 h-6 object-contain"
                                />
                              )
                            ) : category.icon && category.icon.startsWith('data:') ? (
                              // Data URL (PNG/JPG) - render as img tag
                              <img 
                                src={category.icon} 
                                alt={`${category.name} icon`} 
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              '📁'
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{category.name}</h5>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addCategoryToFrontPage(category)}
                          disabled={frontPageCategories.length >= maxFrontPageCategories}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Front Page Categories */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Front Page Categories ({frontPageCategories.length}/{maxFrontPageCategories})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {frontPageCategories.map((category, index) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveCategoryUp(index)}
                            disabled={index === 0}
                            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveCategoryDown(index)}
                            disabled={index === frontPageCategories.length - 1}
                            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg overflow-hidden"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        >
                          {category.icon && category.icon.startsWith('/') ? (
                            category.icon.includes('<svg') ? (
                              // SVG content - render as HTML
                              <div 
                                className="w-6 h-6"
                                dangerouslySetInnerHTML={{ __html: category.icon }}
                              />
                            ) : (
                              // Image file - render as img tag
                              <img 
                                src={category.icon} 
                                alt={`${category.name} icon`} 
                                className="w-6 h-6 object-contain"
                              />
                            )
                          ) : category.icon && category.icon.startsWith('data:') ? (
                            // Data URL (PNG/JPG) - render as img tag
                            <img 
                              src={category.icon} 
                              alt={`${category.name} icon`} 
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            '📁'
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{category.name}</h5>
                          <p className="text-sm text-blue-600">Position {index + 1}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCategoryFromFrontPage(category._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowFrontPageModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFrontPageSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Front Page Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Arrangement Modal */}
      <CategoryArrangementModal
        isOpen={showArrangementModal}
        onClose={() => setShowArrangementModal(false)}
        categories={categories}
        onCategoriesChange={fetchCategories}
      />
    </div>
  );
};

export default CategoryManager;
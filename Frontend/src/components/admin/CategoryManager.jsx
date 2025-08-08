import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Star, CheckCircle, X, Save, ArrowLeft, Eye as EyeIcon } from 'lucide-react';

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
    metaTitle: '',
    metaDescription: '',
    keywords: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [keywordInput, setKeywordInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

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
      icon: '📁',
      color: '#3B82F6',
      order: 0,
      isActive: true,
      featured: false,
      metaTitle: '',
      metaDescription: '',
      keywords: []
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
        ? `http://localhost:3000/api/categories/${editingCategory._id}`
        : 'http://localhost:3000/api/categories/create';
      
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
      icon: category.icon || '📁',
      color: category.color || '#3B82F6',
      order: category.order || 0,
      isActive: category.isActive !== undefined ? category.isActive : true,
      featured: category.featured || false,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      keywords: category.keywords || []
    });
    setIsEditing(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map((icon, index) => (
                      <option key={index} value={icon}>
                        {icon} {icon === '📁' ? 'Folder' : icon === '🏢' ? 'Building' : icon === '🏦' ? 'Bank' : 'Icon'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
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
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      >
                        {category.icon || '📁'}
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
    </div>
  );
};

export default CategoryManager;
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Star, CheckCircle, X, Save, ArrowLeft, Building2, Phone, Globe, Users, Eye as EyeIcon, Copy, Heart, Clock, Check, ArrowRight } from 'lucide-react';

const CompanyManager = () => {
  const [formData, setFormData] = useState({
    // Basic Info
    id: '',
    name: '',
    slug: '',
    phone: '',
    logo: '/company-logos/Bank/placeholder.svg',
    verified: true,
    isActive: true,
    tags: [],
    address: 'All India',
    timing: '24x7',
    parentCategory: '',
    order: 0,
    role: 'Support', // New role field for dynamic label
    customRole: '', // Custom role input field
    
    // Company Details
    description: '',
    companyName: '',
    mainPhone: '',
    website: '',
    founded: '',
    headquarters: '',
    parentCompany: '',
    rating: 4.2,
    totalReviews: 0,
    monthlySearches: '0'
  });

  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tagInput, setTagInput] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(true);

  // Fetch categories and companies on component mount
  useEffect(() => {
    fetchCategories();
    fetchCompanies();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        console.error('Failed to fetch categories for company form:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const data = await response.json();

      if (data.success) {
        setCompanies(data.data);
      } else {
        console.error('Failed to fetch companies:', data.message);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
      slug: generateSlug(name),
      id: generateSlug(name)
    }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      phone: '',
      logo: '/company-logos/Bank/placeholder.svg',
      verified: true,
      isActive: true,
      tags: [],
      address: 'All India',
      timing: '24x7',
      parentCategory: '',
      order: 0,
      role: 'Support',
      customRole: '',
      description: '',
      companyName: '',
      mainPhone: '',
      website: '',
      founded: '',
      headquarters: '',
      parentCompany: '',
      rating: 4.2,
      totalReviews: 0,
      monthlySearches: '0'
    });
    setTagInput('');
    setIsEditing(false);
    setEditingCompany(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Form validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Company name is required' });
      setLoading(false);
      return;
    }

    if (!formData.parentCategory) {
      setMessage({ type: 'error', text: 'Please select a category' });
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required' });
      setLoading(false);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      // Use custom role if available, otherwise use selected role
      role: formData.role === 'custom' && formData.customRole ? formData.customRole : formData.role
    };

    // Remove customRole from submission data as it's not needed in backend
    delete submitData.customRole;

    try {
      console.log('Submitting data:', submitData); // Debug log
      
      const url = isEditing 
        ? `http://localhost:3000/api/subcategories/${editingCompany._id}`
        : 'http://localhost:3000/api/subcategories/create-company-page';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Company updated successfully!' : 'Company created successfully!' 
        });
        resetForm();
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save company' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      id: company.id || company._id,
      name: company.name,
      slug: company.slug,
      phone: company.phone,
      logo: company.logo || '/company-logos/Bank/placeholder.svg',
      verified: company.verified !== undefined ? company.verified : true,
      isActive: company.isActive !== undefined ? company.isActive : true,
      tags: company.tags || [],
      address: company.address || 'All India',
      timing: company.timing || '24x7',
      parentCategory: company.parentCategory || '',
      order: company.order || 0,
      role: company.role || 'Support',
      customRole: '',
      description: company.description || '',
      companyName: company.companyName || '',
      mainPhone: company.mainPhone || '',
      website: company.website || '',
      founded: company.founded || '',
      headquarters: company.headquarters || '',
      parentCompany: company.parentCompany || '',
      rating: company.rating || 4.2,
      totalReviews: company.totalReviews || 0,
      monthlySearches: company.monthlySearches || '0'
    });
    setIsEditing(true);
  };

  const handleDelete = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subcategories/${companyId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Company deleted successfully!' });
        setDeleteConfirm(null);
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete company' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Preview Component
  const CompanyPreview = () => (
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
          {/* Exact CategoryGrid Company Card Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
            <h4 className="font-medium text-gray-900 mb-3">How it appears in CategoryGrid component:</h4>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4">
              <div className="w-full max-w-[320px] mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02] w-full">
                  {/* Top: Logo, Name, Verified, Tag */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                      {formData.logo && formData.logo !== '/company-logos/Bank/placeholder.svg' ? (
                        <img 
                          src={formData.logo} 
                          alt={formData.name || 'Company'} 
                          className="w-10 h-10 object-contain bg-transparent" 
                          style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} 
                        />
                      ) : (
                        <span className="text-gray-300 text-xl font-bold">
                          {(formData.name || 'C')[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900 text-lg truncate cursor-pointer transition-colors duration-200 hover:text-orange-600 hover:underline">
                          {formData.name || 'Company Name'}
                        </span>
                        {formData.verified && <Check className="h-4 w-4 text-green-500" title="Verified" />}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formData.tags && formData.tags.length > 0 ? 
                          formData.tags.join(' · ') : 
                          (formData.role === 'custom' && formData.customRole ? formData.customRole : (formData.role || 'Support'))
                        }
                      </div>
                    </div>
                  </div>
                  {/* Info Row */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      {formData.address || 'All India'}
                    </span>
                    <span className="mx-1 text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formData.timing || 'Mon - Sat, 9 AM - 5 PM'}
                    </span>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-gray-100 my-3" />
                  {/* Contact Row */}
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="font-bold text-gray-900 text-[15px] md:text-[16px] whitespace-nowrap">
                      {formData.phone || 'Phone Number'}
                    </span>
                    <button className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Copy">
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </button>
                    <button className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Favorite">
                      <Heart className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </button>
                  </div>
                  {/* Action Row: Call Now and View More buttons side by side */}
                  <div className="flex flex-nowrap gap-2 mt-1">
                    <button className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-300" style={{ minWidth: 0 }}>
                      <Phone className="h-5 w-5 text-white" /> Call Now
                    </button>
                    <button className="w-1/2 bg-orange-50 border border-orange-200 text-orange-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-orange-100 transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-200" style={{ minWidth: 0 }}>
                      View More <ArrowRight className="h-5 w-5 text-orange-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Page Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h4 className="font-medium text-gray-900 mb-3">How it appears on Company Page:</h4>
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    {formData.logo && formData.logo !== '/company-logos/Bank/placeholder.svg' ? (
                      <img 
                        src={formData.logo} 
                        alt={formData.name || 'Company'} 
                        className="w-12 h-12 object-contain" 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-xl font-bold">
                          {(formData.name || 'C')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {formData.name || 'Company Name'}
                    </h2>
                    {formData.role && (
                      <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30 mt-2">
                        {formData.role === 'custom' && formData.customRole ? formData.customRole : formData.role}
                      </div>
                    )}
                  </div>
                </div>
                {formData.verified && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="text-sm">Verified</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-300 mb-6">
                {formData.description || 'Company description will appear here...'}
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Now: {formData.phone || 'Phone Number'}
                </button>
                {formData.website && (
                  <button className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Company Details Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <h4 className="font-medium text-gray-900 mb-3">Company Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Company Name (Full):</span>
                  <p className="text-gray-600">{formData.companyName || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Founded:</span>
                  <p className="text-gray-600">{formData.founded || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Headquarters:</span>
                  <p className="text-gray-600">{formData.headquarters || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Rating:</span>
                  <p className="text-gray-600">{formData.rating || '0'} / 5</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No tags added</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* URL Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <h4 className="font-medium text-gray-900 mb-3">URL Information:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Company URL:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  /company/{formData.slug || 'company-slug'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Company ID:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  {formData.id || 'auto-generated-id'}
                </span>
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
          <h1 className="text-3xl font-bold text-gray-900">Company Manager</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage company pages</p>
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
        {/* Company Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Edit Company</h2>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Create New Company</h2>
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ICICI Bank"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1800-1080"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Path
                </label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/company-logos/Bank/company_logo.svg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., All India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 24x7 or Mon-Sat 9AM-6PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Press Enter to add tags"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                   Role/Department *
                 </label>
                                   <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        role: newRole,
                        // Clear customRole when switching away from custom
                        customRole: newRole === 'custom' ? prev.customRole : ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                   <option value="Support">Support</option>
                   <option value="Customer Care">Customer Care</option>
                   <option value="Sales">Sales</option>
                   <option value="Technical">Technical</option>
                   <option value="Billing">Billing</option>
                   <option value="Complaints">Complaints</option>
                   <option value="Emergency">Emergency</option>
                   <option value="General">General</option>
                   <option value="custom">Custom (type below)</option>
                 </select>
                                   {formData.role === 'custom' && (
                    <input
                      type="text"
                      name="customRole"
                      value={formData.customRole}
                      placeholder="Enter custom role/department"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      onChange={(e) => setFormData(prev => ({ ...prev, customRole: e.target.value }))}
                    />
                  )}
                 <p className="text-xs text-gray-500 mt-1">
                   This will replace the "Support" label on the contact card
                 </p>
               </div>
            </div>

            <div className="flex items-center space-x-6 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Verified</span>
              </label>
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
            </div>
          </div>

          {/* Company Details Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Full)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ICICI Bank Limited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Phone
                </label>
                <input
                  type="text"
                  name="mainPhone"
                  value={formData.mainPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1800-1080"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <input
                  type="text"
                  name="founded"
                  value={formData.founded}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1994"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headquarters
                </label>
                <input
                  type="text"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Company
                </label>
                <input
                  type="text"
                  name="parentCompany"
                  value={formData.parentCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ICICI Group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4.2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Reviews
                </label>
                <input
                  type="number"
                  name="totalReviews"
                  value={formData.totalReviews}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Searches
                </label>
                <input
                  type="text"
                  name="monthlySearches"
                  value={formData.monthlySearches}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 35K"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a detailed description of the company..."
              />
            </div>
          </div>

                     {/* Auto-generated fields display */}
           <div className="bg-gray-50 p-4 rounded-lg">
             <h4 className="text-sm font-medium text-gray-700 mb-3">Auto-generated fields (click to edit):</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">ID:</label>
                 <input
                   type="text"
                   name="id"
                   value={formData.id}
                   onChange={handleInputChange}
                   className="w-full px-2 py-1 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                   placeholder="Auto-generated ID"
                 />
               </div>
               <div>
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
             </div>
             <p className="text-xs text-gray-500 mt-2">
               💡 These fields are auto-generated but can be manually edited if needed
             </p>
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
                    {isEditing ? <Save className="h-4 w-4" /> : <span>✓</span>}
                    {isEditing ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </button>
                        </div>
          </form>
        </div>

        {/* Live Preview */}
        <CompanyPreview />
      </div>

      {/* Companies List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Existing Companies</h2>
          <p className="text-gray-600 mt-1">Manage your companies</p>
        </div>
        
        <div className="p-6">
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
              <p className="text-gray-600">Create your first company to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <div
                  key={company._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">
                          {company.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {company.phone}
                          </div>
                          {company.website && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Globe className="h-3 w-3" />
                              Website
                            </div>
                          )}
                          {company.isActive ? (
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
                          {company.verified && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                              <Star className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            Role: {company.role || 'Support'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(company)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit company"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(company)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete company"
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Company</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? 
              This action cannot be undone.
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

export default CompanyManager;
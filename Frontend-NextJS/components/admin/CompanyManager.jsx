import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Star, CheckCircle, X, Save, ArrowLeft, Building2, Phone, Globe, Users, Eye as EyeIcon, Copy, Heart, Clock, Check, ArrowRight, AlertCircle, Search, Filter, Grid, List, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal, Settings, Download, Upload } from 'lucide-react';
import LogoUpload from './LogoUpload.jsx';
import CompanyListEnhanced from './CompanyListEnhanced.jsx';


const CompanyManager = () => {
  const [formData, setFormData] = useState({
    // Basic Info
    id: '',
    name: '',
    slug: '',
    phone: '',
    logo: '/company-logos/Bank/placeholder.svg',
    logoFile: null, // For new company logo upload
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
    monthlySearches: '0',
    
    // Tab Selection
    selectedTabs: ['numbers', 'overview', 'complaints', 'quickhelp', 'video']
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tagInput, setTagInput] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

  // Enhanced category management states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'category', 'status', 'created'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [bulkActions, setBulkActions] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  
  // Category arrangement states
  const [showArrangementModal, setShowArrangementModal] = useState(false);
  const [selectedCategoryForArrangement, setSelectedCategoryForArrangement] = useState(null);
  const [categoryDisplayLimits, setCategoryDisplayLimits] = useState({});
  const [arrangementLoading, setArrangementLoading] = useState(false);
  const [companyOrder, setCompanyOrder] = useState({});

  // Fetch categories and companies on component mount
  useEffect(() => {
    fetchCategories();
    fetchCompanies();
  }, []);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('🔍 Categories state updated:', categories.length, 'categories');
    if (categories.length > 0) {
      console.log('🔍 Available categories:', categories.map(cat => ({ id: cat._id, name: cat.name })));
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      // Use proper API base URL like other services
      const API_BASE_URL = 
        ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
        (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
        '/api');
      
      const response = await fetch(`${API_BASE_URL}/categories`);
      console.log('🔍 Categories response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Categories data:', data);

      if (data.success) {
        console.log('✅ Categories loaded:', data.data.length, 'categories');
        setCategories(data.data);
        setCategoriesLoading(false);
      } else {
        console.error('❌ Failed to fetch categories for company form:', data.message);
        setCategoriesLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setCategoriesLoading(false);
      // Retry after 2 seconds
      setTimeout(() => {
        console.log('🔄 Retrying categories fetch...');
        fetchCategories();
      }, 2000);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories`);
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
      // Basic Info
      id: '',
      name: '',
      slug: '',
      phone: '',
      logo: '/company-logos/Bank/placeholder.svg',
      logoFile: null,
      verified: true,
      isActive: true,
      tags: [],
      address: 'All India',
      timing: '24x7',
      parentCategory: '',
      order: 0,
      role: 'Support',
      customRole: '',
      
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
      monthlySearches: '0',
      
      // Tab Selection - Include default tabs
      selectedTabs: ['numbers', 'overview']
    });
    setEditingCompany(null);
    setIsEditing(false);
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
    
    // Include selected tabs in submission
    if (formData.selectedTabs.length > 0) {
      submitData.tabs = formData.selectedTabs;
    }
    
    // For new companies, use only the selected tabs (no automatic defaults)
    if (!isEditing) {
      submitData.selectedTabs = formData.selectedTabs || [];
    }

    try {
      
      
      let response;
      
      if (isEditing) {
        // For editing, use JSON
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/${editingCompany._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        // For new company, handle logo file upload
        if (formData.logoFile) {
          const formDataToSend = new FormData();
          
          // Add all form data
          Object.keys(submitData).forEach(key => {
            if (key !== 'logoFile' && key !== 'logo') {
              if (Array.isArray(submitData[key])) {
                // For arrays, send each element individually with the same key
                submitData[key].forEach((item, index) => {
                  formDataToSend.append(`${key}[${index}]`, item);
                });
              } else if (typeof submitData[key] === 'boolean') {
                formDataToSend.append(key, submitData[key].toString());
              } else if (submitData[key] !== null && submitData[key] !== undefined) {
                formDataToSend.append(key, submitData[key]);
              }
            }
          });
          
          // Add category name for proper folder organization
          if (submitData.parentCategory) {
            const selectedCategory = categories.find(cat => cat._id === submitData.parentCategory);
            if (selectedCategory) {
              formDataToSend.append('categoryName', selectedCategory.name);
              console.log('📁 Adding category name for upload:', selectedCategory.name);
            }
          }
          
          // Add logo file (not the blob URL)
          formDataToSend.append('logo', formData.logoFile);
          
          console.log('Sending FormData with logo file:', formData.logoFile.name);
          response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/create-company-page`, {
            method: 'POST',
            body: formDataToSend,
          });
        } else if (formData.logo && formData.logo.startsWith('blob:')) {
          // If we have a blob URL but no file, skip logo for now
          console.log('Blob URL detected but no file available, skipping logo upload');
          response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/create-company-page`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
          });
        } else {
          // No logo file, use JSON
          response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/create-company-page`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
          });
        }
      }

      const data = await response.json();
      

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Company updated successfully!' : `Company created successfully! ${data.data?.createdTabs ? 'All selected tabs have been automatically created.' : ''}` 
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
      logoFile: null,
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
      monthlySearches: company.monthlySearches || '0',
      selectedTabs: company.selectedTabs || []
    });
    setIsEditing(true);
  };

  const handleDelete = async (companyId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/${companyId}`, {
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

  const handleDeleteCategory = async (categoryId, categoryName) => {
    try {
      // First, get all companies in this category
      const companiesInCategory = companies.filter(company => 
        company.parentCategory === categoryId || company.parentCategory._id === categoryId
      );

      if (companiesInCategory.length === 0) {
        setMessage({ type: 'error', text: 'No companies found in this category' });
        setDeleteCategoryConfirm(null);
        return;
      }

      // Delete all companies in the category
      const deletePromises = companiesInCategory.map(company => 
        fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/${company._id}`, {
          method: 'DELETE',
        })
      );

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all deletions were successful
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setMessage({ 
          type: 'success', 
          text: `Successfully deleted ${companiesInCategory.length} companies from "${categoryName}" category!` 
        });
        setDeleteCategoryConfirm(null);
        fetchCompanies();
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Some companies could not be deleted. Please try again.' 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleCreateDefaultTabs = async (company) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subcategories/company/${company.slug}/create-default-tabs`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `Default tabs created for "${company.name}" successfully!` });
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create default tabs' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  // Category arrangement functions
  const handleOpenArrangementModal = (category) => {
    setSelectedCategoryForArrangement(category);
    setShowArrangementModal(true);
  };

  const handleSaveCategoryArrangement = async () => {
    if (!selectedCategoryForArrangement) return;

    setArrangementLoading(true);
    try {
      // Get the ordered company IDs for this category
      const orderedCompanyIds = companyOrder[selectedCategoryForArrangement._id] || [];
      
      // Update the order of companies in this category
      const updatePromises = orderedCompanyIds.map((companyId, index) => 
        fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${companyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order: index + 1,
            parentCategory: selectedCategoryForArrangement._id
          }),
        })
      );

      await Promise.all(updatePromises);

      setMessage({ 
        type: 'success', 
        text: `Company order updated for "${selectedCategoryForArrangement.name}" category!` 
      });
      setShowArrangementModal(false);
      setSelectedCategoryForArrangement(null);
      // Refresh companies to get updated data
      fetchCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setArrangementLoading(false);
    }
  };

  const handleDisplayLimitChange = (categoryId, value) => {
    setCategoryDisplayLimits(prev => ({
      ...prev,
      [categoryId]: parseInt(value) || 6
    }));
  };

  const handleCompanyOrderChange = (categoryId, companyId, newIndex) => {
    setCompanyOrder(prev => {
      const currentOrder = prev[categoryId] || [];
      const newOrder = [...currentOrder];
      
      // Remove company from current position
      const currentIndex = newOrder.indexOf(companyId);
      if (currentIndex > -1) {
        newOrder.splice(currentIndex, 1);
      }
      
      // Add company to new position
      newOrder.splice(newIndex, 0, companyId);
      
      return {
        ...prev,
        [categoryId]: newOrder
      };
    });
  };

  const initializeCompanyOrder = (categoryId, companies) => {
    if (!companyOrder[categoryId]) {
      const orderedIds = companies
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(company => company._id);
      
      setCompanyOrder(prev => ({
        ...prev,
        [categoryId]: orderedIds
      }));
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

          {/* Tab Selection Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
            <h4 className="font-medium text-gray-900 mb-3">Selected Tabs:</h4>
            <div className="space-y-2 text-sm">
              {formData.selectedTabs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTabs.map((tabId, index) => {
                    const tabLabels = {
                      'overview': 'Overview',
                      'numbers': 'Contact Numbers',
                      'complaints': 'Complaint Process',
                      'quickhelp': 'Quick Help',
                      'video': 'Video Guide'
                    };
                    return (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tabLabels[tabId] || tabId}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-500 italic">No tabs selected</span>
              )}
              <p className="text-xs text-gray-600 mt-2">
                💡 These tabs will be created for the company and can be managed in the full edit mode
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Enhanced filtering and search functions
  const getFilteredAndSortedCompanies = () => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.parentCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(company => 
        company.parentCategory?._id === selectedCategoryFilter || 
        company.parentCategory === selectedCategoryFilter
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(company => company.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(company => !company.isActive);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(company => company.verified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(company => !company.verified);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.parentCategory?.name?.toLowerCase() || '';
          bValue = b.parentCategory?.name?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.isActive ? 'active' : 'inactive';
          bValue = b.isActive ? 'active' : 'inactive';
          break;
        case 'created':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getPaginatedCompanies = () => {
    const filtered = getFilteredAndSortedCompanies();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getGroupedCompanies = () => {
    const filtered = getFilteredAndSortedCompanies();
    const grouped = {};
    
    filtered.forEach(company => {
      const categoryId = company.parentCategory?._id || company.parentCategory;
      const categoryName = company.parentCategory?.name || 'Uncategorized';
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          name: categoryName,
          companies: []
        };
      }
      grouped[categoryId].companies.push(company);
    });

    return grouped;
  };

  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleBulkAction = async (action) => {
    if (selectedCompanies.size === 0) {
      setMessage({ type: 'error', text: 'Please select companies first' });
      return;
    }

    const selectedCompanyIds = Array.from(selectedCompanies);
    
    try {
      setLoading(true);
      
      switch (action) {
        case 'activate':
          await Promise.all(selectedCompanyIds.map(id => 
            fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: true })
            })
          ));
          setMessage({ type: 'success', text: `${selectedCompanyIds.length} companies activated successfully!` });
          break;
          
        case 'deactivate':
          await Promise.all(selectedCompanyIds.map(id => 
            fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: false })
            })
          ));
          setMessage({ type: 'success', text: `${selectedCompanyIds.length} companies deactivated successfully!` });
          break;
          
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedCompanyIds.length} companies?`)) {
            await Promise.all(selectedCompanyIds.map(id => 
              fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
                method: 'DELETE'
              })
            ));
            setMessage({ type: 'success', text: `${selectedCompanyIds.length} companies deleted successfully!` });
          }
          break;
      }
      
      setSelectedCompanies(new Set());
      fetchCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error performing bulk action' });
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanySelection = (companyId) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId);
    } else {
      newSelected.add(companyId);
    }
    setSelectedCompanies(newSelected);
  };

  const selectAllCompanies = () => {
    const filtered = getFilteredAndSortedCompanies();
    const allIds = filtered.map(company => company._id);
    setSelectedCompanies(new Set(allIds));
  };

  const clearSelection = () => {
    setSelectedCompanies(new Set());
  };

  // Enhanced Companies List Component
  const EnhancedCompaniesList = () => {
    const filteredCompanies = getFilteredAndSortedCompanies();
    const groupedCompanies = getGroupedCompanies();
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const hasSelection = selectedCompanies.size > 0;

    return (
      <div className="bg-white rounded-lg shadow">
        {/* Enhanced Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Existing Companies</h2>
              <p className="text-gray-600 mt-1">
                {filteredCompanies.length} of {companies.length} companies
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
              {/* Delete Contact Numbers Tab for selected company (quick action when editing) */}
              {isEditing && formData.slug && (
                <button
                  onClick={async () => {
                    if (!confirm('Delete Contact Numbers tab for this company?')) return;
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/company/${formData.slug}/contact-numbers`, { method: 'DELETE' });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setMessage({ type: 'success', text: 'Contact Numbers tab deleted and unlinked.' });
                        fetchCompanies();
                      } else {
                        setMessage({ type: 'error', text: data.message || 'Failed to delete contact numbers tab' });
                      }
                    } catch (e) {
                      setMessage({ type: 'error', text: 'Network error. Please try again.' });
                    }
                  }}
                  className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                  title="Delete Contact Numbers tab for this company"
                >
                  Delete Numbers Tab
                </button>
              )}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies by name, phone, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="status">Status</option>
                    <option value="created">Created Date</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {hasSelection && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedCompanies.size} company{selectedCompanies.size !== 1 ? 'ies' : 'y'} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Companies Content */}
        <div className="p-6">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No companies found' : 'No companies yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No companies match your search "${searchTerm}"` 
                  : 'Create your first company to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {Object.entries(groupedCompanies).map(([categoryId, categoryData]) => (
                    <div key={categoryId} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCategoryExpansion(categoryId)}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                            >
                              {expandedCategories.has(categoryId) ? (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-blue-600" />
                              )}
                            </button>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{categoryData.name}</h3>
                              <p className="text-sm text-gray-600">
                                {categoryData.companies.length} company{categoryData.companies.length !== 1 ? 'ies' : 'y'}
                              </p>
                            </div>
                          </div>
                                                  <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenArrangementModal({
                              _id: categoryId,
                              name: categoryData.name,
                              companies: categoryData.companies
                            })}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded transition-colors flex items-center gap-1 text-sm"
                            title="Reorder companies within this category"
                          >
                            <Settings className="h-3 w-3" />
                            Arrange Order
                          </button>
                          <button
                            onClick={() => setDeleteCategoryConfirm({ 
                              id: categoryId, 
                              name: categoryData.name, 
                              count: categoryData.companies.length 
                            })}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors flex items-center gap-1 text-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete All
                          </button>
                        </div>
                        </div>
                      </div>
                      
                      {/* Companies in this category */}
                      {expandedCategories.has(categoryId) && (
                        <div className="divide-y divide-gray-100">
                          {categoryData.companies.map((company) => (
                            <div
                              key={company._id}
                              className={`px-6 py-4 transition-colors ${
                                selectedCompanies.has(company._id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCompanies.has(company._id)}
                                    onChange={() => toggleCompanySelection(company._id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
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
                                        <span className="inline-flex items-center gap-1 text-green-600">
                                          <CheckCircle className="h-3 w-3" />
                                          Active
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-gray-500">
                                          <EyeOff className="h-3 w-3" />
                                          Inactive
                                        </span>
                                      )}
                                      {company.verified && (
                                        <span className="inline-flex items-center gap-1 text-yellow-600">
                                          <Star className="h-3 w-3" />
                                          Verified
                                        </span>
                                      )}
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
                                    onClick={() => handleCreateDefaultTabs(company)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      company.tabs?.numbers && company.tabs?.overview
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                        : 'text-green-600 hover:bg-green-50'
                                    }`}
                                    title={
                                      company.tabs?.numbers && company.tabs?.overview
                                        ? 'Default tabs already exist'
                                        : 'Create default tabs'
                                    }
                                    disabled={company.tabs?.numbers && company.tabs?.overview}
                                  >
                                    {company.tabs?.numbers && company.tabs?.overview ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Plus className="h-4 w-4" />
                                    )}
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
                  ))}
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getPaginatedCompanies().map((company) => (
                    <div
                      key={company._id}
                      className={`border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md ${
                        selectedCompanies.has(company._id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.has(company._id)}
                          onChange={() => toggleCompanySelection(company._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(company)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{company.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{company.parentCategory?.name}</p>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{company.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {company.isActive ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              <EyeOff className="h-3 w-3" />
                              Inactive
                            </span>
                          )}
                          {company.verified && (
                            <span className="inline-flex items-center gap-1 text-yellow-600">
                              <Star className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} results
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
          
          {/* Default Tabs Info */}
          {!isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">ℹ</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Default Tabs Feature</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    When you create a new company, the system automatically creates:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Contact Numbers Tab:</strong> Pre-filled with company contact information</li>
                    <li>• <strong>Overview Tab:</strong> Company details, services, and quick links</li>
                  </ul>
                  <p className="text-sm text-blue-700 mt-2">
                    You can also create these tabs for existing companies using the green "+" button in the company list below.
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
                  {categoriesLoading ? (
                    <option value="" disabled>Loading categories...</option>
                  ) : categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </select>
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
            </div>

            {/* Logo Upload Section - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <LogoUpload
                currentLogo={formData.logo}
                onLogoUpload={(logoUrl, file) => setFormData(prev => ({ 
                  ...prev, 
                  logo: logoUrl,
                  logoFile: file 
                }))}
                onLogoDelete={() => setFormData(prev => ({ 
                  ...prev, 
                  logo: '/company-logos/Bank/placeholder.svg',
                  logoFile: null 
                }))}
                companySlug={isEditing ? formData.slug : null}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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

          {/* Tab Selection Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tab Selection</h3>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="h-4 w-4" />
                <span>
                  <strong>Note:</strong> All selected tabs will be created automatically when the company is saved. 
                  You can select which tabs to include below.
                </span>
              </div>
            </div>
            {/* Tab Selection - Using SimpleTabManager logic */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Select Tabs
                </label>
                <span className="text-xs text-gray-500">
                  {formData.selectedTabs.length} of 5 selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊', description: 'Company overview and general information' },
                  { id: 'numbers', label: 'Contact Numbers', icon: '📞', description: 'Customer service and contact information' },
                  { id: 'complaints', label: 'Complaints', icon: '⚠️', description: 'Complaint registration and resolution process' },
                  { id: 'quickhelp', label: 'Quick Help', icon: '❓', description: 'FAQs and quick solutions' },
                  { id: 'video', label: 'Video Guide', icon: '▶️', description: 'Video tutorials and guides' }
                ].map((tab) => {
                  const isSelected = formData.selectedTabs.includes(tab.id);
                  
                  return (
                    <div
                      key={tab.id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const newSelectedTabs = isSelected
                          ? formData.selectedTabs.filter(id => id !== tab.id)
                          : [...formData.selectedTabs, tab.id];
                        setFormData(prev => ({ ...prev, selectedTabs: newSelectedTabs }));
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{tab.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {tab.label}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {tab.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="text-blue-600">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-xs text-gray-500">
                <strong>Note:</strong> All selected tabs will be created automatically when the company is saved.
              </div>
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

      {/* Enhanced Companies List */}
      <EnhancedCompaniesList />

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

      {/* Category Arrangement Modal */}
      {showArrangementModal && selectedCategoryForArrangement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Arrange Company Order</h3>
                <p className="text-gray-600">Reorder subcategories within this category</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Category Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">{selectedCategoryForArrangement.name}</h4>
                    <p className="text-sm text-blue-700">
                      {selectedCategoryForArrangement.companies?.length || 0} companies to reorder
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCategoryForArrangement.companies?.length || 0}
                    </div>
                    <div className="text-xs text-blue-600">Total Companies</div>
                  </div>
                </div>
              </div>

              {/* Company Ordering */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drag and drop to reorder companies
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    The order you set here will be reflected on the frontend category grid
                  </p>
                </div>

                {/* Company List for Reordering */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Company Order</h5>
                  <div className="space-y-2">
                    {(() => {
                      // Initialize order if not set
                      if (selectedCategoryForArrangement.companies && !companyOrder[selectedCategoryForArrangement._id]) {
                        initializeCompanyOrder(selectedCategoryForArrangement._id, selectedCategoryForArrangement.companies);
                      }
                      
                      const orderedIds = companyOrder[selectedCategoryForArrangement._id] || [];
                      const companies = selectedCategoryForArrangement.companies || [];
                      
                      return orderedIds.map((companyId, index) => {
                        const company = companies.find(c => c._id === companyId);
                        if (!company) return null;
                        
                        return (
                          <div
                            key={company._id}
                            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-move hover:bg-gray-50 transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', company._id);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const draggedId = e.dataTransfer.getData('text/plain');
                              if (draggedId !== company._id) {
                                handleCompanyOrderChange(selectedCategoryForArrangement._id, draggedId, index);
                              }
                            }}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{company.name}</div>
                              <div className="text-sm text-gray-500">{company.phone}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const currentOrder = companyOrder[selectedCategoryForArrangement._id] || [];
                                  const currentIndex = currentOrder.indexOf(company._id);
                                  if (currentIndex > 0) {
                                    handleCompanyOrderChange(selectedCategoryForArrangement._id, company._id, currentIndex - 1);
                                  }
                                }}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const currentOrder = companyOrder[selectedCategoryForArrangement._id] || [];
                                  const currentIndex = currentOrder.indexOf(company._id);
                                  if (currentIndex < currentOrder.length - 1) {
                                    handleCompanyOrderChange(selectedCategoryForArrangement._id, company._id, currentIndex + 1);
                                  }
                                }}
                                disabled={index === (companyOrder[selectedCategoryForArrangement._id] || []).length - 1}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Frontend Preview</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(() => {
                      const orderedIds = companyOrder[selectedCategoryForArrangement._id] || [];
                      const companies = selectedCategoryForArrangement.companies || [];
                      
                      return orderedIds.slice(0, 8).map((companyId, index) => {
                        const company = companies.find(c => c._id === companyId);
                        if (!company) return null;
                        
                        return (
                          <div key={company._id} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {company.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Position {index + 1}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  {selectedCategoryForArrangement.companies?.length > 8 && (
                    <div className="text-center mt-3">
                      <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        +{selectedCategoryForArrangement.companies.length - 8} more companies
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Frontend Impact Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm font-bold">ℹ</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Frontend Impact</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• This order affects the <strong>CategoryGrid</strong> component on the frontend</li>
                      <li>• Companies will appear in the exact order you set here</li>
                      <li>• The order is saved to the database and persists across sessions</li>
                      <li>• Changes take effect immediately on the frontend</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowArrangementModal(false);
                  setSelectedCategoryForArrangement(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
                              <button
                  onClick={handleSaveCategoryArrangement}
                  disabled={arrangementLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {arrangementLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Order...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Company Order
                    </>
                  )}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {deleteCategoryConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Warning: This action will delete ALL companies in this category!</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the <strong>"{deleteCategoryConfirm.name}"</strong> category? 
              This will permanently remove <strong>{deleteCategoryConfirm.count} company{deleteCategoryConfirm.count !== 1 ? 'ies' : 'y'}</strong> and cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteCategoryConfirm.id, deleteCategoryConfirm.name)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All Companies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
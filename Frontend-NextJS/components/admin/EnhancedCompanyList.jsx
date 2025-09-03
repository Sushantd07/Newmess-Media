import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, Plus, Eye, EyeOff, Star, CheckCircle, X, Save, 
  Building2, Phone, Globe, Users, Copy, Heart, Clock, Check, 
  ArrowRight, AlertCircle, Search, Filter, Grid, List, ChevronDown, 
  ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal, Settings, 
  Download, Upload, ChevronRight as ChevronRightIcon
} from 'lucide-react';

const EnhancedCompanyList = ({ 
  companies, 
  categories, 
  onEdit, 
  onDelete, 
  onCreateDefaultTabs, 
  onDeleteCategory,
  loading = false 
}) => {
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
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

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
      return;
    }

    const selectedCompanyIds = Array.from(selectedCompanies);
    
    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedCompanyIds.map(id => 
            fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: true })
            })
          ));
          break;
          
        case 'deactivate':
          await Promise.all(selectedCompanyIds.map(id => 
            fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isActive: false })
            })
          ));
          break;
          
        case 'delete':
          await Promise.all(selectedCompanyIds.map(id => 
            fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/subcategories/${id}`, {
              method: 'DELETE'
            })
          ));
          break;
      }
      
      setSelectedCompanies(new Set());
      // Refresh the companies list
      window.location.reload();
    } catch (error) {
      console.error('Error performing bulk action:', error);
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
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
                              <ChevronRightIcon className="h-4 w-4 text-blue-600" />
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
                                      <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                                        <Star className="h-3 w-3" />
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onEdit(company)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit company"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onCreateDefaultTabs(company)}
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
                          onClick={() => onEdit(company)}
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
                onClick={() => {
                  onDelete(deleteConfirm._id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
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
                onClick={() => {
                  onDeleteCategory(deleteCategoryConfirm.id, deleteCategoryConfirm.name);
                  setDeleteCategoryConfirm(null);
                }}
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

export default EnhancedCompanyList;

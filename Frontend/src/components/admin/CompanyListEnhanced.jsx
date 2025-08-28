import React, { useState } from 'react';
import { 
  Edit, Trash2, Plus, EyeOff, Star, CheckCircle, 
  Building2, Phone, Globe, Check, 
  Search, Filter, Grid, List, ChevronDown, ChevronRight,
  AlertCircle
} from 'lucide-react';

const CompanyListEnhanced = ({ 
  companies, 
  categories, 
  onEdit, 
  onDelete, 
  onCreateDefaultTabs, 
  onDeleteCategory 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter companies based on search and filters
  const getFilteredCompanies = () => {
    let filtered = [...companies];

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.parentCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(company => 
        company.parentCategory?._id === categoryFilter || 
        company.parentCategory === categoryFilter
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(company => company.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(company => !company.isActive);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(company => company.verified);
      }
    }

    return filtered;
  };

  // Group companies by category
  const getGroupedCompanies = () => {
    const filtered = getFilteredCompanies();
    const grouped = {};
    
    filtered.forEach(company => {
      const categoryId = company.parentCategory?._id || company.parentCategory;
      const categoryName = company.parentCategory?.name || 'Uncategorized';
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = { name: categoryName, companies: [] };
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

  const filteredCompanies = getFilteredCompanies();
  const groupedCompanies = getGroupedCompanies();

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
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
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies by name, phone, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
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
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No companies found' : 'No companies yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? `No companies match your search "${searchTerm}"` : 'Create your first company to get started'}
            </p>
          </div>
        ) : (
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
                    <button
                      onClick={() => onDeleteCategory(categoryId, categoryData.name)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete All
                    </button>
                  </div>
                </div>
                
                {/* Companies List */}
                {expandedCategories.has(categoryId) && (
                  <div className="divide-y divide-gray-100">
                    {categoryData.companies.map((company) => (
                      <div key={company._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
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
                              title={company.tabs?.numbers && company.tabs?.overview ? 'Default tabs already exist' : 'Create default tabs'}
                              disabled={company.tabs?.numbers && company.tabs?.overview}
                            >
                              {company.tabs?.numbers && company.tabs?.overview ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => onDelete(company._id)}
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
      </div>
    </div>
  );
};

export default CompanyListEnhanced;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, LayoutGrid, List as ListIcon,
  CreditCard, Wallet, Smartphone, Phone, Package, ShoppingCart,
  Utensils, Car, Plane, Train, Bus, Building2, Tv, Tv2, Wifi,
  GraduationCap, FileText, Landmark, Calculator, Shield, TrendingUp,
  BarChart3, Banknote, Award, Stethoscope, TestTube, Briefcase,
  Home, Zap, Droplets, Gamepad2, Target, Gift, Users, Truck,
  Scale, Fuel, DollarSign, Globe, Navigation, Newspaper,
  Activity, Heart, Shirt
} from 'lucide-react';
import CategoryArrangementModal from '../components/admin/CategoryArrangementModal.jsx';
import { getApiBaseUrl } from '../utils/apiHelper.js';

const iconMap = {
  CreditCard, Wallet, Smartphone, Phone, Package, ShoppingCart,
  Utensils, Car, Plane, Train, Bus, Building2, Tv, Tv2, Wifi,
  GraduationCap, FileText, Landmark, Calculator, Shield, TrendingUp,
  BarChart3, Banknote, Award, Stethoscope, TestTube, Briefcase,
  Home, Zap, Droplets, Gamepad2, Target, Gift, Users, Truck,
  Scale, Fuel, DollarSign, Globe, Navigation, Newspaper,
  Activity, Heart, Shirt
};

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category arrangement modal state
  const [showArrangementModal, setShowArrangementModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use proper API base URL like other services
        const API_BASE_URL = getApiBaseUrl();
        
        console.log('[AllCategories] Using API_BASE_URL:', API_BASE_URL);
        
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
      
        if (data.success) {
          console.log('Categories from API:', data.data);
          console.log("Sample Category Object:", data.data[0]);
          setCategories(data.data);
        } else {
          console.error('Failed to fetch categories:', data.message);
          setError(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

const sortedCategories = [...filteredCategories].sort((a, b) => {
  switch (sortBy) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'count':
    case 'subcategories':
      return (b.subcategoryCount || 0) - (a.subcategoryCount || 0);
    default:
      return a.name.localeCompare(b.name);
  }
});


  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleOpenArrangementModal = () => {
    setShowArrangementModal(true);
  };

  const handleCategoriesChange = () => {
    // Refresh categories data
    const fetchCategories = async () => {
      try {
        // Use proper API base URL like other services
        const API_BASE_URL = getApiBaseUrl();
        
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        
        if (data.success) {
          console.log('Categories from API:', data.data);
          console.log("Sample Category Object:", data.data[0]);
          setCategories(data.data);
        } else {
          console.error('Failed to fetch categories:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              Business Categories
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Find <span className="text-orange-500">Verified Numbers</span> by Category
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Browse through our comprehensive directory of verified toll-free numbers organized by industry categories.
            </p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for categories, businesses, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-28 py-3 text-base sm:text-lg bg-white border-0 rounded-full focus:ring-4 focus:ring-orange-500/20 focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Browse removed as requested */}

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">All Business Categories</h2>
              <p className="text-gray-600 text-sm">
                {loading ? 'Loading categories...' : `Showing ${sortedCategories.length} of ${categories.length} categories`}
              </p>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm"
              title="Toggle view"
            >
              {viewMode === 'grid' ? <ListIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              <span>{viewMode === 'grid' ? 'List view' : 'Card view'}</span>
            </button>
          </div>
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
            </div>
          </form>
        </div>

                {/* Categories */}
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">Error Loading Categories</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : sortedCategories.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No Categories Found</div>
            <div className="text-gray-400">Try adjusting your search or check back later.</div>
          </div>
        ) : viewMode === 'grid' ? (
          // Categories grid
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedCategories.map((category) => {
              // Check if category has a custom SVG icon (more flexible detection)
              const hasCustomIcon = category.icon && (
                category.icon.startsWith('<svg') || 
                category.icon.includes('<svg') || 
                category.icon.includes('viewBox') ||
                category.icon.includes('xmlns=')
              );
              
              // Check if it's an image file (PNG, JPG, etc.) - either as path or data URL
              const isImageFile = category.icon && (
                (category.icon.startsWith('/') && 
                 !category.icon.includes('<svg') && 
                 ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(ext => category.icon.toLowerCase().endsWith(ext))) ||
                (category.icon.startsWith('data:image/')) ||
                (category.iconType === 'image') ||
                (category.icon && category.icon.includes('.png')) ||
                (category.icon && category.icon.includes('.jpg')) ||
                (category.icon && category.icon.includes('.jpeg'))
              );
              
              const Icon = hasCustomIcon ? null : (iconMap[category.iconName] || CreditCard);
              


              return (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-orange-50 hover:border-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-gray-200 shadow-md ring-1 ring-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition`}
                        >
                          {hasCustomIcon ? (
                            <div 
                              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-gray-700 custom-svg-icon"
                              dangerouslySetInnerHTML={{ __html: category.icon }}
                            />
                          ) : isImageFile ? (
                            <img 
                              src={category.icon} 
                              alt={`${category.name} icon`} 
                              className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain bg-transparent rounded drop-shadow-sm"
                              onError={(e) => {
                                console.error(`❌ AllCategories - Image failed to load for ${category.name}:`, category.icon);
                                e.target.style.display = 'none';
                                // Show fallback icon
                                const fallbackIcon = document.createElement('div');
                                fallbackIcon.className = 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-gray-700';
                                fallbackIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                                e.target.parentNode.appendChild(fallbackIcon);
                              }}
                            />
                          ) : (
                            <Icon className="h-10 w-10 md:h-10 md:w-10 text-gray-700" />
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.subcategoryCount || 0}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 text-xs sm:text-sm font-medium group-hover:underline">
                        View All →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {sortedCategories.map((category) => {
            const hasCustomIcon = category.icon && (
              category.icon.startsWith('<svg') ||
              category.icon.includes('<svg') ||
              category.icon.includes('viewBox') ||
              category.icon.includes('xmlns=')
            );
            const isImageFile = category.icon && (
              (category.icon.startsWith('/') &&
               !category.icon.includes('<svg') &&
               ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(ext => category.icon.toLowerCase().endsWith(ext))) ||
              (category.icon.startsWith('data:image/')) ||
              (category.iconType === 'image') ||
              (category.icon && category.icon.includes('.png')) ||
              (category.icon && category.icon.includes('.jpg')) ||
              (category.icon && category.icon.includes('.jpeg'))
            );
            const Icon = hasCustomIcon ? null : (iconMap[category.iconName] || CreditCard);
            return (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-orange-50 transition text-left"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  {hasCustomIcon ? (
                    <div className="h-6 w-6 text-gray-700 custom-svg-icon" dangerouslySetInnerHTML={{ __html: category.icon }} />
                  ) : isImageFile ? (
                    <img src={category.icon} alt={`${category.name} icon`} className="h-7 w-7 object-contain" />
                  ) : (
                    <Icon className="h-6 w-6 text-gray-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{category.subcategoryCount || 0}</span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">{category.description}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            );
          })}
        </div>
        )}
      </div>

      {/* Category Arrangement Modal */}
      <CategoryArrangementModal
        isOpen={showArrangementModal}
        onClose={() => setShowArrangementModal(false)}
        categories={categories}
        onCategoriesChange={handleCategoriesChange}
      />
    </div>
  );
};

export default AllCategories;

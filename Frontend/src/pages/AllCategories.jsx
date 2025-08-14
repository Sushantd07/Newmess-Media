import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, ChevronRight, Settings,
  CreditCard, Wallet, Smartphone, Phone, Package, ShoppingCart,
  Utensils, Car, Plane, Train, Bus, Building2, Tv, Tv2, Wifi,
  GraduationCap, FileText, Landmark, Calculator, Shield, TrendingUp,
  BarChart3, Banknote, Award, Stethoscope, TestTube, Briefcase,
  Home, Zap, Droplets, Gamepad2, Target, Gift, Users, Truck,
  Scale, Fuel, DollarSign, Globe, Navigation, Newspaper,
  Activity, Heart, Shirt
} from 'lucide-react';
import CategoryArrangementModal from '../components/admin/CategoryArrangementModal.jsx';

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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  
  // Category arrangement modal state
  const [showArrangementModal, setShowArrangementModal] = useState(false);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories');
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
}, []);


  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'trending' && category.trending) ||
      (selectedFilter === 'popular' && category.subcategoryCount > 10);

    return matchesSearch && matchesFilter;
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
        const response = await fetch('http://localhost:3000/api/categories');
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find <span className="text-orange-500">Verified Numbers</span> by Category
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
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
                  className="w-full pl-14 pr-32 py-4 text-lg bg-white border-0 rounded-full focus:ring-4 focus:ring-orange-500/20 focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Business Categories</h2>
            <p className="text-gray-600">
              Showing {sortedCategories.length} of {categories.length} categories
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleOpenArrangementModal}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
              title="Arrange Category Order"
            >
              <Settings className="h-4 w-4" />
              <span>Arrange</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="name">Sort by Name</option>
              <option value="count">Sort by Count</option>
              <option value="subcategories">Sort by Subcategories</option>
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedCategories.map((category) => {
            const Icon = iconMap[category.iconName] || CreditCard;

            return (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-orange-50 hover:border-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.subcategoryCount || 0}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 text-sm font-medium group-hover:underline">
                      View All →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

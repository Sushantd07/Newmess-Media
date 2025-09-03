import React, { useState, useRef, useEffect, useMemo, useCallback, memo, useDeferredValue } from "react";
import {
  Phone,
  Globe,
  Copy,
  Check,
  Star,
  Heart,
  HeartOff,
  Clock,
  ArrowRight,
  Banknote,
  Smartphone,
  Package,
  Tv,
  BookOpen,
  Map,
  Landmark,
  HeartPulse,
  Utensils,
  Gamepad2,
  MonitorSmartphone,
  Wifi,
  Briefcase,
  Bus,
  ShoppingBag,
  Hospital,
  GraduationCap,
  Newspaper,
  Shirt,
  Zap,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Mic,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import CategoryService from '../services/categoryService.js';
import CategoryArrangementModal from './admin/CategoryArrangementModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

// Mobile-specific CSS styles for enhanced mobile experience
const mobileStyles = `
  @media (max-width: 768px) {
    .mobile-scroll-container {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .mobile-scroll-container::-webkit-scrollbar {
      display: none;
    }
    .mobile-category-card {
      min-width: 80px;
      flex-shrink: 0;
    }
    .mobile-focus:focus {
      outline: 2px solid #f97316;
      outline-offset: 2px;
    }
    .mobile-image {
      max-width: 100%;
      height: auto;
    }
    .mobile-text {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`;

// Icon mapping for dynamic icon rendering
const ICON_MAP = {
  Banknote,
  Smartphone,
  ShoppingBag,
  HeartPulse,
  Wallet,
  Landmark,
  MonitorSmartphone,
  Briefcase,
  Gamepad2,
  Package,
  Tv,
  BookOpen,
  Map,
  Utensils,
  Wifi,
  Bus,
  Hospital,
  GraduationCap,
  Newspaper,
  Shirt,
  Zap,
};

// Memoized Category Card Component for better performance
const CategoryCard = memo(({ category, isSelected, onClick, index }) => {
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
  
  const IconComponent = hasCustomIcon ? null : (ICON_MAP[category.icon] || Smartphone);
  
  return (
    <button
      key={category._id}
      onClick={() => onClick(index)}
      className={`flex flex-col items-center rounded-lg p-3 shadow-sm border transition-all duration-200 group 
        ${isSelected ? 'border-orange-500 bg-orange-50 scale-105 shadow-md' : 'border-gray-100 bg-white'}
        hover:bg-orange-100 hover:shadow-lg hover:scale-105`}
      style={{ outline: 'none' }}
    >
      <div className="w-8 h-8 flex items-center justify-center mb-1 text-xl">
        {hasCustomIcon ? (
          <div
            className="h-7 w-7 text-orange-600 custom-svg-icon"
            dangerouslySetInnerHTML={{ __html: category.icon }}
          />
        ) : isImageFile ? (
          <img 
            src={category.icon} 
            alt={`${category.name} icon`} 
            className="h-7 w-7 object-contain"
            loading="lazy"
            onError={(e) => {
              console.error(`❌ Image failed to load for ${category.name}:`, category.icon);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <IconComponent className="h-7 w-7 text-orange-600" />
        )}
      </div>
      <span className="text-xs text-gray-700 font-semibold text-center">
        {category.name}
      </span>
    </button>
  );
});

// Memoized Company Card Component for better performance
const CompanyCard = memo(({ company, onCopy, onFavorite, isFavorite, onNavigate }) => {
  const handleCopy = useCallback(() => {
    onCopy(company.phone || company.mainPhone, company._id || company.id);
  }, [company, onCopy]);

  const handleFavorite = useCallback(() => {
    onFavorite(company._id || company.id);
  }, [company, onFavorite]);

  const handleNavigate = useCallback(() => {
    onNavigate(company);
  }, [company, onNavigate]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-200 p-6 flex flex-col" style={{ WebkitTapHighlightColor: 'transparent', backgroundColor: '#ffffff' }}>
      {/* Top: Logo, Name, Verified, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-12 h-12 flex items-center justify-center overflow-hidden`}>
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain bg-transparent" style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} loading="lazy" decoding="async" />
          ) : (
            <span className="text-gray-300 text-xl font-bold">{company.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span
              className="font-semibold text-gray-900 text-lg truncate cursor-pointer transition-colors duration-200 hover:text-orange-600 hover:underline"
              onClick={handleNavigate}
            >
              {company.name}
            </span>
            {company.verified && <Check className="h-4 w-4 text-green-500" title="Verified" />}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {company.tags && company.tags.length > 0
              ? company.tags.join(' · ')
              : (company.role || 'Support')}
          </div>
        </div>
      </div>
      {/* Info Row (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Globe className="h-4 w-4 text-gray-400" />
          {company.address || 'All India'}
        </span>
        <span className="mx-1 text-gray-300">|</span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          {company.timing || 'Mon - Sat, 9 AM - 5 PM'}
        </span>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-100 my-1" />
      {/* Contact Row */}
      <div className="flex items-center gap-2 mb-4">
        <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
        <span className="font-bold text-gray-900 text-[15px] md:text-[16px] whitespace-nowrap">{company.phone || company.mainPhone}</span>
        <button onClick={handleCopy} className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Copy">
          <Copy className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />
        </button>
        <button onClick={handleFavorite} className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Favorite">
          {isFavorite ? <Heart className="h-4 w-4 text-orange-500 fill-orange-100" /> : <Heart className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />}
        </button>
      </div>
      {/* Action Row: Call Now and View More buttons side by side */}
      <div className="flex flex-nowrap gap-2 mt-1">
        <button
          onClick={() => window.open(`tel:${company.phone || company.mainPhone}`)}
          className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-300"
          style={{ minWidth: 0 }}
        >
          <Phone className="h-5 w-5 text-white" /> Call Now
        </button>
        <button
          onClick={handleNavigate}
          className="w-1/2 bg-orange-50 border border-orange-200 text-orange-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-200"
          style={{ minWidth: 0 }}
        >
          View More <ArrowRight className="h-5 w-5 text-orange-600" />
        </button>
      </div>
    </div>
  );
});

const CategoryGridCompanyList = () => {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [copied, setCopied] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [isRefetching, setIsRefetching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);
  const contactsScrollRef = useRef(null);

  // Inject mobile styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mobileStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Fetch data from backend with error handling and retry logic
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CategoryService.getCategoryGridData();
      setCategoryData(data);
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = useCallback(async () => {
    setIsRefetching(true);
    try {
      await fetchData();
    } finally {
      setIsRefetching(false);
    }
  }, [fetchData]);

  // Memoized handlers for better performance
  const handleCopy = useCallback((number, id) => {
    navigator.clipboard.writeText(number);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const handleFavorite = useCallback((id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleOpenArrangementModal = useCallback(() => {
    setShowArrangementModal(true);
  }, []);

  const handleCategoriesChange = useCallback(() => {
    // Refresh categories data
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CategoryService.getCategoryGridData();
        setCategoryData(data);
      } catch (err) {
        // swallow error for UI; error state already managed on first load
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized navigation handler
  const handleNavigate = useCallback((company) => {
    if (company.slug) {
      const route = `/category/banking-services/${company.slug}/contactnumber`;
      navigate(route);
    } else if (company._id) {
      const route = `/company/${company._id}/contactnumber`;
      navigate(route);
    } else {
      const route = `/company/${company.id}/contactnumber`;
      navigate(route);
    }
  }, [navigate]);

  // Voice search logic for right container
  const handleMicClick = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setListening(false);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  }, [listening]);

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  
  // Apply front page category limit and ordering (stored by admin arrangement)
  const frontPageLimit = useMemo(() => {
    const stored = Number(localStorage.getItem('frontPageCategoryLimit'));
    return Number.isFinite(stored) && stored > 0 ? stored : 8;
  }, []);

  // Memoized category data processing for better performance
  const categoriesForLeftPanel = useMemo(() => {
    return (categoryData || [])
    .slice() // copy
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, frontPageLimit);
  }, [categoryData, frontPageLimit]);

  const selectedCategory = categoriesForLeftPanel[selectedCategoryIdx] || categoriesForLeftPanel[0];
  const subcategoryContacts = selectedCategory?.subcategories || [];
  
  // Category arrangement modal state
  const [showArrangementModal, setShowArrangementModal] = useState(false);

  // Horizontal scroll functions for categories
  const scrollCategories = useCallback((direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200; // Adjust based on your needs
      const newScrollLeft = categoryScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  // Memoized filtered contacts for better performance
  const deferredSearch = useDeferredValue(search);
  const filteredContacts = useMemo(() => {
    if (!deferredSearch.trim()) return subcategoryContacts;
    const searchLower = deferredSearch.toLowerCase();
    return subcategoryContacts.filter(co =>
      co.name.toLowerCase().includes(searchLower) ||
      (co.tags && co.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (co.phone && co.phone.includes(deferredSearch))
  );
  }, [subcategoryContacts, deferredSearch]);

  // Reset and progressively increase visible items when category or search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategoryIdx, deferredSearch]);

  // Incrementally reveal more on scroll near bottom
  const handleContactsScroll = useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      setVisibleCount((prev) => {
        if (prev >= filteredContacts.length) return prev;
        return Math.min(prev + 12, filteredContacts.length);
      });
    }
  }, [filteredContacts.length]);

  const visibleContacts = useMemo(() => filteredContacts.slice(0, visibleCount), [filteredContacts, visibleCount]);

  // Loading state with skeleton loading
  if (loading) {
    return (
      <section className="relative py-6 sm:py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
          
          {/* Skeleton loading for better UX */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative py-6 sm:py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              disabled={isRefetching}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${isRefetching ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              {isRefetching ? 'Retrying…' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!categoryData.length) {
    return (
      <section className="relative py-6 sm:py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gray-600">No categories available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">

        {/* Hero heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Discover <span className="text-orange-600">Top Categories</span> & Trusted Contacts
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-3xl mx-auto px-2">
            Instantly access verified support and essential services for banking, telecom, shopping, healthcare, and more—all in one place.
          </p>
        </div>

        {/* Two Rows of Categories - Mobile Only */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-5 bg-orange-400 rounded" />
            <h3 className="text-base font-semibold text-gray-900">Categories</h3>
          </div>
          
          {/* First Row */}
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide mb-3">
            <div className="flex gap-3 px-1 min-w-max">
              {categoriesForLeftPanel.slice(0, 5).map((cat, idx) => (
                <div key={cat._id} className="min-w-[80px] max-w-[80px] flex-shrink-0">
                  <CategoryCard
                    category={cat}
                    isSelected={false}
                    onClick={() => setSelectedCategoryIdx(idx)}
                    index={idx}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Second Row */}
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex gap-3 px-1 min-w-max">
              {categoriesForLeftPanel.slice(5, 10).map((cat, idx) => (
                <div key={cat._id} className="min-w-[80px] max-w-[80px] flex-shrink-0">
                  <CategoryCard
                    category={cat}
                    isSelected={false}
                    onClick={() => setSelectedCategoryIdx(idx + 5)}
                    index={idx + 5}
                  />
                </div>
              ))}
              {/* View all button */}
              <div className="min-w-[80px] max-w-[80px] flex-shrink-0 flex flex-col items-center justify-center">
                <button
                  onClick={() => navigate('/category')}
                  className="h-16 w-16 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  title="View all categories"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="mt-2 text-[10px] text-gray-600 text-center px-1">View All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block">
          <div className="bg-white rounded-3xl shadow-none ring-1 ring-gray-100 flex flex-col md:flex-row items-start gap-0 overflow-hidden">
            {/* Left: Top Categories */}
            <div className="w-full md:w-[32%] flex flex-col p-6 pt-8 md:pt-8 md:border-r border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-2 mt-0">
                  <h2 className="text-xl font-bold text-gray-800">Top Categories</h2>
                  {isAdmin && (
                    <button
                      onClick={handleOpenArrangementModal}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Arrange Category Order"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 gap-4 mb-0 mt-6">
                  {categoriesForLeftPanel.map((cat, idx) => (
                    <CategoryCard
                        key={cat._id}
                      category={cat}
                      isSelected={selectedCategoryIdx === idx}
                      onClick={setSelectedCategoryIdx}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-centre mt-6">
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-base"
                  onClick={() => navigate('/category')}
                >
                  <Newspaper className="h-5 w-5 text-white" />
                  Explore All Categories
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            {/* Right: Company Cards */}
            <div className="w-full md:w-[68%] flex flex-col justify-between p-6 pt-8 md:pt-8">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 mt-0">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 mt-0">Top Contacts</h2>
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <svg className="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search contacts..."
                      className="w-full pl-12 pr-12 py-2.5 rounded-full bg-gray-50 border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium transition placeholder:text-orange-300 text-orange-700"
                    />
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full transition-colors ${listening ? 'bg-orange-100 text-orange-600 animate-pulse' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <svg className="lucide lucide-mic h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /><line x1="8" x2="16" y1="22" y2="22" /></svg>
                    </button>
                  </div>
                </div>
                {/* Quick Filters removed - restoring original mobile design */}
                <div ref={contactsScrollRef} onScroll={handleContactsScroll} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-0 mt-0 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                  {visibleContacts.map((co, idx) => (
                    <CompanyCard
                      key={co._id || co.id}
                      company={co}
                      onCopy={handleCopy}
                      onFavorite={handleFavorite}
                      isFavorite={favoriteIds.includes(co._id || co.id)}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
              <button className="mt-6  w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
                onClick={() => navigate('/category')}
              >
                View All Categories
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Mobile Layout - wireframe style */}
        <div className="md:hidden">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-2">
            {categoriesForLeftPanel.slice(0, 3).map((cat, idx) => {
              const subs = Array.isArray(cat?.subcategories) ? cat.subcategories : [];
              return (
                <div key={cat._id} className={`${idx > 0 ? 'pt-4 mt-2 border-t border-orange-100' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-5 bg-orange-400 rounded" />
                    <h3 className="text-base font-semibold text-gray-900">{cat.name}</h3>
                  </div>
                  <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-1 py-0">
                    <div className="flex gap-2 px-2 min-w-max snap-x snap-mandatory items-stretch">
                      {subs.map((co) => (
                        <div key={co._id || co.id} className="min-w-[300px] max-w-[300px] h-[212px] snap-start">
                          <div className="h-full overflow-hidden">
                <CompanyCard
                  company={co}
                  onCopy={handleCopy}
                  onFavorite={handleFavorite}
                  isFavorite={favoriteIds.includes(co._id || co.id)}
                  onNavigate={handleNavigate}
                />
                          </div>
                        </div>
              ))}
                      {/* View all circle button at end */}
                      <div key={`viewall-${cat._id}`} className="min-w-[120px] max-w-[120px] h-[212px] snap-start flex flex-col items-center justify-center">
                        <button
                          onClick={() => navigate(`/category?cat=${encodeURIComponent(cat.name)}`)}
                          className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                          title={`View all ${cat.name}`}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                        <span className="mt-2 text-[11px] text-gray-600 text-center px-2 whitespace-nowrap">View all {cat.name}</span>
                      </div>
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
        categories={categoryData}
        onCategoriesChange={handleCategoriesChange}
      />
    </section>
  );
};

export default CategoryGridCompanyList;

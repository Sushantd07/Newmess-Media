import React, { useState, useRef, useEffect, useMemo } from "react";
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

const CategoryGridCompanyList = () => {
  const [copied, setCopied] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Force refresh cache to get latest data
        CategoryService.clearCacheKey('categoryGridData');
        const data = await CategoryService.getCategoryGridData();

        setCategoryData(data);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = (number, id) => {
    navigator.clipboard.writeText(number);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenArrangementModal = () => {
    setShowArrangementModal(true);
  };

  const handleCategoriesChange = () => {
    // Refresh categories data
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        CategoryService.clearCacheKey('categoryGridData');
        const data = await CategoryService.getCategoryGridData();
        setCategoryData(data);
      } catch (err) {
        console.error('Error refreshing category data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  // Voice search logic for right container
  const handleMicClick = () => {
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
  };

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  // Apply front page category limit and ordering (stored by admin arrangement)
  const frontPageLimit = (() => {
    const stored = Number(localStorage.getItem('frontPageCategoryLimit'));
    return Number.isFinite(stored) && stored > 0 ? stored : 8;
  })();
  const categoriesForLeftPanel = (categoryData || [])
    .slice() // copy
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, frontPageLimit);

  const selectedCategory = categoriesForLeftPanel[selectedCategoryIdx] || categoriesForLeftPanel[0];
  const subcategoryContacts = selectedCategory?.subcategories || [];
  
  // Category arrangement modal state
  const [showArrangementModal, setShowArrangementModal] = useState(false);

  // Horizontal scroll functions for categories
  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200; // Adjust based on your needs
      const newScrollLeft = categoryScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Mobile: prepare 5 category containers and auto-scroll their subcategory rows
  const topFiveMobileCategories = useMemo(() => (categoriesForLeftPanel || []).slice(0, 5), [categoriesForLeftPanel]);
  const mobileRowRefs = useRef([]);
  const mobileIntervalsRef = useRef([]);

  const stopAutoForIndex = (index) => {
    const existing = mobileIntervalsRef.current[index];
    if (existing) {
      clearInterval(existing);
      mobileIntervalsRef.current[index] = null;
    }
  };

  const startAutoForIndex = (index) => {
    const el = mobileRowRefs.current[index];
    if (!el) return;
    stopAutoForIndex(index);
    const id = setInterval(() => {
      const firstCard = el.querySelector('.mobile-card');
      const gap = 16; // px
      const step = firstCard ? firstCard.clientWidth + gap : el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + step;
      el.scrollTo({ left: nextLeft >= maxScroll ? 0 : nextLeft, behavior: 'smooth' });
    }, 2200);
    mobileIntervalsRef.current[index] = id;
  };

  useEffect(() => {
    // initialize auto-scroll for visible rows
    mobileIntervalsRef.current.forEach((id) => id && clearInterval(id));
    mobileIntervalsRef.current = [];
    topFiveMobileCategories.forEach((_, index) => {
      const el = mobileRowRefs.current[index];
      if (el) {
        el.scrollLeft = 0;
        startAutoForIndex(index);
      }
    });
    return () => {
      mobileIntervalsRef.current.forEach((id) => id && clearInterval(id));
      mobileIntervalsRef.current = [];
    };
  }, [topFiveMobileCategories]);

  // Filtered contacts for right container
  const filteredContacts = subcategoryContacts.filter(co =>
    co.name.toLowerCase().includes(search.toLowerCase()) ||
    (co.tags && co.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) ||
    (co.phone && co.phone.includes(search))
  );

  // Loading state
  if (loading) {
    return (
      <section className="relative py-6 sm:py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
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
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Try Again
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
      {/* Decorative abstract background shape */}
      <div className="absolute -top-24 -left-32 w-[480px] h-[480px] bg-gradient-to-tr from-orange-200 via-orange-100 to-white rounded-full blur-3xl opacity-60 z-0"></div>
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">

        {/* Hero heading */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Discover <span className="text-orange-600">Top Categories</span> & Trusted Contacts
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-3xl mx-auto px-2">
            Instantly access verified support and essential services for banking, telecom, shopping, healthcare, and more—all in one place.
          </p>
          <div className="mt-4">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-base"
              onClick={() => navigate('/category')}
            >
              <Newspaper className="h-5 w-5 text-white" />
              Explore All Categories
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row items-start gap-0 overflow-hidden">
            {/* Left: Top Categories */}
            <div className="w-full md:w-[32%] flex flex-col p-6 pt-8 md:pt-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-2 mt-0">
                  <h2 className="text-xl font-bold text-gray-800">Top Categories</h2>
                  <button
                    onClick={handleOpenArrangementModal}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Arrange Category Order"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 gap-4 mb-0 mt-10">
                  {categoriesForLeftPanel.map((cat, idx) => {
                    // Check if category has a custom SVG icon or image file
                    const hasCustomIcon = cat.icon && (
                      cat.icon.startsWith('<svg') ||
                      cat.icon.includes('<svg') ||
                      cat.icon.includes('viewBox') ||
                      cat.icon.includes('xmlns=')
                    );
                    
                    // Check if it's an image file (PNG, JPG, etc.) - either as path or data URL
                    const isImageFile = cat.icon && (
                      (cat.icon.startsWith('/') && 
                       !cat.icon.includes('<svg') && 
                       ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some(ext => cat.icon.toLowerCase().endsWith(ext))) ||
                      (cat.icon.startsWith('data:image/')) ||
                      (cat.iconType === 'image') ||
                      (cat.icon && cat.icon.includes('.png')) ||
                      (cat.icon && cat.icon.includes('.jpg')) ||
                      (cat.icon && cat.icon.includes('.jpeg'))
                    );
                    
                    const IconComponent = hasCustomIcon ? null : (ICON_MAP[cat.icon] || Smartphone);
                    
                    return (
                      <button
                        key={cat._id}
                        onClick={() => setSelectedCategoryIdx(idx)}
                        className={`flex flex-col items-center rounded-lg p-3 shadow-sm border transition-all duration-200 group 
                          ${selectedCategoryIdx === idx ? 'border-orange-500 bg-orange-50 scale-105 shadow-md' : 'border-gray-100 bg-white'}
                          hover:bg-orange-100 hover:shadow-lg hover:scale-105`}
                        style={{ outline: 'none' }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center mb-1 text-xl">
                          {hasCustomIcon ? (
                            <div
                              className="h-7 w-7 text-orange-600 custom-svg-icon"
                              dangerouslySetInnerHTML={{ __html: cat.icon }}
                            />
                          ) : isImageFile ? (
                            <img 
                              src={cat.icon} 
                              alt={`${cat.name} icon`} 
                              className="h-7 w-7 object-contain"
                              loading="lazy"
                              onError={(e) => {
                                console.error(`❌ Image failed to load for ${cat.name}:`, cat.icon);
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                // Performance warning for large images
                                if (e.target.naturalWidth > 100 || e.target.naturalHeight > 100) {
                                  console.warn(`⚠️ Large image detected for ${cat.name}. Consider using SVG for better performance.`);
                                }
                              }}
                            />
                          ) : (
                            <IconComponent className="h-7 w-7 text-orange-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 font-semibold text-center">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
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
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-0">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-0 mt-0 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                  {filteredContacts.map((co, idx) => (
                    <div
                      key={co._id || co.id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      {/* Top: Logo, Name, Verified, Tag */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 flex items-center justify-center overflow-hidden`}>
                          {co.logo ? (
                            <img src={co.logo} alt={co.name} className="w-10 h-10 object-contain bg-transparent" style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} />
                          ) : (
                            <span className="text-gray-300 text-xl font-bold">{co.name[0]}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span
                              className="font-semibold text-gray-900 text-lg truncate cursor-pointer transition-colors duration-200 hover:text-orange-600 hover:underline"
                              onClick={() => {
                                console.log('Company clicked:', co.id, co.name, co.slug, selectedCategory?.slug);
                                // Use SEO-friendly slug route structure for all companies
                                if (co.slug) {
                                  // Use the SEO-friendly category route structure
                                  const route = `/category/banking-services/${co.slug}/contactnumber`;
                                  console.log('Navigating to SEO-friendly route:', route);
                                  navigate(route);
                                } else if (co._id) {
                                  // Fallback to ObjectId route structure
                                  const route = `/company/${co._id}/contactnumber`;
                                  console.log('Navigating to ObjectId route:', route);
                                  navigate(route);
                                } else {
                                  // Final fallback to company ID route
                                  const route = `/company/${co.id}/contactnumber`;
                                  console.log('Navigating to fallback route:', route);
                                  navigate(route);
                                }
                              }}
                            >
                              {co.name}
                            </span>
                            {co.verified && <Check className="h-4 w-4 text-green-500" title="Verified" />}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {co.tags && co.tags.length > 0 ? co.tags.join(' · ') : (co.role || 'Support')}
                          </div>
                        </div>
                      </div>
                      {/* Info Row */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-gray-400" />
                          {co.address || 'All India'}
                        </span>
                        <span className="mx-1 text-gray-300">|</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {co.timing || 'Mon - Sat, 9 AM - 5 PM'}
                        </span>
                      </div>
                      {/* Divider */}
                      <div className="border-t border-gray-100 my-3" />
                      {/* Contact Row */}
                      <div className="flex items-center gap-2 mb-4">
                        <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="font-bold text-gray-900 text-[15px] md:text-[16px] whitespace-nowrap">{co.phone}</span>
                        <button onClick={() => handleCopy(co.phone, co._id || co.id)} className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Copy">
                          {copied === (co._id || co.id) ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />}
                        </button>
                        <button onClick={() => handleFavorite(co._id || co.id)} className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" title="Favorite">
                          {favoriteIds.includes(co._id || co.id) ? <Heart className="h-4 w-4 text-orange-500 fill-orange-100" /> : <Heart className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />}
                        </button>
                      </div>
                      {/* Action Row: Call Now and View More buttons side by side */}
                      <div className="flex flex-nowrap gap-2 mt-1">
                        <button
                          onClick={() => window.open(`tel:${co.phone}`)}
                          className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-300"
                          style={{ minWidth: 0 }}
                        >
                          <Phone className="h-5 w-5 text-white" /> Call Now
                        </button>
                        <button
                          onClick={() => {
                            console.log('View More clicked:', {
                              id: co.id,
                              name: co.name,
                              slug: co.slug,
                              _id: co._id,
                              selectedCategory: selectedCategory?.slug
                            });
                            // Use SEO-friendly slug route structure for all companies
                            if (co.slug) {
                              // Use the SEO-friendly category route structure
                              const route = `/category/banking-services/${co.slug}/contactnumber`;
                              console.log('Navigating to SEO-friendly route:', route);
                              navigate(route);
                            } else if (co._id) {
                              // Fallback to ObjectId route structure
                              const route = `/company/${co._id}/contactnumber`;
                              console.log('Navigating to ObjectId route:', route);
                              navigate(route);
                            } else {
                              // Final fallback to company ID route
                              const route = `/company/${co.id}/contactnumber`;
                              console.log('Navigating to fallback route:', route);
                              navigate(route);
                            }
                          }}
                          className="w-1/2 bg-orange-50 border border-orange-200 text-orange-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-orange-100 transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-200"
                          style={{ minWidth: 0 }}
                        >
                          View More <ArrowRight className="h-5 w-5 text-orange-600" />
                        </button>
                      </div>
                    </div>
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

        {/* Mobile Layout (below md) */}
        <div className="md:hidden">
          <div className="space-y-4">
            {topFiveMobileCategories.map((cat, idx) => (
              <div key={cat._id || cat.id || cat.slug || idx} className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-gray-900">{cat.name}</h3>
                  <button
                    onClick={() => navigate(`/category/${cat.slug || cat._id || cat.id}`)}
                    className="text-sm font-semibold text-orange-600"
                  >
                    View all
                  </button>
                </div>
                <div
                  ref={(el) => (mobileRowRefs.current[idx] = el)}
                  className="overflow-hidden snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none' }}
                  onMouseEnter={() => stopAutoForIndex(idx)}
                  onMouseLeave={() => startAutoForIndex(idx)}
                  onTouchStart={() => stopAutoForIndex(idx)}
                  onTouchEnd={() => startAutoForIndex(idx)}
                >
                  <div className="flex gap-4 pb-1">
                    {(cat.subcategories || []).map((co) => (
                      <div key={co._id || co.id || co.slug} className="mobile-card min-w-[88%] max-w-[88%] snap-start">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md border border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                                {co.logo ? (
                                  <img src={co.logo} alt={co.name} className="w-10 h-10 object-contain bg-transparent" loading="lazy" decoding="async" style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} />
                                ) : (
                                  <span className="text-gray-300 text-xl font-bold">{co.name?.[0]}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    className="font-bold text-gray-900 text-base truncate cursor-pointer transition-colors duration-200 hover:text-orange-600"
                                    onClick={() => {
                                      if (co.slug) {
                                        navigate(`/category/banking-services/${co.slug}/contactnumber`);
                                      } else if (co._id) {
                                        navigate(`/company/${co._id}/contactnumber`);
                                      } else {
                                        navigate(`/company/${co.id}/contactnumber`);
                                      }
                                    }}
                                  >
                                    {co.name}
                                  </span>
                                  <span className="ml-auto inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                                    <svg className="h-3 w-3 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    4.2
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-wrap mt-1">
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">{(selectedCategory && selectedCategory.badges && selectedCategory.badges[0]) || cat.name}</span>
                                  {co.tags && co.tags.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">{co.tags[0]}</span>
                                  )}
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">Support</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl p-3 mb-3 border border-orange-200/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md">
                                    <Phone className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-[11px] text-orange-600 font-semibold mb-0.5">Toll-Free Number</div>
                                    <div className="font-bold text-gray-900 text-base">{co.phone}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => window.open(`tel:${co.phone}`)}
                                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                aria-label="Call Now"
                              >
                                <Phone className="h-4 w-4 text-white" />
                                <span>Call Now</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (co.slug) {
                                    navigate(`/category/banking-services/${co.slug}/contactnumber`);
                                  } else if (co._id) {
                                    navigate(`/company/${co._id}/contactnumber`);
                                  } else {
                                    navigate(`/company/${co.id}/contactnumber`);
                                  }
                                }}
                                className="w-full h-11 bg-white border border-orange-200 text-orange-600 font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:bg-orange-50 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                aria-label="View Details"
                              >
                                <span>View Details</span>
                                <ArrowRight className="h-4 w-4 text-orange-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(cat.subcategories || []).length === 0 && (
                      <div className="text-gray-500 text-sm">No subcategories</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

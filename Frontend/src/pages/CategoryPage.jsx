import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Grid3x3, List, ChevronDown, ChevronRight, Phone, Star, 
  TrendingUp, Building2, Shield, Clock, Users, ArrowRight, ArrowLeft, 
  MapPin, Globe, Award, Target, Zap, Eye, CheckCircle, ExternalLink,
  Heart, Share2, Bookmark, PhoneCall, Mail, MessageCircle, ThumbsUp,
  Calendar, Clock as ClockIcon, UserCheck, Verified, Sparkles, Copy, PlayCircle
} from 'lucide-react';
import CategoryService from '../services/categoryService';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Multiple YouTube videos for slider
  const videos = [
    {
      id: 'ma2LE8f0SIw',
      title: 'How to Complain of Banking Services',
      description: 'Learn how to file complaints effectively with banking services'
    },
    {
      id: 'QV5qLftOacs',
      title: 'Banking Services Guide',
      description: 'Complete guide to banking services and support'
    }
  ];

  // Preload video information for all videos
  const [allVideoInfo, setAllVideoInfo] = useState({});

  const currentVideo = videos[currentVideoIndex];

  // Preload all video information on component mount with caching
  useEffect(() => {
    const preloadAllVideos = async () => {
      const videoData = {};
      const cacheKey = 'youtube-video-cache';
      
      // Try to get cached data first
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const cacheTime = parsed.timestamp;
          const now = Date.now();
          
          // Cache is valid for 1 hour
          if (now - cacheTime < 3600000) {
            console.log('Using cached video data');
            setAllVideoInfo(parsed.data);
            setVideoInfo(parsed.data[videos[0].id]);
            return;
          }
        } catch (error) {
          console.log('Cache corrupted, fetching fresh data');
        }
      }
      
      console.log('Fetching fresh video data');
      
      // Preload thumbnails for better performance
      const preloadThumbnails = videos.map(video => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
        });
      });
      
      // Wait for thumbnails to load
      await Promise.all(preloadThumbnails);
      
      for (const video of videos) {
        try {
          const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.id}&format=json`);
          if (response.ok) {
            const data = await response.json();
            videoData[video.id] = {
              title: data.title || video.title,
              description: data.author_name || video.description,
              thumbnails: {
                medium: {
                  url: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
                }
              }
            };
          } else {
            videoData[video.id] = {
              title: video.title,
              description: video.description,
              thumbnails: {
                medium: {
                  url: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
                }
              }
            };
          }
        } catch (error) {
          console.error(`Error fetching video info for ${video.id}:`, error);
          videoData[video.id] = {
            title: video.title,
            description: video.description,
            thumbnails: {
              medium: {
                url: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
              }
            }
          };
        }
      }
      
      // Cache the data
      const cacheData = {
        data: videoData,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('Video data cached successfully:', cacheData);
      
      setAllVideoInfo(videoData);
      setVideoInfo(videoData[videos[0].id]);
    };

    preloadAllVideos();
  }, []);

  // Auto-slide effect for videos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  // Update video info when current video changes
  useEffect(() => {
    if (allVideoInfo[currentVideo.id]) {
      setVideoInfo(allVideoInfo[currentVideo.id]);
    }
  }, [currentVideoIndex, allVideoInfo]);

  // Fetch category data from backend
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const category = await CategoryService.getCategoryWithSubcategories(categoryId);
        setCategoryData([category]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  // Find the current category from the fetched data
  const currentCategory = categoryData?.[0];

  useEffect(() => {
    if (!loading && !currentCategory) {
      navigate('/category');
    }
  }, [categoryId, currentCategory, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading {categoryId}...</h3>
          <p className="text-gray-600">Fetching the best services for you</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/category')} 
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Categories
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h3>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => navigate('/category')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Browse All Categories
          </button>
        </motion.div>
      </div>
    );
  }

  // Filter and sort subcategories
  const filteredSubcategories = currentCategory.subcategories?.filter(subcategory => {
    const matchesSearch = subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subcategory.description && subcategory.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'trending' && subcategory.trending) ||
                         (selectedFilter === 'popular' && subcategory.order < 10);
    
    return matchesSearch && matchesFilter;
  }) || [];

  const sortedSubcategories = [...filteredSubcategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'count':
        return (b.subcategoryCount || 0) - (a.subcategoryCount || 0);
      case 'rating':
        return (b.avgRating || 0) - (a.avgRating || 0);
      case 'popular':
      default:
        return (b.order || 0) - (a.order || 0);
    }
  });

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/category/${categoryId}/${subcategoryId}`);
  };

  const handleCompanyClick = (subcategoryId, companySlug) => {
    navigate(`/category/${categoryId}/${subcategoryId}/${companySlug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-white/80 mb-2">
            <button 
              onClick={() => navigate('/category')}
              className="hover:text-white transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-semibold">{currentCategory.name}</span>
          </div>
          
          {/* Category Header */}
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-white/95 shadow-lg border border-gray-200/50">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-3xl font-bold mb-2">
                    {currentCategory.name}
                  </h1>
                </div>
              </div>

              <p className="text-lg text-white/90 mb-3 leading-relaxed">
                {currentCategory.description || 'Discover the most trusted and reliable services in this category. Get instant access to verified contact information and expert support.'}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">{currentCategory.subcategoryCount || 0}</div>
                  <div className="text-white/80 text-xs">Services</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">24/7</div>
                  <div className="text-white/80 text-xs">Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">100%</div>
                  <div className="text-white/80 text-xs">Verified</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm">
                  <Search className="h-4 w-4" />
                  Explore Services
                </button>
                <button className="bg-white/10 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2 text-sm">
                  <Share2 className="h-4 w-4" />
                  Share Category
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Video Guide
              </h3>
              <div className="space-y-3">
                {/* Video Slider Section */}
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/20 h-48">

                  
                  <motion.div
                    key={currentVideoIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${currentVideo.id}/hqdefault.jpg`}
                      alt={currentVideo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-2 shadow-lg">
                        <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 block"
                      title="Watch on YouTube"
                    ></a>
                  </motion.div>
                  

                </div>
                
                {/* Title Section */}
                <div className="text-center h-12 flex items-center justify-center">
                  <motion.div
                    key={currentVideoIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white/90 text-sm font-semibold line-clamp-2"
                  >
                    {videoInfo?.title || currentVideo.title}
                  </motion.div>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentVideoIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 items-center justify-between"
          >
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="text-lg">×</span>
                </button>
              )}
            </div>

            {/* Enhanced Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm pr-12"
                >
                  <option value="all">All Services</option>
                  <option value="trending">Trending</option>
                  <option value="popular">Most Popular</option>
                  <option value="verified">Verified Only</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm pr-12"
                >
                  <option value="popular">Most Popular</option>
                  <option value="name">Name A-Z</option>
                  <option value="count">Most Companies</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Subcategories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Available Services'}
            </h2>
            <p className="text-gray-600">
              {sortedSubcategories.length === 0 
                ? 'No services found' 
                : `Showing ${sortedSubcategories.length} of ${currentCategory.subcategoryCount || 0} services`
              }
            </p>
          </div>
          
          {sortedSubcategories.length > 0 && (
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 1000) + 500} people viewed this category</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Enhanced Subcategories Grid/List */}
        <AnimatePresence mode="wait">
          {sortedSubcategories.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `We couldn't find any services matching "${searchTerm}". Try adjusting your search terms.`
                  : 'There are currently no services available in this category. Check back soon!'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}
            >
              {sortedSubcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory._id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -1,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group"
                >
                  {/* Top: Logo, Name, Verified, Tag */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                      {subcategory.logo ? (
                        <img src={subcategory.logo} alt={subcategory.name} className="w-10 h-10 object-contain bg-transparent" style={{ background: 'transparent', borderRadius: 0, boxShadow: 'none' }} />
                      ) : (
                        <span className="text-gray-300 text-xl font-bold">{subcategory.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span
                          className="font-semibold text-gray-900 text-lg truncate cursor-pointer transition-colors duration-200 hover:text-orange-600 hover:underline"
                          onClick={() => handleSubcategoryClick(subcategory.slug)}
                        >
                          {subcategory.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {subcategory.description || 'Professional service with excellent customer support and verified contact information.'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Row */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      All India
                    </span>
                    <span className="mx-1 text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Mon - Sat, 9 AM - 5 PM
                    </span>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-100 my-3" />
                  
                  {/* Contact Row */}
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="font-bold text-gray-900 text-[15px] md:text-[16px] whitespace-nowrap">
                      {subcategory.phone || '1800-XXX-XXXX'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(subcategory.phone || '1800-XXX-XXXX');
                      }} 
                      className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" 
                      title="Copy"
                    >
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite
                      }} 
                      className="ml-1 p-1 rounded hover:bg-gray-100 flex-shrink-0 transition" 
                      title="Favorite"
                    >
                      <Heart className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </button>
                  </div>
                  
                  {/* Action Row: Call Now and View More buttons side by side */}
                  <div className="flex flex-nowrap gap-2 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${subcategory.phone || '1800-XXX-XXXX'}`);
                      }}
                      className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-300"
                      style={{ minWidth: 0 }}
                    >
                      <Phone className="h-5 w-5 text-white" /> Call Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubcategoryClick(subcategory.slug);
                      }}
                      className="w-1/2 bg-orange-50 border border-orange-200 text-orange-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-orange-100 transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-200"
                      style={{ minWidth: 0 }}
                    >
                      View More <ArrowRight className="h-5 w-5 text-orange-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
};

export default CategoryPage;
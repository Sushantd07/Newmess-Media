import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  ChevronDown,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import CompanySeoGear from './CompanySeoGear.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const langRef = useRef(null);
  const categoriesRef = useRef(null);
  const langDropdownTimer = useRef(null);
  const categoriesDropdownTimer = useRef(null);

  // Removed scroll-triggered header shadow to avoid a visible thin line under the navbar
  // If a subtle separation is needed later, prefer a light border instead of a shadow.

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCategoriesOpen && categories.length > 0 && !hoveredCategory) {
      setHoveredCategory(categories[0]);
    }
  }, [isCategoriesOpen]);

  const categories = [
    {
      name: "Banking & Finance",
      count: "2.5K+",
      subcategories: [
        { name: "Banks", count: "1.2K+" },
        { name: "Credit Cards", count: "800+" },
        { name: "Loans", count: "500+" },
        { name: "Investment", count: "400+" },
        { name: "Insurance", count: "600+" },
        { name: "Stock Brokerage", count: "300+" },
      ],
    },
    {
      name: "Telecommunications",
      count: "1.8K+",
      subcategories: [
        { name: "Mobile Operators", count: "1.1K+" },
        { name: "Internet Service", count: "700+" },
        { name: "DTH Services", count: "300+" },
        { name: "Landline", count: "200+" },
        { name: "Business Solutions", count: "400+" },
      ],
    },
    {
      name: "E-commerce",
      count: "3.2K+",
      subcategories: [
        { name: "Online Shopping", count: "1.8K+" },
        { name: "Food Delivery", count: "900+" },
        { name: "Travel Booking", count: "500+" },
        { name: "Grocery Delivery", count: "700+" },
        { name: "Fashion Retail", count: "1.1K+" },
      ],
    },
    {
      name: "Healthcare",
      count: "4.1K+",
      subcategories: [
        { name: "Hospitals", count: "2.1K+" },
        { name: "Pharmacy", count: "1.2K+" },
        { name: "Diagnostics", count: "800+" },
        { name: "Clinics", count: "1.5K+" },
        { name: "Health Insurance", count: "900+" },
        { name: "Wellness Centers", count: "600+" },
      ],
    },
    {
      name: "Travel & Tourism",
      count: "2.9K+",
      subcategories: [
        { name: "Airlines", count: "800+" },
        { name: "Hotels", count: "1.1K+" },
        { name: "Tour Operators", count: "500+" },
        { name: "Railways", count: "500+" },
        { name: "Car Rentals", count: "400+" },
        { name: "Travel Insurance", count: "300+" },
      ],
    },
    {
      name: "Insurance",
      count: "1.6K+",
      subcategories: [
        { name: "Health Insurance", count: "700+" },
        { name: "Life Insurance", count: "500+" },
        { name: "Vehicle Insurance", count: "400+" },
        { name: "Travel Insurance", count: "300+" },
        { name: "Property Insurance", count: "200+" },
      ],
    },
    {
      name: "Government Services",
      count: "3.5K+",
      subcategories: [
        { name: "Passport Services", count: "800+" },
        { name: "Tax Departments", count: "1.1K+" },
        { name: "Municipal Services", count: "900+" },
        { name: "Public Utilities", count: "700+" },
        { name: "Licensing", count: "500+" },
      ],
    },
    {
      name: "Education",
      count: "2.3K+",
      subcategories: [
        { name: "Universities", count: "800+" },
        { name: "Schools", count: "1.2K+" },
        { name: "Coaching Centers", count: "600+" },
        { name: "Online Learning", count: "400+" },
        { name: "Exam Boards", count: "500+" },
      ],
    },
    {
      name: "Automotive",
      count: "1.7K+",
      subcategories: [
        { name: "Car Manufacturers", count: "800+" },
        { name: "Two-Wheelers", count: "600+" },
        { name: "Service Centers", count: "700+" },
        { name: "Spare Parts", count: "400+" },
        { name: "Vehicle Insurance", count: "500+" },
      ],
    },
    {
      name: "Utilities",
      count: "1.9K+",
      subcategories: [
        { name: "Electricity", count: "900+" },
        { name: "Water Supply", count: "700+" },
        { name: "Gas Services", count: "600+" },
        { name: "Waste Management", count: "300+" },
        { name: "Renewable Energy", count: "400+" },
      ],
    },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "mr", name: "मराठी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "bn", name: "বাংলা" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
  ];

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setIsLangOpen(false);
  };

  const sidebarItems = [
    {
      title: "Quick Links",
      items: [
        "Home",
        "Search Directory",
        "Emergency Numbers",
        "Popular Services",
      ],
    },
    {
      title: "Categories",
      items: [
        "Banking & Finance",
        "Telecommunications",
        "E-commerce",
        "Healthcare",
        "Travel & Tourism",
        "Insurance",
      ],
    },
    {
      title: "Support",
      items: ["Help Center", "Contact Us", "Report Issue", "Feedback"],
    },
    {
      title: "About",
      items: ["About Us", "Privacy Policy", "Terms of Service", "Disclaimer"],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white text-gray-800  h-[74px] max-[400px]:h-auto transition-shadow duration-300">
        {/* Floating SEO button is injected by pages, not here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-[400px]:px-2">
          <div className="flex items-center justify-between py-3 max-[400px]:py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 max-[400px]:space-x-2 group flex-1 min-w-0">
              <img
                src="/logo3-Photoroom.png"
                alt="ICH logo"
                className="w-15 h-15 max-[400px]:w-10 max-[400px]:h-10 object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-2xl max-[400px]:text-lg font-bold text-orange-600 tracking-tight leading-tight">
                  India Customer Help
                </h1>
                <p className="text-sm text-slate-500 font-medium max-[400px]:hidden">
                  India's Trusted Business Directory
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-6">
              {/* Language Dropdown */}
              <div
                className="relative group lang-dropdown"
                ref={langRef}
                onMouseEnter={() => {
                  if (langDropdownTimer.current)
                    clearTimeout(langDropdownTimer.current);
                  setIsLangOpen(true);
                }}
                onMouseLeave={() => {
                  langDropdownTimer.current = setTimeout(
                    () => setIsLangOpen(false),
                    180
                  );
                }}
              >
                <button className="flex items-center text-sm font-medium text-gray-800 hover:text-orange-600 transition-colors">
                  <Globe className="h-4 w-4 mr-1" />
                  {selectedLanguage.slice(0, 2).toUpperCase()}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    >
                      <ul className="text-sm font-medium text-gray-800 py-2">
                        {languages.map((lang) => (
                          <li
                            key={lang.code}
                            onClick={() => selectLanguage(lang.name)}
                            className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 hover:text-orange-600 cursor-pointer"
                          >
                            <span>{lang.name}</span>
                            <span className="text-gray-400 font-semibold">
                              {lang.code.toUpperCase()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Home Link */}
              <Link
                to="/"
                className="text-base font-medium text-gray-800 hover:text-orange-600 relative group transition-colors"
              >
                Home
                <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Enhanced Categories Dropdown */}
              <div
                className="relative group categories-dropdown"
                ref={categoriesRef}
                onMouseEnter={() => {
                  if (categoriesDropdownTimer.current)
                    clearTimeout(categoriesDropdownTimer.current);
                  setIsCategoriesOpen(true);
                }}
                onMouseLeave={() => {
                  categoriesDropdownTimer.current = setTimeout(
                    () => setIsCategoriesOpen(false),
                    180
                  );
                }}
              >
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  onMouseEnter={() => {
                    setIsCategoriesOpen(true);
                    if (!hoveredCategory && categories.length > 0) {
                      setHoveredCategory(categories[0]);
                    }
                  }}
                >
                  All Categories
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform text-white ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.23, ease: "easeOut" }}
                      className="absolute z-10 mt-2 w-[600px] max-w-[95vw] right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-x-auto"
                    >
                      <div className="flex">
                        {/* Main Categories Column */}
                        <div className="w-2/5 border-r border-gray-100">
                          <div className="p-2 max-h-[400px] overflow-y-auto">
                            {categories.map((category) => (
                              <div
                                key={category.name}
                                onMouseEnter={() =>
                                  setHoveredCategory(category)
                                }
                                className={`flex justify-between items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-all cursor-pointer ${
                                  hoveredCategory?.name === category.name
                                    ? "bg-orange-50 text-orange-600"
                                    : ""
                                }`}
                              >
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                  {category.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Subcategories Column */}
                        <div className="w-3/5">
                          <div className="p-2 max-h-[400px] overflow-y-auto">
                            {hoveredCategory && (
                              <>
                                <div className="px-4 py-2 font-semibold text-gray-800 border-b border-gray-100">
                                  {hoveredCategory.name}
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-2">
                                  {hoveredCategory.subcategories.map((sub) => (
                                    <a
                                      key={sub.name}
                                      href="#"
                                      className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-all"
                                    >
                                      <span>{sub.name}</span>
                                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                                        {sub.count}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-orange-100 transition-colors"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Desktop Hamburger Menu */}
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-orange-100 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </nav>

            {/* Mobile Toggle */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-800 mr-3"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Language Dropdown */}
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center justify-between w-full text-base font-medium text-gray-800"
                  >
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Language: {selectedLanguage}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isLangOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isLangOpen && (
                    <div className="mt-3 space-y-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.name)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Nav Links */}
                <a
                  href="#"
                  className="block text-base font-medium text-gray-800 hover:text-orange-600 py-2"
                >
                  Home
                </a>

                {/* Mobile Categories */}
                <div>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center justify-between w-full text-base font-medium text-gray-800 py-2"
                  >
                    All Categories
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isCategoriesOpen && (
                    <div className="mt-2 space-y-1">
                      {categories.map((category) => (
                        <a
                          key={category.name}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {category.name} ({category.count})
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <CompanySeoGear />
      </header>

      {/* Desktop Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full pb-20">
              {sidebarItems.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a
                          href="#"
                          className="block text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;

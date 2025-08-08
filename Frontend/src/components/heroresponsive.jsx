import React, { useState, useEffect } from 'react';
import {
  Search, Building2, Shield, Clock, Users, Globe,
  PhoneCall, HeartPulse, Flame, Baby, Brain, Pill, 
  ShieldCheck, UserCheck, CreditCard, Car, Plane, 
  Building, Scale, ChevronDown, ChevronUp, Filter
} from 'lucide-react';

const HeroSection = () => {
  const [business, setBusiness] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [userState, setUserState] = useState('Detecting...');
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
        );
        const data = await response.json();

        const stateComponent = data.results[0]?.address_components.find(comp =>
          comp.types.includes('administrative_area_level_1')
        );
        if (stateComponent) {
          setUserState(stateComponent.long_name);
        } else {
          setUserState('Unknown');
        }
      } catch (err) {
        console.error("Geolocation error:", err);
        setUserState('Unavailable');
      }
    }, () => {
      setUserState('Location Denied');
    });
  }, []);

  const placeholderWords = ['JIO', 'AMAZON', 'AIRTEL', 'ICICI', 'SWIGGY', 'ZOMATO'];

  // Typing animation logic
  useEffect(() => {
    const currentWord = placeholderWords[wordIndex];
    const updatedText = isDeleting
      ? currentWord.substring(0, placeholderText.length - 1)
      : currentWord.substring(0, placeholderText.length + 1);

    setPlaceholderText(updatedText);

    const timeout = setTimeout(() => {
      if (!isDeleting && updatedText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % placeholderWords.length);
      }
    }, isDeleting ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, wordIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching:', business);
  };

  // Comprehensive helpline data organized by categories
  const helplineCategories = {
    emergency: {
      title: '🚨 Emergency',
      color: 'from-red-500 to-red-600',
      services: [
        { icon: PhoneCall, title: 'National Emergency', number: '112', available24x7: true },
        { icon: PhoneCall, title: 'Police', number: '100', available24x7: true },
        { icon: Flame, title: 'Fire', number: '101', available24x7: true },
        { icon: HeartPulse, title: 'Ambulance', number: '102', available24x7: true },
        { icon: Shield, title: 'Disaster Mgmt', number: '108', available24x7: true },
        { icon: Flame, title: 'Gas Leak', number: '1906', available24x7: true }
      ]
    },
    health: {
      title: '🏥 Health & Medical',
      color: 'from-green-500 to-green-600',
      services: [
        { icon: HeartPulse, title: 'Ayushman Bharat', number: '14555', available24x7: false },
        { icon: Shield, title: 'COVID-19', number: '1075', available24x7: true },
        { icon: HeartPulse, title: 'Blood Bank', number: '104', available24x7: true },
        { icon: Brain, title: 'Mental Health', number: '1800-599-0019', available24x7: true },
        { icon: HeartPulse, title: 'AIDS Helpline', number: '1097', available24x7: true },
        { icon: Pill, title: 'Medicine Info', number: '1800-180-1104', available24x7: false }
      ]
    },
    'women-children': {
      title: '👩‍👧‍👦 Women & Children',
      color: 'from-pink-500 to-pink-600',
      services: [
        { icon: ShieldCheck, title: 'Women Helpline', number: '1091', available24x7: true },
        { icon: ShieldCheck, title: 'Domestic Violence', number: '181', available24x7: true },
        { icon: Baby, title: 'Child Helpline', number: '1098', available24x7: true },
        { icon: ShieldCheck, title: 'Women Safety', number: '112', available24x7: true }
      ]
    },
    senior: {
      title: '👵 Senior Citizens',
      color: 'from-purple-500 to-purple-600',
      services: [
        { icon: UserCheck, title: 'Elderly Helpline', number: '14567', available24x7: true },
        { icon: UserCheck, title: 'Senior Abuse', number: '1291', available24x7: false },
        { icon: HeartPulse, title: 'Senior Health', number: '104', available24x7: true }
      ]
    },
    'cyber-financial': {
      title: '💳 Cyber & Financial',
      color: 'from-blue-500 to-blue-600',
      services: [
        { icon: Shield, title: 'Cyber Crime', number: '1930', available24x7: true },
        { icon: CreditCard, title: 'Banking Fraud', number: '155260', available24x7: true },
        { icon: Users, title: 'Consumer Help', number: '1800-11-4000', available24x7: true },
        { icon: CreditCard, title: 'Credit Card', number: '1800-1800-1800', available24x7: true }
      ]
    },
    transport: {
      title: '🛣️ Transport & Travel',
      color: 'from-indigo-500 to-indigo-600',
      services: [
        { icon: Car, title: 'Road Accident', number: '1073', available24x7: true },
        { icon: Car, title: 'Railway Enquiry', number: '139', available24x7: true },
        { icon: Shield, title: 'Railway Police', number: '182', available24x7: true },
        { icon: Plane, title: 'Air Travel', number: '155254', available24x7: true }
      ]
    },
    civic: {
      title: '🏙️ Civic Services',
      color: 'from-teal-500 to-teal-600',
      services: [
        { icon: Building, title: 'Swachh Bharat', number: '1969', available24x7: false },
        { icon: Building, title: 'Electricity', number: '1912', available24x7: true },
        { icon: Building, title: 'Water Supply', number: '1916', available24x7: false }
      ]
    },
    'govt-legal': {
      title: '🧑‍⚖️ Govt & Legal',
      color: 'from-orange-500 to-orange-600',
      services: [
        { icon: Scale, title: 'Voter Helpline', number: '1950', available24x7: true },
        { icon: Scale, title: 'Passport Seva', number: '1800-258-1800', available24x7: true },
        { icon: Scale, title: 'Aadhaar Card', number: '1947', available24x7: true },
        { icon: Scale, title: 'PAN Card', number: '1800-180-1961', available24x7: true },
        { icon: Scale, title: 'RTI Helpline', number: '1964', available24x7: false },
        { icon: Scale, title: 'Human Rights', number: '14433', available24x7: false }
      ]
    }
  };

  const currentCategory = helplineCategories[selectedCategory];
  const displayedServices = showAll ? currentCategory.services : currentCategory.services.slice(0, 6);

  const handleCall = (title, number) => {
    if (window.confirm(`Call ${title} at ${number}?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  // Add help topics for the new left container
  const helpTopics = [
    'How to update Aadhaar',
    'How to complain on Flipkart',
    'How to check PAN status',
    'How to block lost ATM card',
    'How to contact IRCTC',
    'How to get COVID certificate',
    'How to check PF balance',
    'How to report cyber crime',
    'How to get FASTag',
    'How to file RTI',
    'How to get voter ID',
    'How to check electricity bill',
    'How to get passport',
    'How to check train PNR',
    'How to get driving license',
    'How to get birth certificate',
    'How to get caste certificate',
    'How to get income certificate',
    'How to get land records',
    'How to get ration card',
    'How to get domicile certificate',
    'How to get marriage certificate',
    'How to get death certificate',
    'How to get property tax info',
    'How to get water bill info',
    'How to get gas connection',
    'How to get LPG subsidy',
    'How to get Ayushman card',
    'How to get health insurance',
    'How to get scholarship',
    'How to get pension',
    'How to get disability certificate',
    'How to get EWS certificate',
    'How to get NOC',
    'How to get police clearance',
    'How to get arms license',
    'How to get vehicle registration',
    'How to get birth registration',
    'How to get caste validity',
    'How to get income tax info',
    'How to get GST info',
    'How to get MSME registration',
    'How to get startup registration',
    'How to get Udyam registration',
    'How to get digital signature',
    'How to get eKYC',
    'How to get mobile number update',
    'How to get address proof',
    'How to get legal heir certificate',
    'How to get succession certificate',
    'How to get mutation certificate',
    'How to get property registration',
    'How to get land mutation',
    'How to get encumbrance certificate',
  ];

  return (
    <div className="w-full min-h-[400px] sm:min-h-[500px] lg:h-[542px] bg-gradient-to-b from-[#F28C28] via-[#FDFDFC] to-[#1D8052] px-3 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 flex items-center justify-center">
      <div className="w-full max-w-7xl xl:max-w-9xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 h-full items-stretch">
        
        {/* Desktop Help Topics Container - Hidden on mobile/tablet */}
        <div className="hidden lg:flex flex-col w-[23%] h-[479px] rounded-xl shadow-md border border-gray-100 overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#F28C28]/20 to-[#fff] font-bold text-sm text-orange-700 tracking-wide uppercase text-center">
            Help Topics
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent bg-gradient-to-b from-[#fff] to-[#fdf7ed]">
            <ul className="divide-y divide-orange-50">
              {helpTopics.map((topic, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 text-[15px] text-gray-800 hover:bg-orange-100 hover:text-orange-700 cursor-pointer transition-colors select-none rounded-md mx-2 my-1 font-medium"
                  style={{ transition: 'background 0.2s, color 0.2s' }}
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile/Tablet Help Topics - Horizontal scrollable */}
        <div className="lg:hidden w-full mb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent px-1 py-2 bg-white rounded-xl shadow-md border border-gray-100">
            {helpTopics.slice(0, 15).map((topic, idx) => (
              <button
                key={idx}
                className="whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-50 text-orange-700 text-xs sm:text-sm font-semibold border border-orange-100 hover:bg-orange-100 hover:text-orange-800 transition-colors shadow-sm flex-shrink-0"
              >
                {topic.length > 20 ? `${topic.substring(0, 20)}...` : topic}
              </button>
            ))}
            {helpTopics.length > 15 && (
              <span className="px-3 text-gray-400 text-xs whitespace-nowrap">+{helpTopics.length - 15} more</span>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 flex-1">
          
          {/* Left Box - Main Hero Content */}
          <div className="w-full lg:w-[65%] bg-[#fff] rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 overflow-hidden">

            <p className="text-xs sm:text-sm font-medium text-orange-600 uppercase mb-2 tracking-wide">
              Find Help Instantly — No More Scams or Fake Numbers
            </p>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
              India's Most Trusted <span className="text-orange-600">Toll-Free Directory</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl">
              Get quick access to verified toll-free numbers for essential services and top businesses across India.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-gray-700">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Verified Data</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-gray-700">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span>Updated Daily</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-gray-700">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span className="hidden sm:inline">10M+ Searches</span>
                <span className="sm:hidden">10M+</span>
              </div>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-4 sm:mb-6">
              
              {/* Location Dropdown */}
              <div className="relative w-full sm:w-[30%]">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  type="text"
                  value={userState}
                  readOnly
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-orange-400 text-orange-700 font-medium shadow-sm cursor-default text-sm sm:text-base"
                />
              </div>

              {/* Business Search Input */}
              <div className="relative w-full sm:w-[45%]">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${placeholderText}`}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-sm sm:text-base shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all w-full sm:w-auto shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Search className="inline-block w-4 h-4 mr-2" />
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="bg-white border border-gray-200 rounded-xl px-3 sm:px-6 py-4 sm:py-5 shadow-md">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                {[
                  { value: '50K+', label: 'Verified Numbers' },
                  { value: '99.9%', label: 'Accuracy Rate' },
                  { value: '24/7', label: 'Support' },
                  { value: '2022', label: 'Since' }
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-3 sm:pt-4">
              <div className="flex items-center gap-1 sm:gap-2">✓ No Registration</div>
              <div className="flex items-center gap-1 sm:gap-2">✓ Free</div>
              <div className="flex items-center gap-1 sm:gap-2">✓ No Spam</div>
              <div className="flex items-center gap-1 sm:gap-2">🔒 Secure</div>
            </div>
          </div>

          {/* Right Box - Helpline Directory */}
          <div className="w-full lg:w-[35%] bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 overflow-hidden relative">
            <div className="absolute -bottom-6 w-20 h-20 rounded-full bg-[#000080] opacity-5"></div>

            <div className="h-full flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">🆘 India Helpline Directory</h2>

              {/* Category Selector */}
              <div className="mb-3 sm:mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white"
                >
                  {Object.entries(helplineCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Category Title */}
              <div className={`mb-3 sm:mb-4 p-3 rounded-lg bg-gradient-to-r ${currentCategory.color} text-white text-center`}>
                <h3 className="font-semibold text-sm">{currentCategory.title}</h3>
                <p className="text-xs opacity-90">{currentCategory.services.length} services available</p>
              </div>

              {/* Services Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {displayedServices.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={index}
                        onClick={() => handleCall(service.title, service.number)}
                        className="cursor-pointer hover:bg-orange-50 transition-all duration-200 hover:scale-[1.02] p-2 rounded-lg text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 group"
                      >
                        {/* Circular Icon */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${currentCategory.color} rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white bg-transparent" style={{ background: 'none' }} />
                        </div>
                        
                        {/* Service Name */}
                        <div className="font-semibold text-gray-800 text-[10px] sm:text-xs leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                          {service.title}
                        </div>
                        
                        {/* Phone Number */}
                        <div className="text-blue-600 font-mono text-[10px] sm:text-xs mb-1">
                          {service.number}
                        </div>
                        
                        {/* 24x7 Badge */}
                        <div className="flex justify-center">
                          {service.available24x7 ? (
                            <span className="text-[8px] sm:text-[10px] bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full">24x7</span>
                          ) : (
                            <span className="text-[8px] sm:text-[10px] bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full">Limited</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Show More/Less Button */}
              {currentCategory.services.length > 6 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                  >
                    {showAll ? (
                      <>
                        Show Less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        +{currentCategory.services.length - 6} More
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
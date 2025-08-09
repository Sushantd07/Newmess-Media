import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import {
  Search, Building2, Shield, Clock, Users, Globe,
  PhoneCall, HeartPulse, Flame, Baby, Brain, Pill,
  ShieldCheck, UserCheck, CreditCard, Car, Plane,
  Building, Scale, ChevronDown, ChevronUp, Filter,
  Mic
} from 'lucide-react';

const HeroSection = () => {
  const [business, setBusiness] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [userState, setUserState] = useState('Detecting...');
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [showAll, setShowAll] = useState(false);
  const [helpSearch, setHelpSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isHelpListening, setIsHelpListening] = useState(false);
  const helpRecognitionRef = useRef(null);

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
        setUserState(stateComponent ? stateComponent.long_name : 'Unknown');
      } catch (err) {
        console.error("Geolocation error:", err);
        setUserState('Unavailable');
      }
    }, () => setUserState('Location Denied'));
  }, []);

  const placeholderWords = ['JIO', 'AMAZON', 'AIRTEL', 'ICICI Bank', 'SWIGGY', 'ZOMATO'];
  useEffect(() => {
    const currentWord = placeholderWords[wordIndex];
    let timeout;
    if (!isDeleting && placeholderText !== currentWord) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentWord.substring(0, placeholderText.length + 1));
      }, 120);
    } else if (!isDeleting && placeholderText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && placeholderText !== '') {
      timeout = setTimeout(() => {
        setPlaceholderText(currentWord.substring(0, placeholderText.length - 1));
      }, 80);
    } else if (isDeleting && placeholderText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % placeholderWords.length);
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, wordIndex]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setBusiness(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return alert('Voice typing is not supported in this browser.');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    helpRecognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHelpSearch(transcript);
      setIsHelpListening(false);
    };
    recognition.onerror = () => setIsHelpListening(false);
    recognition.onend = () => setIsHelpListening(false);
  }, []);

  const handleHelpMicClick = () => {
    if (!helpRecognitionRef.current) return alert('Voice typing is not supported in this browser.');
    if (isHelpListening) {
      helpRecognitionRef.current.stop();
      setIsHelpListening(false);
    } else {
      setIsHelpListening(true);
      helpRecognitionRef.current.start();
    }
  };

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
    'How to get caste certificate correction',
    'How to get income certificate correction',
    'How to get birth certificate correction',
    'How to get death certificate correction',
    'How to get marriage certificate correction',
    'How to get ration card correction',
    'How to get voter ID correction',
    'How to get PAN correction',
    'How to get Aadhaar correction',
    'How to get passport correction',
    'How to get driving license correction',
    'How to get vehicle registration correction',
    'How to get property tax correction',
    'How to get water bill correction',
    'How to get gas connection correction',
    'How to get LPG subsidy correction',
    'How to get Ayushman card correction',
    'How to get health insurance correction',
    'How to get scholarship correction',
    'How to get pension correction',
    'How to get disability certificate correction',
    'How to get EWS certificate correction',
    'How to get NOC correction',
    'How to get police clearance correction',
    'How to get arms license correction',
    'How to get vehicle registration correction',
    'How to get birth registration correction',
    'How to get caste validity correction',
    'How to get income tax correction',
    'How to get GST correction',
    'How to get MSME registration correction',
    'How to get startup registration correction',
    'How to get Udyam registration correction',
    'How to get digital signature correction',
    'How to get eKYC correction',
    'How to get mobile number update correction',
    'How to get address proof correction',
    'How to get legal heir certificate correction',
    'How to get succession certificate correction',
    'How to get mutation certificate correction',
    'How to get property registration correction',
    'How to get land mutation correction',
    'How to get encumbrance certificate correction',
  ];

  // Filter and sort help topics by search
  const filteredHelpTopics = helpTopics
    .map((topic) => ({
      topic,
      match: helpSearch.trim() === "" ? 0 : topic.toLowerCase().indexOf(helpSearch.toLowerCase()),
    }))
    .filter(({ match }) => helpSearch.trim() === "" || match !== -1)
    .sort((a, b) => {
      if (a.match === b.match) return a.topic.localeCompare(b.topic);
      if (a.match === -1) return 1;
      if (b.match === -1) return -1;
      return a.match - b.match;
    })
    .map(({ topic }) => topic);

  return (
    <div className="relative overflow-hidden border-amber-800 b-[10px] w-full min-h-[400px] sm:min-h-[500px] lg:h-[542px] bg-gradient-to-b from-[#F28C28] via-[#FDFDFC] to-[#1D8052] px-1 sm:px-6 lg:px-12 py-6 sm:py-8 flex items-center justify-center shadow-[0_4px_30px_rgba(0,0,0,0.1)]">

      {/* Premium Top Shadow */}
      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-10"></div>

      {/* Premium Bottom Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10"></div>

      {/* Your original content starts here */}
      <div className="w-full max-w-9xl mx-auto flex flex-col md:flex-row gap-6 h-full items-stretch">
                {/* NEW: Left Help Topics Container */}
        {/* Desktop vertical sidebar */}
        <div className="hidden md:flex flex-col w-[23%] h-[479px] rounded-xl shadow-xl border border-orange-100/70 overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#F28C28]/20 to-[#fff] font-bold text-sm text-orange-700 tracking-wide uppercase text-center">
            Help Topics
          </div>
          {/* Search Bar */}
          <div className="px-4 py-3 bg-white border-b border-orange-50 flex items-center gap-2 relative">
            <input
              type="text"
              value={helpSearch}
              onChange={e => setHelpSearch(e.target.value)}
              placeholder="Search help..."
              className="w-full rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm placeholder:text-orange-400"
              style={{ fontWeight: 500 }}
            />
            {/* Mic icon for voice typing */}
            <button
              type="button"
              onClick={handleHelpMicClick}
              className={`absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full transition-colors ${isHelpListening ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'} focus:outline-none`}
              aria-label="Voice Search"
              tabIndex={0}
            >
              <Mic className={`h-5 w-5 ${isHelpListening ? 'animate-pulse' : ''} bg-transparent`} style={{ background: 'none' }} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent bg-gradient-to-b from-[#fff] to-[#fdf7ed]">
            <ul className="divide-y divide-orange-50">
              {filteredHelpTopics.map((topic, idx) => (
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
        {/* Mobile horizontal scrollable bar (removed for mobile view as requested) */}
        {/* Main Content for Mobile */}
        <div className="md:hidden w-full flex flex-col gap-3">
          {/* Mobile hero heading + about text (matches requested design) */}
          <div className="px-2 text-center">
            <h1 className="text-[22px] leading-snug font-extrabold text-white">
              India's Most Trusted <span className="text-orange-200">Toll-Free Directory</span>
            </h1>
            <p className="mt-1 text-[13px] text-white/90">
              Get quick access to verified toll-free numbers for essential services and top businesses across India.
            </p>
            <div className="mt-2 mx-auto h-1 w-16 bg-orange-400 rounded-full"></div>
          </div>
          {/* Compact Search Bar - single rounded bar layout as per reference */}
          <div className="rounded-2xl shadow-md bg-white px-2 py-2">
            <form onSubmit={handleSearch} className="flex items-stretch gap-2">
              {/* Location */}
              <div className="relative flex-1 max-w-[38%]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={userState}
                  readOnly
                  className="w-full h-12 pl-8 pr-2 rounded-xl bg-white border border-orange-400 text-orange-700 font-medium shadow-sm cursor-default text-sm"
                />
              </div>
              {/* Search */}
              <div className="relative flex-[1.6]">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Find your service (e.g., ${placeholderText})`}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="w-full h-12 pl-9 pr-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus:outline-none"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions (removed in mobile view as requested) */}

          {/* Category Chips */}
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="flex items-center gap-2 py-1">
              {Object.entries(helplineCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm flex-shrink-0 ${selectedCategory===key ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Helpline Directory */}
          <div className="rounded-xl shadow-md bg-white px-4 py-4">
            <div className="mb-3 p-3 rounded-lg text-balck text-center bg-gradient-to-r "
                 style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }}>
              <div className={`hidden`}></div>
              <h3 className={`font-semibold text-sm`}>{currentCategory.title}</h3>
              <p className="text-xs opacity-90">{currentCategory.services.length} services available</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {displayedServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleCall(service.title, service.number)}
                    className="text-left rounded-lg border border-gray-100 shadow-sm p-2.5 hover:bg-orange-50 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${currentCategory.color} shadow`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="font-semibold text-gray-800 text-xs leading-tight">{service.title}</div>
                    </div>
                    <div className="text-blue-700 font-mono text-xs">{service.number}</div>
                    <div className="mt-1">
                      {service.available24x7 ? (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">24x7</span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">Limited</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {currentCategory.services.length > 6 && (
              <div className="mt-3 pt-2 border-t border-gray-200">
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

        {/* Desktop layout container (hidden on mobile) */}
        <div className="hidden md:flex flex-1 flex-row gap-6">
        {/* Left Box */}
        <div className="w-full md:w-[65%] bg-[#fff] rounded-xl shadow-xl p-4 md:p-6 border border-orange-100/70 overflow-hidden">

          <p className="text-sm font-medium text-orange-600 uppercase mb-2 tracking-wide">
            Find Help Instantly — No More Scams or Fake Numbers
          </p>

          <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
            India's Most Trusted <span className="text-orange-600">Toll-Free Directory</span>
          </h1>

          <p className="text-gray-600 text-md mb-4 max-w-2xl">
            Get quick access to verified toll-free numbers for essential services and top businesses across India.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700">
              <Shield className="h-4 w-4 text-orange-600 bg-transparent" style={{ background: 'none' }} /> Verified Data
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700">
              <Clock className="h-4 w-4 text-blue-600 bg-transparent" style={{ background: 'none' }} /> Updated Daily
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700">
              <Users className="h-4 w-4 text-green-600 bg-transparent" style={{ background: 'none' }} /> 10M+ Searches
            </div>
          </div>

          {/* Search Box */}
<form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-1 items-center">
  
  {/* Location Dropdown */}
  <div className="relative w-full md:w-[30%]">
    <div className="absolute left-3 top-3.5 text-orange-600">
      <Globe className="h-5 w-5 bg-transparent" style={{ background: 'none' }} />
    </div>
    <input
      type="text"
      value={userState}
      readOnly
      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-orange-400 text-orange-700 font-medium shadow-sm cursor-default"
    />
  </div>

  {/* Business Search Input */}
  <div className="relative w-full flex flex-col md:w-[45%]">
    <Building2 className="absolute left-3 top-3.5 h-6 w-6 mb-4 text-orange-600 bg-transparent" style={{ background: 'none' }} />
    <input
      type="text"
      placeholder={`Search ${placeholderText}`}
      value={business}
      onChange={(e) => setBusiness(e.target.value)}
      className="w-full pl-10 pr-12 py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-sm shadow-sm"
    />
    {/* Mic icon for voice typing */}
    <button
      type="button"
      onClick={handleMicClick}
      className={`absolute right-3 top-2.5 h-6 w-6 flex items-center justify-center rounded-full transition-colors ${isListening ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'} focus:outline-none`}
      aria-label="Voice Search"
      tabIndex={0}
    >
      <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''} bg-transparent`} style={{ background: 'none' }} />
    </button>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all w-full md:w-auto shadow-md hover:shadow-lg"
  >
    <Search className="inline-block w-4 h-4 mr-2 bg-transparent" style={{ background: 'none' }} />
    Search
  </button>
</form>

          {/* Stats */}
          <div className="mt-6">
  <div className="bg-white border border-gray-200 rounded-xl px-4 sm:px-6 py-5 shadow-md flex flex-col sm:flex-row justify-between items-center gap-2">
    {[
      { value: 50000, suffix: '+', label: 'Verified Toll-Free Numbers' },
      { value: 99.9, suffix: '%', label: 'Accuracy Rate' },
      { value: 24, suffix: '/7', label: 'Support' },
      { value: 2022, suffix: '', label: 'Since', noComma: true }
    ].map((stat, index) => (
      <div key={index} className="text-center sm:text-left">
        <div className="text-[20px] sm:text-[27px] font-bold text-gray-900 leading-tight">
          <CountUp
            end={stat.value}
            suffix={stat.suffix}
            duration={1.8}
            separator={stat.noComma ? '' : ','}
            enableScrollSpy
            scrollSpyOnce
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
      </div>
    ))}
  </div>
          </div>

          {/* Features */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-2">
            <div className="flex items-center gap-2">✓ No Registration Required</div>
            <div className="flex items-center gap-2">✓ Completely Free</div>
            {/* <div className="flex items-center gap-2">✓ No Spam Guarantee</div> */}
            <div className="flex items-center gap-2">🔒 Secure & Private</div>
          </div>
        </div>

        {/* Right Box - Circular Helpline Directory */}
        <div className="w-full md:w-[35%] bg-white rounded-xl shadow-xl p-4 md:p-6 border border-orange-100/70 overflow-hidden relative">
          <div className="absolute -bottom-6 w-20 h-20 rounded-full bg-[#000080] opacity-5"></div>

          <div className="h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🆘 India Helpline Directory</h2>

            {/* Category Selector */}
            <div className="mb-4">
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
            <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${currentCategory.color} text-white text-center`}>
              <h3 className="font-semibold text-sm">{currentCategory.title}</h3>
              <p className="text-xs opacity-90">{currentCategory.services.length} services available</p>
            </div>

            {/* Circular Services Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {displayedServices.map((service, index) => {
                  const Icon = service.icon;
                return (
                  <div
                    key={index}
                      onClick={() => handleCall(service.title, service.number)}
                      className="cursor-pointer hover:bg-orange-50 transition-all duration-200 hover:scale-[1.02] p-2 rounded-lg text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 group"
                    >
                      {/* Circular Icon */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${currentCategory.color} rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <Icon className="h-6 w-6 text-white" style={{ background: 'none' }} />
                      </div>
                      
                      {/* Service Name */}
                      <div className="font-semibold text-gray-800 text-xs leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                        {service.title}
                      </div>
                      
                      {/* Phone Number */}
                      <div className="text-blue-600 font-mono text-xs mb-1">
                        {service.number}
                      </div>
                      
                      {/* 24x7 Badge */}
                      <div className="flex justify-center">
                        {service.available24x7 ? (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">24x7</span>
                        ) : (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Limited</span>
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
 
            {/* Emergency Notice */}
            {/* <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <p className="text-xs text-red-700 text-center">
                  <strong>Emergency:</strong> Dial 112 for immediate assistance
                </p>
              </div>
            </div> */}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Grid3X3, 
  Plus, 
  Video, 
  User,
  // Icons for the expanded buttons (you can change these later)
  Settings,
  HelpCircle,
  Star
} from 'lucide-react';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navigation when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePlusClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleButtonClick = (action) => {
    // Handle navigation actions here
    console.log(`Navigating to: ${action}`);
    
    // Close expanded menu if it's open
    if (isExpanded) {
      setIsExpanded(false);
    }

    // Navigation logic
    switch (action) {
      case 'home':
        navigate('/');
        break;
      case 'category':
        navigate('/category');
        break;
      case 'video':
        // Navigate to video guide page or show video modal
        console.log('Video guide clicked');
        break;
      case 'profile':
        // Navigate to profile page or show profile modal
        console.log('Profile clicked');
        break;
      case 'expanded1':
        // Handle expanded button 1
        console.log('Expanded button 1 clicked');
        break;
      case 'expanded2':
        // Handle expanded button 2
        console.log('Expanded button 2 clicked');
        break;
      case 'expanded3':
        // Handle expanded button 3
        console.log('Expanded button 3 clicked');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Mobile Navigation Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div 
          className={`transform transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Main Navigation Bar */}
          <div className="bg-white border-t border-gray-200 shadow-lg px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Home Button */}
              <button
                onClick={() => handleButtonClick('home')}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-orange-50 active:scale-95 ${
                  location.pathname === '/' ? 'bg-orange-50' : ''
                }`}
              >
                <Home className={`w-6 h-6 ${location.pathname === '/' ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium mt-1 ${location.pathname === '/' ? 'text-orange-600' : 'text-gray-600'}`}>Home</span>
              </button>

              {/* Category Button */}
              <button
                onClick={() => handleButtonClick('category')}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-orange-50 active:scale-95 ${
                  location.pathname.startsWith('/category') ? 'bg-orange-50' : ''
                }`}
              >
                <Grid3X3 className={`w-6 h-6 ${location.pathname.startsWith('/category') ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium mt-1 ${location.pathname.startsWith('/category') ? 'text-orange-600' : 'text-gray-600'}`}>Category</span>
              </button>

              {/* Plus Button (Bigger) */}
              <div className="relative">
                <button
                  onClick={handlePlusClick}
                  className={`flex flex-col items-center justify-center w-13 h-13 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isExpanded 
                      ? 'bg-orange-500 shadow-lg shadow-orange-200' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-200'
                  }`}
                >
                  <Plus className={`w-8 h-8 transition-transform duration-300 ${
                    isExpanded ? 'rotate-45 text-white' : 'text-white'
                  }`} />
                   </button>

                {/* Expanded Menu */}
                {isExpanded && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 min-w-[200px]">
                      <div className="flex flex-col space-y-3">
                        {/* Expanded Button 1 */}
                        <button
                          onClick={() => handleButtonClick('expanded1')}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Settings</span>
                        </button>

                        {/* Expanded Button 2 */}
                        <button
                          onClick={() => handleButtonClick('expanded2')}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Help</span>
                        </button>

                        {/* Expanded Button 3 */}
                        <button
                          onClick={() => handleButtonClick('expanded3')}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 active:scale-95"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Favorites</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Guide Button */}
              <button
                onClick={() => handleButtonClick('video')}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-orange-50 active:scale-95"
              >
                <Video className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-medium text-gray-600 mt-1">Video</span>
              </button>

              {/* Profile Button */}
              <button
                onClick={() => handleButtonClick('profile')}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-orange-50 active:scale-95"
              >
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-medium text-gray-600 mt-1">Profile</span>
              </button>
            </div>
          </div>

          {/* Bottom Safe Area for iOS */}
        </div>
      </div>

      {/* Overlay to close expanded menu when clicking outside */}
      {isExpanded && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default MobileNavigation;

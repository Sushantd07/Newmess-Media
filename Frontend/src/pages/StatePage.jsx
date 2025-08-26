import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Clock, Shield } from 'lucide-react';

const StatePage = () => {
  const { stateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get state data from navigation state or use a default
  const stateData = location.state?.stateName || stateId || 'Unknown State';

  // Demo data - you can replace this with actual API calls later
  const demoStateData = {
    name: stateData,
    capital: 'Capital City',
    population: 'Population Data',
    emergencyNumbers: [
      { label: 'Police', number: '100', icon: Shield },
      { label: 'Fire', number: '101', icon: Shield },
      { label: 'Ambulance', number: '108', icon: Shield },
      { label: 'CM Helpline', number: '1800-XXX-XXXX', icon: Phone },
      { label: 'Electricity', number: '1912', icon: Phone },
      { label: 'Water Supply', number: '1916', icon: Phone },
    ],
    description: 'This is a demo page for the state. You can implement actual state-specific content, emergency numbers, and information here.',
    lastUpdated: 'Last updated: December 2024'
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{demoStateData.name}</h1>
              <p className="text-gray-600 text-sm">State Information & Emergency Numbers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Demo Page</h3>
              <p className="text-sm text-blue-700 mt-1">
                This is a demo page for {demoStateData.name}. You can implement actual state-specific content, 
                emergency numbers, and information here by connecting to your backend API.
              </p>
            </div>
          </div>
        </div>

        {/* State Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">State Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Capital</p>
                <p className="font-semibold text-gray-900">{demoStateData.capital}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Population</p>
                <p className="font-semibold text-gray-900">{demoStateData.population}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-900">{demoStateData.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoStateData.emergencyNumbers.map((item, index) => (
              <div key={index} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <item.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-lg font-bold text-orange-600 font-mono">{item.number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About {demoStateData.name}</h2>
          <p className="text-gray-700 leading-relaxed">{demoStateData.description}</p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Implementation Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Connect to your backend API to fetch real state data</li>
              <li>• Add state-specific emergency numbers and contact information</li>
              <li>• Include state government websites and official resources</li>
              <li>• Add state-specific helpline categories and numbers</li>
              <li>• Implement search and filter functionality</li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to States
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatePage;

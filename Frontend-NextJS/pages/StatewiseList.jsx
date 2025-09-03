import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { statesData } from '../components/StateWiseSection';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export default function StatewiseList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = statesData.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Statewise Directory</h1>
          <p className="text-gray-600 text-sm">Find emergency numbers by state</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-orange-600">{statesData.length}</div>
              <div className="text-xs text-gray-600">States & UTs</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-xs text-gray-600">Numbers</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* States List */}
        <div className="space-y-3">
          {filteredStates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600">No states found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredStates.map((s) => (
              <Link
                key={s.id}
                to={`/state/${s.id}`}
                className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-200 block group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={s.image} 
                      alt={s.name} 
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{s.info.length}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">{s.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {s.info.length} emergency numbers
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">24/7 Available</span>
                    </div>
                  </div>
                  <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-3">
            All emergency numbers are verified and updated regularly
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}



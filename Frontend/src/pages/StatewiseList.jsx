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
      <div className="max-w-sm md:max-w-6xl mx-auto px-3 md:px-6 pb-20">
        {/* Sticky Header + Search */}
        <div className="sticky top-0 z-10 pt-4 pb-3 bg-gradient-to-b from-orange-50/95 to-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Statewise Directory</h1>
              <p className="text-[11px] text-gray-600 -mt-0.5">Find emergency numbers by state</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-orange-100 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
              />
            </div>
          </div>
          {/* Mini stats inline */}
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="bg-white rounded-lg py-2 shadow-sm">
              <div className="text-base font-bold text-orange-600">{statesData.length}</div>
              <div className="text-[10px] text-gray-600">States & UTs</div>
            </div>
            <div className="bg-white rounded-lg py-2 shadow-sm">
              <div className="text-base font-bold text-green-600">500+</div>
              <div className="text-[10px] text-gray-600">Numbers</div>
            </div>
            <div className="bg-white rounded-lg py-2 shadow-sm">
              <div className="text-base font-bold text-blue-600">✓</div>
              <div className="text-[10px] text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block pt-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Statewise Directory</h1>
              <p className="text-sm text-gray-600 mt-1">Find emergency numbers by state</p>
            </div>
            <div className="w-full max-w-sm bg-white rounded-xl shadow border border-orange-100 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{statesData.length}</div>
              <div className="text-xs text-gray-600">States & UTs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-xs text-gray-600">Numbers</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* States Grid (compact) */}
        <div className="mt-3 md:mt-6">
          {filteredStates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600">No states found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredStates.map((s) => (
                <Link
                  key={s.id}
                  to={`/state/${s.id}`}
                  className="bg-white rounded-xl shadow-sm p-2 md:p-3 hover:shadow-md transition group"
                >
                  <div className="relative">
                    <img src={s.image} alt={s.name} className="w-full aspect-square object-cover rounded-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] md:text-[11px] font-bold">{s.info.length}</span>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <div className="text-[12px] md:text-sm font-semibold text-gray-900 truncate">{s.name}</div>
                    <div className="text-[10px] md:text-xs text-gray-600">{s.info.length} nums</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Slim footer note */}
        <div className="py-5 text-center text-[11px] md:text-xs text-gray-500">Verified and updated regularly</div>
      </div>
    </div>
  );
}



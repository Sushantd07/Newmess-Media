import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { statesData } from '../components/StateWiseSection';
import { ArrowLeft, Copy, Phone } from 'lucide-react';

export default function StateDetail() {
  const { stateId } = useParams();

  const state = useMemo(() => statesData.find(s => s.id === stateId), [stateId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="max-w-sm mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">State not found</h1>
            <p className="text-gray-600 mb-6">We couldn't find data for "{stateId}".</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            to="/statewise-numbers" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            All States
          </Link>
        </div>

        {/* State Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="relative">
            <img
              src={state.image}
              alt={state.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white mb-1">{state.name}</h1>
              <p className="text-orange-200 text-sm">Emergency Helpline Directory</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-orange-600">{state.info.length}</div>
              <div className="text-xs text-gray-600">Numbers</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* Helpline Numbers */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-orange-600" />
            Emergency Numbers
          </h2>
          <div className="space-y-3">
            {state.info.map((row, idx) => (
              <div 
                key={row.label + idx} 
                className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{row.label}</div>
                    <div className="text-xs text-gray-600 mt-1">Emergency Service</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-gray-900 text-lg">{row.value}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(row.value)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors"
                      title="Copy number"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            All numbers are verified and updated regularly
          </p>
          <Link 
            to="/statewise-numbers" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Browse all states
          </Link>
        </div>
      </div>
    </div>
  );
}



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
            <p className= "text-gray-600 mb-6">We couldn't find data for "{stateId}".</p>
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
      <div className="max-w-sm md:max-w-5xl mx-auto px-3 md:px-6 pb-14">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 pt-4 pb-2 bg-gradient-to-b from-orange-50/95 to-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-3">
            <Link to="/statewise-numbers" className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 leading-tight">{state.name}</div>
              <div className="text-[11px] text-gray-600 -mt-0.5">Emergency Helpline Directory</div>
            </div>
            <img src={state.image} alt={state.name} className="w-10 h-10 rounded-lg object-cover" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-orange-600">{state.info.length}</div>
              <div className="text-[11px] text-gray-600">Numbers</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">24/7</div>
              <div className="text-[11px] text-gray-600">Available</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">✓</div>
              <div className="text-[11px] text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* Helpline Numbers (Compact Table) */}
        <div className="mt-3 md:mt-6 bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
          <div className="px-4 md:px-6 pt-4 pb-3 border-b border-orange-100 bg-white">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              Emergency Numbers
            </h2>
          </div>
          {/* Mobile list and Desktop 2-column table */}
          <div className="block md:hidden divide-y divide-orange-100">
            {state.info.map((row, idx) => (
              <div key={row.label + idx} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-gray-900 truncate">{row.label}</div>
                  <div className="text-[11px] text-gray-500">Emergency Service</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-gray-900 text-sm">{row.value}</div>
                  <div className="flex justify-end gap-2 mt-1">
                    <a href={`tel:${row.value}`} className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full"><Phone className="w-3 h-3"/> Call</a>
                    <button onClick={() => copyToClipboard(row.value)} className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full" title="Copy number"><Copy className="w-3 h-3"/> Copy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block p-4 md:p-6">
            <table className="w-full text-sm border border-orange-100 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-orange-50 text-orange-800">
                  <th className="py-2 px-3 text-left">Service</th>
                  <th className="py-2 px-3 text-left">Number</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.info.map((row, idx) => (
                  <tr key={row.label + idx} className="even:bg-orange-50/40">
                    <td className="py-2 px-3 font-medium text-gray-800">{row.label}</td>
                    <td className="py-2 px-3 font-mono text-gray-900">{row.value}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <a href={`tel:${row.value}`} className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full"><Phone className="w-3 h-3"/> Call</a>
                        <button onClick={() => copyToClipboard(row.value)} className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full" title="Copy number"><Copy className="w-3 h-3"/> Copy</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
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



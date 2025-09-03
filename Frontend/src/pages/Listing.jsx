import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, UploadCloud, ChevronRight } from 'lucide-react';

const Listing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">List Your Company</div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Get discovered by millions of users</h1>
          <p className="mt-2 text-gray-600 text-sm">Add your business details, support numbers, and reach customers faster.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition" onClick={() => navigate('/home/listing/start')}>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-orange-600" />
              <div>
                <div className="font-semibold text-gray-900">Create Business Listing</div>
                <div className="text-sm text-gray-600">Add name, category, logo, address</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition" onClick={() => navigate('/home/listing/phone')}>
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900">Add Contact Numbers</div>
                <div className="text-sm text-gray-600">Toll-free, support, WhatsApp</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition" onClick={() => navigate('/home/listing/bulk')}>
            <div className="flex items-center gap-3">
              <UploadCloud className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">Bulk Upload</div>
                <div className="text-sm text-gray-600">Upload CSV to add multiple listings</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listing;



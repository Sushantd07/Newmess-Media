import React from 'react';
import CommentSection from './CommentSection';

const CommentSectionExample = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        HDFC Bank - Customer Support
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About HDFC Bank
            </h2>
            <p className="text-gray-700 leading-relaxed">
              HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai, Maharashtra. 
              It is India's largest private sector bank by assets and world's 10th largest bank by market capitalization as of April 2021.
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Customer Care</h3>
                <p className="text-blue-700">1800-258-6161</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Email Support</h3>
                <p className="text-green-700">support@hdfcbank.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Branches</span>
                <span className="font-semibold">5,500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ATMs</span>
                <span className="font-semibold">15,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customers</span>
                <span className="font-semibold">50M+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment Section */}
      <div className="mt-8">
        <CommentSection 
          pageId="hdfc-bank-customer-support" 
          pageType="company" 
        />
      </div>
    </div>
  );
};

export default CommentSectionExample; 
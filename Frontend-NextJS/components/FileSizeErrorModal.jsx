import React, { useEffect } from 'react';
import { AlertTriangle, X, FileImage, Zap } from 'lucide-react';

const FileSizeErrorModal = ({ isOpen, onClose, fileName, fileSize, maxSize = 5 }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">File Too Large</h3>
              <p className="text-sm text-gray-500">Size limit exceeded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {fileName}
            </h4>
            <p className="text-gray-600 mb-4">
              This file exceeds the maximum allowed size
            </p>
          </div>

          {/* File Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">File Size:</span>
              <span className="text-sm text-red-600 font-semibold">
                {formatFileSize(fileSize)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Maximum Allowed:</span>
              <span className="text-sm text-green-600 font-semibold">
                {maxSize} MB
              </span>
            </div>
          </div>

          {/* Progress Bar Animation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Size Usage</span>
              <span className="text-xs text-red-500 font-medium">
                {Math.round((fileSize / (maxSize * 1024 * 1024)) * 100)}% over limit
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium text-blue-900 mb-1">Quick Tips:</h5>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Compress your image before uploading</li>
                  <li>• Use online tools like TinyPNG or Compressor.io</li>
                  <li>• Try reducing image dimensions</li>
                  <li>• Convert to JPEG format for smaller file sizes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Got It
            </button>
            <button
              onClick={() => {
                window.open('https://tinypng.com', '_blank');
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Compress Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSizeErrorModal; 
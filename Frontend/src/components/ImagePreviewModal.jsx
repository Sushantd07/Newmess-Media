import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const ImagePreviewModal = ({ 
  isOpen, 
  onClose, 
  images = [], 
  currentIndex = 0,
  onIndexChange 
}) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) {
          onIndexChange(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) {
          onIndexChange(currentIndex + 1);
        }
        break;
    }
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-scale-in border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors border border-gray-200 shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Image Container */}
        <div className="p-6">
          <div className="relative">
            <img 
              src={currentImage.url || currentImage} 
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg border border-gray-200 shadow-sm"
            />
          </div>

          {/* Navigation for multiple images */}
          {images.length > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => onIndexChange(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {currentIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => onIndexChange(currentIndex + 1)}
                disabled={currentIndex === images.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal; 
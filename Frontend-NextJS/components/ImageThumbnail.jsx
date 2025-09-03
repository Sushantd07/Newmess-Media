import React, { useState } from 'react';
import { X } from 'lucide-react';

const ImageThumbnail = ({ src, alt, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`inline-block cursor-pointer ${className}`}
        onClick={openModal}
      >
        <img 
          src={src} 
          alt={alt}
          className="max-h-[64px] rounded-lg object-cover hover:opacity-90 transition-opacity"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Image Container */}
            <div 
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={src} 
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageThumbnail; 
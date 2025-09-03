import React, { useState } from 'react';
import { Upload, X, Image, FileText } from 'lucide-react';

const LogoUpload = ({ 
  currentLogo, 
  onLogoUpload, 
  onLogoDelete, 
  companySlug,
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid file (SVG, PNG, JPG, JPEG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // If no company slug (new company), create a temporary file URL for preview
      if (!companySlug) {
        const fileUrl = URL.createObjectURL(file);
        onLogoUpload(fileUrl, file);
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(`/api/company-pages/${companySlug}/upload-logo`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onLogoUpload(result.data.logo.url, null);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!companySlug) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/company-pages/${companySlug}/delete-logo`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onLogoDelete();
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Logo delete error:', error);
      setError('Delete failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const isSvg = currentLogo && currentLogo.includes('.svg');

  return (
    <div className="space-y-4">
      {/* Current Logo Display */}
      {currentLogo && currentLogo !== '/company-logos/Bank/placeholder.svg' && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Current Logo</h4>
            <button
              onClick={handleDeleteLogo}
              disabled={uploading || disabled}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Delete logo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              {isSvg ? (
                <FileText className="h-8 w-8 text-blue-600" />
              ) : (
                <img 
                  src={currentLogo} 
                  alt="Company logo" 
                  className="w-12 h-12 object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {isSvg ? 'SVG Logo' : 'Image Logo'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentLogo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          disabled={uploading || disabled}
          className="hidden"
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {uploading ? 'Uploading...' : 'Upload Company Logo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                SVG, PNG, JPG, JPEG (max 5MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• SVG files will be uploaded as-is (no compression)</p>
        <p>• PNG/JPG files will be automatically compressed and optimized</p>
        <p>• Logos are stored securely on Cloudinary</p>
      </div>
    </div>
  );
};

export default LogoUpload;

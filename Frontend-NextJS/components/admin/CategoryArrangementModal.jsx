import React, { useState, useEffect } from 'react';
import { Settings, Save, Building2, ChevronUp, ChevronDown } from 'lucide-react';
import CategoryService from '../../services/categoryService.js';

const CategoryArrangementModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  onCategoriesChange 
}) => {
  const [categoryOrder, setCategoryOrder] = useState({});
  const [arrangementLoading, setArrangementLoading] = useState(false);
  const [message, setMessage] = useState(null);
  // Front page limit (how many categories to show on home page)
  const [frontPageLimit, setFrontPageLimit] = useState(() => {
    const stored = Number(localStorage.getItem('frontPageCategoryLimit'));
    return Number.isFinite(stored) && stored > 0 ? stored : 8;
  });

  // Initialize category order when modal opens
  useEffect(() => {
    if (isOpen && categories) {
      initializeCategoryOrder();
    }
  }, [isOpen, categories]);

  const initializeCategoryOrder = () => {
    const order = {};
    categories.forEach((category, index) => {
      order[category._id] = category._id;
    });
    setCategoryOrder(order);
  };

  const handleCategoryOrderChange = (categoryId, newIndex) => {
    setCategoryOrder(prev => {
      const currentOrder = Object.values(prev);
      const currentIndex = currentOrder.indexOf(categoryId);
      
      if (currentIndex === -1) return prev;
      
      const newOrder = [...currentOrder];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, categoryId);
      
      const newOrderObj = {};
      newOrder.forEach((id, index) => {
        newOrderObj[id] = id;
      });
      
      return newOrderObj;
    });
  };

  const handleSaveCategoryArrangement = async () => {
    if (!categories) return;

    setArrangementLoading(true);
    try {
      // Get the ordered category IDs
      const orderedCategoryIds = Object.values(categoryOrder);
      
      // Update the order of categories
      const updatePromises = orderedCategoryIds.map((categoryId, index) => {
        const category = categories.find(c => c._id === categoryId);
        if (!category) return Promise.resolve();
        
        return CategoryService.updateCategory(categoryId, {
          order: index + 1
        });
      });

      await Promise.all(updatePromises);

      // Persist front page limit locally (no separate settings model yet)
      localStorage.setItem('frontPageCategoryLimit', String(frontPageLimit));

      setMessage({ 
        type: 'success', 
        text: 'Category order and front page limit saved!' 
      });
      
      // Refresh categories to get updated data
      if (onCategoriesChange) {
        onCategoriesChange();
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating category order:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error updating category order. Please try again.' 
      });
    } finally {
      setArrangementLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Arrange Category Order</h3>
            <p className="text-gray-600">Reorder categories to control their display sequence</p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Category Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Categories</h4>
                <p className="text-sm text-blue-700">
                  {categories?.length || 0} categories to reorder
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {categories?.length || 0}
                </div>
                <div className="text-xs text-blue-600">Total Categories</div>
              </div>
            </div>
            {/* Front page limit control */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Front page category limit
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={frontPageLimit}
                  onChange={(e) => setFrontPageLimit(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
                  className="w-28 px-3 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-blue-700">Controls how many categories show on the homepage</span>
              </div>
            </div>
          </div>

          {/* Category Ordering */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drag and drop to reorder categories
              </label>
              <p className="text-xs text-gray-500 mb-4">
                The order you set here will be reflected on the frontend category grid
              </p>
            </div>

            {/* Category List for Reordering */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Category Order</h5>
              <div className="space-y-2">
                {(() => {
                  const orderedIds = Object.values(categoryOrder);
                  
                  return orderedIds.map((categoryId, index) => {
                    const category = categories?.find(c => c._id === categoryId);
                    if (!category) return null;
                    
                    return (
                      <div
                        key={category._id}
                        className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-move hover:bg-gray-50 transition-colors"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', category._id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const draggedId = e.dataTransfer.getData('text/plain');
                          if (draggedId !== category._id) {
                            handleCategoryOrderChange(draggedId, index);
                          }
                        }}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.subcategoryCount || 0} companies
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const currentOrder = Object.values(categoryOrder);
                              const currentIndex = currentOrder.indexOf(category._id);
                              if (currentIndex > 0) {
                                handleCategoryOrderChange(category._id, currentIndex - 1);
                              }
                            }}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const currentOrder = Object.values(categoryOrder);
                              const currentIndex = currentOrder.indexOf(category._id);
                              if (currentIndex < currentOrder.length - 1) {
                                handleCategoryOrderChange(category._id, currentIndex + 1);
                              }
                            }}
                            disabled={index === Object.values(categoryOrder).length - 1}
                            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Frontend Preview</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(() => {
                  const orderedIds = Object.values(categoryOrder);
                  
                  return orderedIds.slice(0, frontPageLimit).map((categoryId, index) => {
                    const category = categories?.find(c => c._id === categoryId);
                    if (!category) return null;
                    
                    return (
                      <div key={category._id} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Position {index + 1}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              {categories && Object.values(categoryOrder).length > frontPageLimit && (
                <div className="text-center mt-3">
                  <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    +{Object.values(categoryOrder).length - frontPageLimit} more categories
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frontend Impact Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 text-sm font-bold">ℹ</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Frontend Impact</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• This order affects the <strong>CategoryGrid</strong> component on the frontend</li>
                  <li>• Categories will appear in the exact order you set here</li>
                  <li>• The order is saved to the database and persists across sessions</li>
                  <li>• Changes take effect immediately on the frontend</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCategoryArrangement}
            disabled={arrangementLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {arrangementLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Order...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Category Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryArrangementModal;


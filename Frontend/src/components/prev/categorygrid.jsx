// ✅ UPDATED React Component with proper backend integration
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  Building2,
  Clock,
  Eye,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

const CategorySection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [categories, setCategories] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/categories/with-subcategories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleCompanyClick = (categoryId, subcategoryId, companySlug) => {
    navigate(`/category/${categoryId}/${subcategoryId}/${companySlug}`);
  };

  const handleViewAllCategories = () => {
    navigate("/category");
  };

  const handleCopyNumber = (e, number, key) => {
    e.stopPropagation();
    navigator.clipboard.writeText(number).then(() => {
      setCopiedNumber(key);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  };

  const allSubcategories = useMemo(() => {
    return categories.flatMap((category) =>
      (category.subcategories || []).map((sub) => ({
        ...sub,
        parentCategoryId: category._id || category.id,
        parentCategorySlug: category.slug,
        parentCategoryName: category.name,
        subcategorySlug: sub.slug,
        uniqueKey: `${category._id || category.id}-${sub.slug}`,
      }))
    );
  }, [categories]);

  const displayedSubcategories = useMemo(() => {
    let filtered = [];
    const lowerSearch = searchTerm.toLowerCase();

    if (activeCategory === "all") {
      filtered = allSubcategories;
    } else {
      const selected = categories.find(
        (cat) => cat._id === activeCategory || cat.id === activeCategory
      );
      if (selected) {
        filtered = (selected.subcategories || []).map((sub) => ({
          ...sub,
          parentCategoryId: selected._id || selected.id,
          parentCategorySlug: selected.slug,
          parentCategoryName: selected.name,
          subcategorySlug: sub.slug,
          uniqueKey: `${selected._id || selected.id}-${sub.slug}`,
        }));
      }
    }

    if (lowerSearch) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(lowerSearch) ||
          sub.fullForm?.toLowerCase().includes(lowerSearch) ||
          sub.parentCategoryName?.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [activeCategory, searchTerm, categories, allSubcategories]);

  const getExploreButtonText = () => {
    if (activeCategory === "all") return "Explore All Categories";
    const selected = categories.find(
      (cat) => cat._id === activeCategory || cat.id === activeCategory
    );
    return `View All ${selected?.name || ""}`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="h-4 w-4" /> Business Categories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find <span className="text-orange-600">Verified Numbers</span> by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Browse through our comprehensive directory of verified toll-free numbers organized by industry categories.
          </p>
          <button
            onClick={handleViewAllCategories}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Building2 className="h-5 w-5" />
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Buttons & Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-gray-200 pb-4 gap-3">
            <div className="flex flex-wrap gap-2 flex-grow sm:flex-grow-0">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                }}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-orange-700"
                }`}
              >
                All Businesses
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setActiveCategory(category._id);
                    setSearchTerm("");
                  }}
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeCategory === category._id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-orange-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm flex-grow min-w-[200px] sm:min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${
                  activeCategory === "all"
                    ? "all businesses..."
                    : `${
                        categories.find((cat) => cat._id === activeCategory)?.name || ""
                      } businesses...`
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Subcategory Cards */}
          {displayedSubcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSubcategories.map((subcategory) => {
                const isHdfc = subcategory.name?.toLowerCase().includes("hdfc");
                return (
                  <div
                    key={subcategory.uniqueKey}
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex flex-col border border-gray-100"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={subcategory.logo}
                          alt={`${subcategory.name} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (!e.target.src.includes("placeholder-logo.png")) {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-logo.png";
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-0.5">
                          {subcategory.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-snug line-clamp-2">
                          {subcategory.fullForm}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center text-gray-800 font-bold text-base flex-grow">
                        <Phone className="h-4 w-4 text-orange-600 flex-shrink-0 mr-1" />
                        <span className="flex-grow min-w-0 truncate">{subcategory.number}</span>
                        <button
                          onClick={(e) => handleCopyNumber(e, subcategory.number, subcategory.uniqueKey)}
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-200 flex-shrink-0"
                        >
                          {copiedNumber === subcategory.uniqueKey ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${subcategory.number}`);
                        }}
                        className="bg-orange-600 text-white text-sm px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-1 flex-shrink-0 whitespace-nowrap"
                      >
                        <Phone className="h-4 w-4" /> Call Now
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 text-sm text-gray-600 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {subcategory.available24x7 ? (
                          <span className="text-green-600 font-medium">24/7 Available</span>
                        ) : (
                          <span className="text-orange-600 font-medium">Limited Hours</span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 italic">
                        Verified: {subcategory.verifiedDate}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleCompanyClick(
                          isHdfc ? "banking" : subcategory.parentCategorySlug,
                          isHdfc ? "private-banks" : subcategory.subcategorySlug,
                          isHdfc ? "hdfc-bank" : subcategory.slug
                        )
                      }
                      className="mt-4 w-full bg-orange-50 text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      View More Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                We couldn't find any listings matching "
                <span className="font-semibold text-orange-600">{searchTerm}</span>".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center gap-2 text-orange-600 bg-orange-100 hover:bg-orange-200 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Clear Search
                <Eye className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex justify-center sm:justify-end pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={handleViewAllCategories}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
            >
              <Building2 className="h-4 w-4" />
              {getExploreButtonText()}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

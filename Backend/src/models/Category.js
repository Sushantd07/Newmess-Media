import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: String,
    iconName: {
      type: String,
      default: null,
    },
    // ✅ Add this for denormalized subcategory count
    subcategoryCount: {
      type: Number,
      default: 0,
    },
    // Additional fields for better categorization
    icon: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Add index for active filtering
    },
    featured: {
      type: Boolean,
      default: false,
      index: true, // Add index for featured filtering
    },
    order: {
      type: Number,
      default: 0,
      index: true, // Add index for sorting
    },
    // Frontend display control
    displayLimit: {
      type: Number,
      default: 6,
      min: 1,
      max: 50,
    },
    // SEO fields
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    color: String,
    // Display badges like: Banking · Government · Public Sector
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Add compound indexes for better query performance
CategorySchema.index({ isActive: 1, order: 1 }); // For main grid query
CategorySchema.index({ isActive: 1, featured: 1, order: 1 }); // For featured categories
CategorySchema.index({ slug: 1, isActive: 1 }); // For slug-based queries

const Category = mongoose.model('Category', CategorySchema);
export default Category;

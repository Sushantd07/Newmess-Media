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
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    // SEO fields
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    color: String,
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);
export default Category;

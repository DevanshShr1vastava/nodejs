import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: Array,
      required: true,
    },
    authorImage: {
      type: String,
    },
    authorDesc: {
      type: String,
    },
    category: {
      type: Array,
      required: true,
    },
    seoTitle: {
      type: String,
      unique: true,
    },
    seoDescription: {
      type: String,
    },
    seoKeywords: {
      type: Array,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("blogPost", blogSchema);

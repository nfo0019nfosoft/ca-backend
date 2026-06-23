const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(

  {

    title: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      default: "Taxation"
    },

    shortDescription: {
      type: String
    },

    content: {
      type: String
    },

    coverImage: {
      type: String
    },

    author: {
      type: String,
      default: "CA Connect Team"
    },

    authorImage: {
      type: String
    },

    authorDesignation: {
      type: String
    },

    publishDate: {
      type: String
    },

    readTime: {
      type: String,
      default: "5 min read"
    },

    tags: [
      {
        type: String
      }
    ],

    featured: {
      type: Boolean,
      default: false
    }

  },

  {
    timestamps: true
  }

);

module.exports = mongoose.model(
  "Blog",
  blogSchema
);
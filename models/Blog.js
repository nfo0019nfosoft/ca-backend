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
      default: "Bussult Team"
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

    metaDescription: {
      type: String
    },

    focusKeyword: {
      type: String
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft"
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public"
    },

    allowComments: {
      type: Boolean,
      default: true
    },

    featured: {
      type: Boolean,
      default: false
    },

    views: {
      type: Number,
      default: 0
    },

    likes: {
      type: Number,
      default: 0
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
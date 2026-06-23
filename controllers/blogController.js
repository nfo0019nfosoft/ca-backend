const Blog = require("../models/Blog");


// =========================
// CREATE BLOG
// =========================
exports.createBlog = async (req, res) => {

  try {

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      blog
    });

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


// =========================
// GET ALL BLOGS
// =========================
exports.getBlogs = async (req, res) => {

  try {

    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};



// =========================
// GET SINGLE BLOG BY ID
// =========================
exports.getBlogById = async (req, res) => {

  try {

    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {

      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });

    }

    res.status(200).json(blog);

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


// =========================
// UPDATE BLOG
// =========================
exports.updateBlog = async (req, res) => {

  try {

    const blog = await Blog.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true
      }

    );

    res.status(200).json({
      success: true,
      blog
    });

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


// =========================
// DELETE BLOG
// =========================
exports.deleteBlog = async (req, res) => {

  try {

    await Blog.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};




// =========================
// GET SINGLE BLOG BY SLUG
// =========================
exports.getBlogBySlug = async (req, res) => {

  try {

    const blog = await Blog.findOne({
      slug: req.params.slug
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    let relatedBlogs = [];

    // Tags unte tags base chesi fetch cheyyi
    if (blog.tags && blog.tags.length > 0) {

      relatedBlogs = await Blog.find({

        tags: {
          $in: blog.tags
        },

        _id: {
          $ne: blog._id
        }

      })
        .limit(4)
        .sort({ createdAt: -1 });

    }

    // Tags match avvakapothe same category blogs chupinchu
    if (relatedBlogs.length === 0) {

      relatedBlogs = await Blog.find({

        category: blog.category,

        _id: {
          $ne: blog._id
        }

      })
        .limit(4)
        .sort({ createdAt: -1 });

    }

    res.status(200).json({
      success: true,
      blog,
      relatedBlogs
    });

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};
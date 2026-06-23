const express = require("express");

const router = express.Router();

const {

  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog

} = require("../controllers/blogController");

router.post("/", createBlog);

router.get("/", getBlogs);

router.get("/single/:id", getBlogById);

router.get("/:slug", getBlogBySlug);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

module.exports = router;
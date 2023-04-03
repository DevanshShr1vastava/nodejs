import express from "express";
import {
  createPost,
  getAll,
  getById,
  updateBlog,
  deleteBlog,
  featuredPost,
} from "../controllers/blogPost.js";
import { verifyToken, restrictTo } from "../middleware/auth.js";

const Router = express.Router();

/* READ */
Router.route("/blogs").get(getAll).post(createPost);
Router.route("/blogs/featured").get(featuredPost, getAll);
Router.route("/blogs/:id")
  .get(getById)
  .patch(verifyToken, restrictTo("admin"), updateBlog)
  .delete(verifyToken, restrictTo("admin"), deleteBlog);

/* UPDATE */

export default Router;

import express from "express";
import {
  createCategory,
  getAll,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

import { verifyToken, restrictTo } from "../middleware/auth.js";

const Router = express.Router();

Router.route("/").get(getAll).post(createCategory);

Router.route("/:id")
  .patch(verifyToken, restrictTo("admin"), updateCategory)
  .delete(verifyToken, restrictTo("admin"), deleteCategory);

export default Router;

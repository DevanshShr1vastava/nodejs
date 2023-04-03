import express from "express";
import {
  getAll,
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "../controllers/author.js";

import { verifyToken, restrictTo } from "../middleware/auth.js";

const Router = express.Router();

Router.route("/").get(getAll).post(createAuthor);

Router.route("/:id")
  .patch(verifyToken, restrictTo("admin"), updateAuthor)
  .delete(verifyToken, restrictTo("admin"), deleteAuthor);

export default Router;

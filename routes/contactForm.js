import express from "express";
import {
  getForms,
  getFormById,
  getRecentForms,
  newForm,
  deleteForm,
} from "../controllers/contactForm.js";
import { restrictTo, verifyToken } from "../middleware/auth.js";

const Router = express.Router();

Router.route("/").get(getForms).post(newForm);
Router.route("/recent").get(getRecentForms);
Router.route("/:id")
  .get(getFormById)
  .delete(verifyToken, restrictTo("admin"), deleteForm);

export default Router;

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import contactForm from "./routes/contactForm.js";
import blogRoutes from "./routes/blog.js";
import categoryRoutes from "./routes/category.js";
import authorRoutes from "./routes/author.js";

import { verifyToken } from "./middleware/auth.js";
import errorControl from "./controllers/errorController.js";
import { createPost } from "./controllers/blogPost.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(errorControl);
console.clear();
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("please upload an Image file !!"));
    }
    cb(null, true);
  },
});

// image upload single
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error });
  }
);

/* ROUTES*/

app.use("/auth", authRoutes);
app.use("/", blogRoutes);
app.use("/contact-form", contactForm);
app.use("/category", categoryRoutes);
app.use("/author", authorRoutes);
const PORT = process.env.PORT || 5001;

/* MONGOOSE SETUP */
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

import mongoose from "mongoose";

const contactForm = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    interest: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("contactForm", contactForm);

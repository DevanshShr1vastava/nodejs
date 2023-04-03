import mongoose from "mongoose";

const blogAuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pfp: {
    type: String,
  },
});

export default mongoose.model("BlogAuthor", blogAuthorSchema);

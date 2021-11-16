import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  comments: {
    type: Object,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
});

const BlogModel = mongoose.model("blogs", BlogSchema);

export default BlogModel;

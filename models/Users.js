import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  blogs: {
    type: Array,
    required: true,
  },
  following: {
    type: Array,
    required: true,
  },
  liked: {
    type: Array,
    required: true,
  },
  followers: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;

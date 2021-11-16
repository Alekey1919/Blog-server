import mongoose from "mongoose";

const NameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const NameModel = mongoose.model("names", NameSchema);

export default NameModel;

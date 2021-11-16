import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/Users.js";
import BlogModel from "./models/Blogs.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => res.send("Server started"));

// MONGO DB

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongolico connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.post("/getUsers", (req, res) => {
  UserModel.find(req.body, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/setUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

app.post("/getBlogs", (req, res) => {
  BlogModel.find(req.body, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/postComment", (req, res) => {
  BlogModel.findOneAndUpdate(
    { _id: req.body.blogId },
    { $push: { comments: req.body.comment } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/deleteComment", (req, res) => {
  BlogModel.findOneAndUpdate(
    { _id: req.body.blogId },
    {
      $pull: {
        comments: req.body.comment,
      },
    },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/like", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.body.userId },
    { $push: { liked: req.body.blogId } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );

  BlogModel.findOneAndUpdate(
    { _id: req.body.blogId },
    { $inc: { likes: 1 } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/dislike", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.body.userId },
    { $pull: { liked: req.body.blogId } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );

  BlogModel.findOneAndUpdate(
    { _id: req.body.blogId },
    { $inc: { likes: -1 } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/postBlog", async (req, res) => {
  const blog = req.body;
  const newBlog = new BlogModel(blog);
  await newBlog.save((err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

app.post("/editBlog", (req, res) => {
  BlogModel.updateOne(
    { _id: req.body.blogId },
    {
      $set: {
        title: req.body.title,
        body: req.body.body,
        img: req.body.img,
        date: req.body.date,
      },
    },
    (err, result) => {
      if (err) {
        console.log(err.message);
      }
      res.json(result);
    }
  );
});

app.post("/deleteBlog", (req, res) => {
  BlogModel.remove({ _id: req.body.blogId }, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    res.json(result);
  });
  UserModel.findOneAndUpdate(
    { _id: req.body.userId },
    { $pull: { blogs: req.body.blogId } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data");
      }
    }
  );
});

app.post("/follow", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.body.followerId },
    { $push: { following: req.body.followedNickname } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
  UserModel.findOneAndUpdate(
    { nickname: req.body.followedNickname },
    { $inc: { followers: 1 } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/unfollow", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.body.followerId },
    { $pull: { following: req.body.followedNickname } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
  UserModel.findOneAndUpdate(
    { nickname: req.body.followedNickname },
    { $inc: { followers: -1 } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
});

app.post("/setBlogToUser", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.body.userId },
    { $push: { blogs: req.body.blogId } },
    (err, result) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      res.json(result);
    }
  );
});

app.post("/searchTags", (req, res) => {
  BlogModel.find({ tags: { $in: req.body.tag } }, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      res.json(result);
    }
  });
});

app.post("/search", (req, res) => {
  BlogModel.find(
    { $text: { $search: req.body.input, $caseSensitive: false } },
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json(result);
      }
    }
  );
});

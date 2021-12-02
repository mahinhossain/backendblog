const router = require("express").Router();

const Post = require("../models/post");
// get
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;

  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find({});
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(`error`, error);
  }
});
router.get("/:id", async (req, res) => {
  const posts = await Post.findById(req.params.id);

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json("Not Found");
  }
});

// post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);

    const post = await newPost.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
// update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        const updatepost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(201).json(updatepost);
      } catch (error) {
        res.status(404).json(error);
      }
    } else {
      res.status(404).json("Error");
    }
  } catch {
    console.log(`error`);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        await post.delete();

        res.json("Delete Successfull");
      } catch (error) {
        res.status(404).json("Not Deleted");
      }
    } else {
      res.status(404).json("Error");
    }
  } catch {
    console.log(`error`);
  }
});

module.exports = router;

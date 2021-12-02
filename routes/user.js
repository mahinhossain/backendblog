const router = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json("No User Found");
  }
});
router.get("/:id", async (req, res) => {
  const users = await User.findById(req.params.id);
  if (users) {
    const { password, ...others } = users._doc;
    res.status(200).json(others);
  } else {
    res.status(404).json("No User Found");
  }
});

// updated

router.put("/:id", async (req, res) => {
  if (req.body.userid === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);

      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(201).json(updateUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("You cannot Updated");
  }
});
router.delete("/:id", async (req, res) => {
  if (req.body.userid === req.params.id) {
    // if (req.body.password) {
    //   const salt = await bcrypt.genSalt(10);

    //   req.body.password = await bcrypt.hash(req.body.password, salt);
    // }
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        try {
          await Post.deleteMany({ username: user.username });
          await User.findByIdAndDelete(req.params.id);
          res.status(201).json("Deleted");
        } catch (error) {
          res.send(error);
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("You cannot Deleted");
  }
});

module.exports = router;

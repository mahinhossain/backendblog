const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const gensa = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: gensa,
    });

    const user = await newUser.save();
    const { password, ...others } = user._doc;
    res.status(201).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);

    // const gensa = await bcrypt.hash(req.body.password, salt);
    const user = await User.findOne({
      username: req.body.username,
    });

    const { password, ...others } = user._doc;
    !user && res.status(400).json("No User Found");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong Password");
    res.status(201).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

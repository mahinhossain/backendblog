const router = require("express").Router();

const Category = require("../models/category");
// get
router.post("/", async (req, res) => {
  const newCat = await new Category(req.body);
  try {
    const newcat = await newCat.save();

    res.status(200).json(newcat);
  } catch (error) {
    console.log("error :>> ", error);
  }
});
router.get("/", async (req, res) => {
  const newCat = await Category.find({});
  if (newCat) {
    res.status(200).json(newCat);
  } else {
    res.status(404).json("Error");
  }
});

module.exports = router;

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
app.use(express.json());
const path = require("path");
// app.use(express.static("public"));
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/images", express.static(path.join(__dirname, "/images")));

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const categoryRouter = require("./routes/categories");
dotenv.config();

const server = async () => {
  await mongoose
    .connect(process.env.MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`connect to mongodb`))
    .catch((errServer) => console.log(`err`, errServer));
};

server();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(`req.file`, req.file);
  // if (req.file) {
  //   const image = req.file.filename;
  //   res.status(200).json(image);
  //   console.log("image recived");
  // } else {
  //   const image = "noimage.jpg";
  //   console.log("no image was recived");
  //   res.status(404).json(image);
  // }

  res.status(200).json("Image Upoaded succsessfully");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);

app.listen("5000", () => {
  console.log(`server Running`);
});

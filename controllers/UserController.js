const { Sequelize, Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
let db = require("../models");
let User = db.user;

const addUser = async (req, res) => {
  //   const jane = User.build({ firstName: "Jane", lastName: "Doe" });
  //const arrImages = [];
  console.log("cccc", req.file.filename);
  //arrImages = req.file.filename;

  const postData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image: req.file.filename,
  };

  console.log("postData ", postData);
  if (postData.length > 1) {
    var newUser = await User.bulkCreate(postData);
  } else {
    var newUser = await User.create(postData);
  }

  res.status(200).json({ data: newUser });
};

const getUsers = async (req, res) => {
  limit = parseInt(req.query.perpage);
  offset = (parseInt(req.query.page) - 1) * parseInt(req.query.perpage);
  console.log("query ", limit, offset);
  //  searching
  if (req.query.search) {
    var data = await User.findAll({
      where: { firstName: { [Op.like]: `%` + req.query.search + `%` } },
    });
  }
  // pagination
  else if (limit) {
    var data = await User.findAll({
      offset: offset,
      limit: limit,
    });
  }
  // sorting
  else if (req.query.sort) {
    var data = await User.findAll({
      order: [["firstName", req.query.sort]],
    });
  }
  // get all
  else {
    var data = await User.findAll();

    // let reqPath = path.join(__dirname, "../");
  }

  res.status(200).json({ data: data });
};

const getUser = async (req, res) => {
  console.log("params ", req.params.id);
  const data = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ data: data });
};

const updateUser = async (req, res) => {
  let updatedData = req.body;
  const data = await User.update(updatedData, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ data: data });
};

const deleteUser = async (req, res) => {
  const data = await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "User Deleted Successfully" });
};

const queryUser = async (req, res) => {
  const user = await User.create(
    {
      firstName: "ajay",
      lastName: "gupta",
    },
    { fields: ["firstName"] }
  );
  res.status(200).json({ data: user });
};

const WhereAttributes = async (req, res) => {
  const user = await User.findAll({
    attributes: ["firstName", "lastName"],
  });
  res.status(200).json({ data: user });
};

const asAlias = async (req, res) => {
  const user = await User.findAll({
    attributes: [["firstName", "first_name"], "lastName"],
  });
  res.status(200).json({ data: user });
};

const count = async (req, res) => {
  const user = await User.findAll({
    attributes: [
      ["firstName", "first_name"],
      "lastName",
      [Sequelize.fn("COUNT", Sequelize.col("firstName")), "count"],
    ],
  });
  res.status(200).json({ data: user });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  queryUser,
  WhereAttributes,
  asAlias,
  count,
  upload,
};

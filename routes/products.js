const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { handleSuccess } = require("../helpers/responseHandler");
const { Product } = require("../database");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const cors = require("cors");
const multer = require("multer");

router.use(cors());

//-------------- LIST -----------------//
router.get("/", async (req, res) => {
  let { search } = req.query;

  let criteria = {
    where: {
      deleted_at: null,
    },
  };

  if (search) {
    criteria = {
      where: {
        deleted_at: null,
        skills: { [Op.like]: "%" + search + "%" },
      },
    };
  }

  const result = await Product.findAll(criteria);
  res.status(200).send(result);
});

//-------------- READ -----------------//
router.get("/:id", async (req, res) => {
  const result = await Product.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  res.status(200).send(result);
});

//-------------- READ CATEGORY ID -----------------//
router.get("/read-by-category-id/:id", async (req, res) => {
  let criteria = {
    where: {
      deleted_at: null,
      category_id: req.params.id,
    },
  };
  const result = await Product.findAll(criteria);
  res.status(200).send(result);
});

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("destination file:", file);
    callback(null, "public/images/products");
  },
  filename: (req, file, callback) => {
    console.log("multerConfig file:", file);
    const fileExtension = file.mimetype.split("/")[1];
    callback(null, `image-${Date.now()}.${fileExtension}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    console.log("isImage file:", file);
    callback(null, true);
  } else {
    callback(new Error("Only image is allowed!"));
  }
};

const upload = multer({
  storage: multerConfig,
  fileFIlter: isImage,
});

const uploadImage = upload.single("img_url");

//-------------- CREATE -----------------//
router.post("/", uploadImage, async (req, res) => {
  let body = req.body;
  let file = req.file;

  let img_url;
  if (file) {
    img_url = file.path.replace("public", "");
  }
  body.img_url = img_url;

  const { error } = validateProduct(body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await Product.create({
      name: body.name,
      price: body.price,
      category_id: body.category_id,
      img_url: img_url,
    });

    handleSuccess(res, {
      statusCode: 201,
      result: { data: response },
    });
  } catch (err) {
    console.log("Created user error --> ", err);
  }
});

//-------------- UPDATE -----------------//
router.put("/:id", uploadImage, async (req, res) => {
  let body = req.body;
  let file = req.file;
  console.log("file --> ", file);
  const result = await Product.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }
  //console.log("result", result);
  console.log("result.img_url  --> ", result.img_url);
  body.img_url = !_.isUndefined(file)
    ? file.path.replace("public", "")
    : result.img_url || null;

  console.log("body.img_url  --> ", body.img_url);
  const response = await result.update(body);

  res.status(200).send(response);
});

//-------------- DELETE -----------------//
router.delete("/:id", async (req, res) => {
  const result = await Product.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update({
    deleted_at: new Date(),
  });

  res.status(200).send(response);
});

function validateProduct(Product) {
  console.log("Validate -->>", Product);

  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
    img_url: Joi.string(),
  });

  return schema.validate(Product);
}

module.exports = router;

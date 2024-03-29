const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { handleSuccess } = require("../helpers/responseHandler");
const { Order } = require("../database");
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
    order: [["createdAt", "DESC"]], // Add this line for descending order
  };

  if (search) {
    criteria = {
      where: {
        deleted_at: null,
        skills: { [Op.like]: "%" + search + "%" },
      },
      order: [["createdAt", "DESC"]], // Add this line for descending order
    };
  }

  const result = await Order.findAll(criteria);
  res.status(200).send(result);
});

//-------------- READ -----------------//
router.get("/:id", async (req, res) => {
  const result = await Order.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

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
router.post("/", async (req, res) => {
  let body = req.body;

  console.log("ORDERS CREATE req.body --> ", req.body);
  const { error } = validateOrder(body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await Order.create({
      total_amount: body.totalAmount,
      order_date: new Date(),
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

  const result = await Order.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update(body);

  res.status(200).send(response);
});

//-------------- DELETE -----------------//
router.delete("/:id", async (req, res) => {
  const result = await Order.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update({
    deleted_at: new Date(),
  });

  res.status(200).send(response);
});

function validateOrder(Order) {
  const schema = Joi.object({
    totalAmount: Joi.number().required(),
  });

  return schema.validate(Order);
}

module.exports = router;

const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { handleSuccess } = require("../helpers/responseHandler");
const { Product } = require("../database");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const cors = require("cors");
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

//-------------- CREATE -----------------//
router.post("/", async (req, res) => {
  let body = req.body;

  const { error } = validateProduct(body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await Product.create({
      name: body.name,
      price: body.price,
      category_id: body.category_id,
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
router.put("/:id", async (req, res) => {
  const result = await Product.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update(req.body);

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
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required(),
  });

  return schema.validate(Product);
}

module.exports = router;

const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Category } = require("../database");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

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

  const result = await Category.findAll(criteria);
  res.status(200).send(result);
});

//-------------- READ -----------------//
router.get("/:id", async (req, res) => {
  const result = await Category.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  res.status(200).send(result);
});

//-------------- CREATE -----------------//
router.post("/", async (req, res) => {
  const result = await Category.create({
    name: req.body.name,
    img_url: req.body.img_url,
  });
  res.status(200).send(result);
});

//-------------- UPDATE -----------------//
router.put("/:id", async (req, res) => {
  const result = await Category.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update(req.body);

  res.status(200).send(response);
});

//-------------- DELETE -----------------//
router.delete("/:id", async (req, res) => {
  const result = await Category.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update({
    deleted_at: new Date(),
  });

  res.status(200).send(response);
});

function validateCategory(Category) {
  const schema = {
    text: Joi.string().min(1).required(),
    completed: Joi.boolean().required(),
  };

  return Joi.validate(Category, schema);
}

module.exports = router;

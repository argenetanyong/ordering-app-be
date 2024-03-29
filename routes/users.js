const Joi = require("joi");
const _ = require("lodash");
const { setHashPassword, generateToken } = require("../helpers");
const { handleSuccess } = require("../helpers/responseHandler");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { User } = require("../database");
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

  const result = await User.findAll(criteria);
  res.status(200).send(result);
});

//-------------- READ -----------------//
router.get("/:id", async (req, res) => {
  const result = await User.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  res.status(200).send(result);
});

//-------------- CREATE -----------------//
router.post("/", async (req, res) => {
  let body = req.body;

  const { error } = validateUser(body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const hashedPassword = await setHashPassword(body.password);
    console.log("hashedPassword", hashedPassword);
    body.password = hashedPassword;
    body.is_admin = 1;

    const criteria = {
      where: { [Op.or]: [{ username: body.username, deleted_at: null }] },
      attibutes: { exclude: ["delete_at", "password"] },
      defaults: body,
    };

    const [data, created] = await User.findOrCreate(criteria);

    if (!created) {
      return res.status(400).send("User already registered!");
    }

    const response = await User.findByPk(data.id, criteria);

    const generatedToken = generateToken({
      id: data.id,
      type: "user",
      expiresIn: "1d",
      data: response,
    });

    /*  res.status(200).send(response); */

    handleSuccess(res, {
      statusCode: 201,
      message: "SUCCESS",
      result: { data: response, token: generatedToken.token },
    });
  } catch (err) {
    console.log("Created user error --> ", err);
  }
});

//-------------- UPDATE -----------------//
router.put("/:id", async (req, res) => {
  const result = await User.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update(req.body);

  res.status(200).send(response);
});

//-------------- DELETE -----------------//
router.delete("/:id", async (req, res) => {
  const result = await User.findByPk(req.params.id);

  if (_.isEmpty(result)) {
    res.status(404).send("MESSAGE DATA NOT EXIST");
    return;
  }

  const response = await result.update({
    deleted_at: new Date(),
  });

  res.status(200).send(response);
});

function validateUser(User) {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  });

  return schema.validate(User);
}

module.exports = router;

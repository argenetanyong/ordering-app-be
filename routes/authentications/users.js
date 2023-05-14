const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { User } = require("../../database");
const { comparePassword, generateToken } = require("../../helpers");
const { handleSuccess } = require("../../helpers/responseHandler");
const { errorHandler } = require("../../helpers/errorHandlers");
const { getDateTime } = require("../../helpers/dates");
const {
  MESSAGE_DATA_SIGNED_IN,
  MESSAGE_DATA_INVALID_PASSWORD,
  MESSAGE_DATA_NOT_EXIST,
} = require("../../helpers/constants.js");

router.use(cors());

router.post("/", async (req, res) => {
  const body = req.body;
  console.log("MESSAGE_DATA_SIGNED_IN", MESSAGE_DATA_SIGNED_IN);
  try {
    // Validate Account
    const criteria = { where: { username: body.username, deleted_at: null } };
    const validateResponse = await User.findOne(criteria);
    if (_.isEmpty(validateResponse)) {
      errorHandler(404, [MESSAGE_DATA_NOT_EXIST]);
    }

    // Validate Password
    const passwordCompare = await comparePassword(
      body.password,
      validateResponse.password
    );

    if (!passwordCompare) {
      errorHandler(400, [MESSAGE_DATA_INVALID_PASSWORD]);
    }

    // Update login status
    const response = await validateResponse.update({
      last_login: getDateTime(),
    });
    const plainData = response.get({ plain: true });
    const filteredResponse = _.omit(plainData, [
      "password",
      "created_user_id",
      "updated_user_id",
      "is_active",
      "last_login",
      "updated_at",
      "deleted_at",
    ]);

    const generatedToken = generateToken({
      id: filteredResponse.id,
      type: "customer",
      expiresIn: "1d",
      data: filteredResponse,
    });

    handleSuccess(res, {
      statusCode: 200,
      message: MESSAGE_DATA_SIGNED_IN,
      result: {
        token: generatedToken.token,
        expiresIn: generatedToken.expiresIn,
        data: filteredResponse,
      },
    });
  } catch (err) {
    //res.status(400).send("Invalid password");
    /* next(err); */
    console.error(`[${User}] Error on login: `, err);
    const MESSAGE_INVALID_LOGIN = "Invalid login";
    res.status(404).send({
      status: MESSAGE_INVALID_LOGIN,
      statusCode: 404,
      message: MESSAGE_INVALID_LOGIN,
      err: err,
    });
  }
});

function validate(req) {
  const schema = {
    username: Joi.string().max(50).email().required(),
    password: Joi.string().min(3).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;

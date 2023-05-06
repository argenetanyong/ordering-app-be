const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// # set methods starts here ...
const setHashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashPassword) => {
  try {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const generateToken = (payload) => {
  try {
    const expiresIn = payload.expiresIn || "1d";
    const accountInfo = payload.data || null;
    const data = { id: payload.id, type: payload.type, data: accountInfo };
    const expiration = { expiresIn: expiresIn };
    const token = jsonwebtoken.sign(data, "secretKey", expiration);
    return { token: token, expiresIn: expiresIn };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const verifyToken = (token, callback) => {
  try {
    const data = jsonwebtoken.verify(token, jwtConfig.secret, {}, callback);
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const decodeToken = (token) => {
  try {
    const decoded = jsonwebtoken.decode(token, { complete: true });
    return decoded;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { setHashPassword, generateToken };

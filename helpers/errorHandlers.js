const errorHandler = (statusCode, message) => {
  throw new Error(`Status code: ${statusCode} - ${message}`);
};

module.exports = { errorHandler };

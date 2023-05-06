const handleError = (err, res) => {
  const { statusCode, message, errors } = err;
  res.status(statusCode).send({
    status: "error",
    statusCode,
    message,
    errors,
  });
};

const handleSuccess = async (res, obj) => {
  const { statusCode, message, result } = obj;
  res.status(statusCode).send({
    status: "success",
    statusCode: statusCode,
    message,
    result,
  });
};

module.exports = { handleError, handleSuccess };

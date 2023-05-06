const { format } = require("date-fns");

const getDateTime = () => {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
};

const getDate = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const getTime = () => {
  return format(new Date(), "HH:mm:ss");
};

const getYear = () => {
  return format(new Date(), "yyyy");
};

const getYearInDate = (date) => {
  return format(new Date(date), "yyyy");
};

const getFirstTwoDigitsYear = () => {
  return format(new Date(), "yy");
};

const getFirstTwoDigitsYearInDate = (date) => {
  return format(new Date(date), "yyyy");
};

module.exports = {
  getDateTime,
  getDate,
  getTime,
  getYear,
  getYearInDate,
  getFirstTwoDigitsYear,
  getFirstTwoDigitsYearInDate,
};

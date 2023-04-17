const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Create a new instance of Sequelize with your database credentials
const sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    dialect: "mysql",
  }
);

const Product = sequelize.define(
  "product",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    img_url: {
      type: Sequelize.STRING,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    underscored: true,
  }
);

const Category = sequelize.define(
  "category",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    img_url: {
      type: Sequelize.STRING,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    underscored: true,
  }
);

module.exports = {
  sequelize,
  Product,
  Category,
};

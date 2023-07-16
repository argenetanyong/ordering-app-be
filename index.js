const products = require("./routes/products");
const categories = require("./routes/categories");
const users = require("./routes/users");
const orders = require("./routes/orders");
const orderDetails = require("./routes/order-details");
const authentications = require("./routes/authentications/users");
const express = require("express");
const app = express();
const { sequelize } = require("./database");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const startServer = async () => {
  try {
    app.use(express.json());
    app.use("/api/products", products);
    app.use("/api/categories", categories);
    app.use("/api/users", users);
    app.use("/api/orders", orders);
    app.use("/api/order-details", orderDetails);
    app.use("/api/authentications", authentications);
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(fileUpload());

    await sequelize.authenticate();
    await sequelize.sync();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  } catch (error) {
    console.log("Unable to connect to db... ", error);
  }
};

startServer();

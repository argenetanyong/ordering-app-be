const products = require("./routes/products");
const express = require("express");
const app = express();
const { sequelize } = require("./database");

const startServer = async () => {
  try {
    app.use(express.json());
    app.use("/api/products", products);

    await sequelize.authenticate();
    await sequelize.sync();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  } catch (error) {
    console.log("Unable to connect to db... ", error);
  }
};

startServer();

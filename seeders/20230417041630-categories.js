"use strict";

const { Category } = require("../database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Category.bulkCreate([
      {
        name: "Burgers and sanwiches",
        img_url: "../images/locus.jpg",
      },
      {
        name: "Chicken and fish",
        img_url: "../images/locus.jpg",
      },
      {
        name: "Breakfast",
        img_url: "../images/locus.jpg",
      },
      {
        name: "Salad and sides",
        img_url: "../images/locus.jpg",
      },
      {
        name: "Beverages",
        img_url: "../images/locus.jpg",
      },
      {
        name: "Desserts",
        img_url: "../images/locus.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};

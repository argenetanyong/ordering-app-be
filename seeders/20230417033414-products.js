"use strict";

const { Product } = require("../database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Product.bulkCreate([
      {
        name: "Regular Burger",
        price: 21,
        category_id: 1,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Cheese Burger",
        price: 22,
        category_id: 1,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Quarter Pounder",
        price: 23,
        category_id: 1,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Double Patty Burger",
        price: 24,
        category_id: 1,
        img_url: "../images/locus.jpg",
      },
      {
        name: "1 pc chicken",
        price: 25,
        category_id: 2,
        img_url: "../images/locus.jpg",
      },
      {
        name: "2 pc chicken",
        price: 26,
        category_id: 2,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Chicken poppers",
        price: 27,
        category_id: 2,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Fish fillet",
        price: 28,
        category_id: 2,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Hashbrown",
        price: 29,
        category_id: 3,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Pan cake",
        price: 30,
        category_id: 3,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Eggdesal",
        price: 31,
        category_id: 3,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Waffle",
        price: 32,
        category_id: 3,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Fries",
        price: 29,
        category_id: 4,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Quesadilla",
        price: 30,
        category_id: 4,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Caesar Salad",
        price: 31,
        category_id: 4,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Arabic Fattoush",
        price: 32,
        category_id: 4,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Soda",
        price: 29,
        category_id: 5,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Root Beer",
        price: 30,
        category_id: 5,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Juice",
        price: 31,
        category_id: 5,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Coffee",
        price: 32,
        category_id: 5,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Sundae",
        price: 29,
        category_id: 6,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Float",
        price: 30,
        category_id: 6,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Salted Caramel",
        price: 31,
        category_id: 6,
        img_url: "../images/locus.jpg",
      },
      {
        name: "Crusher",
        price: 32,
        category_id: 6,
        img_url: "../images/locus.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};

/*
Name: Bharath Prabakaran
Modified on: 12 September 2021 12:25:43
*/
const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
  },
  type: [{
    type: String,
    required: [true, "Type Field can not be empty"],
    enum: [
      "normal",
      "fire",
      "water",
      "grass",
      "electric",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dark",
      "dragon",
      "steel",
      "fairy",
    ],
  }],
  image: {
    type: String,
    required: true,
  },
  moves: [
    {
      type: String
    }
  ]
});

const Product = mongoose.model("Product", pokemonSchema);
module.exports = Product;

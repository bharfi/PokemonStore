var Pokedex = require("pokedex-promise-v2");
const axios = require("axios");
const mongoose = require("mongoose");

var P = new Pokedex();

mongoose
  .connect("mongodb://localhost:27017/PokemonApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Oops Mongo Error");
    console.log(err);
  });
const Product = require("./models/product");

//Number of pokemon to use - interval
var interval = {
  limit: 30,
  offset: 0,
};

let seedPokemon = [];

P.getPokemonsList(interval).then(async function (response) {
  const {
    count,
    next,
    previous,
    results: [...pokemonList],
  } = response;
  const deleted = await Product.deleteMany({});
  console.log(deleted)
  pokemonList.forEach(async (pokemon) => {
    const { name, url } = pokemon;
    let typeList = [];
    let moveList = [];
    const { data: data } = await axios.get(url);
    const {
      species,
      sprites: {
        other: {"official-artwork": { front_default: front_default }}},
      moves,
        types: types,
    } = data;
    for (const {
      slot,
      type: { name: typeName },
    } of types) {
      typeList.push(typeName);
    }
    for(const {move: {name:MoveName}} of moves)
    {
      moveList.push(MoveName);
    }
    //console.log(name, typeList, front_default);
    seedPokemon.push({
      name: name,
      type: typeList,
      image: front_default,
      moves: moveList
    });
    //console.log(seedPokemon);

    // To clear Database
    //await Product.deleteMany({ });

    const inserted = await Product.insertMany({
      name: name,
      type: typeList,
      image: front_default,
      moves: moveList
    })
      .then((res) => {
        //console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    
  });
});

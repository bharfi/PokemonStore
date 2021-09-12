var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();
var interval = {
  limit: 10,
  offset: 0,
};
P.getPokemonsList(interval).then(function (response) {
  console.log(response);
});

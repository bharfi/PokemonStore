const container = document.querySelector('#container1');
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'


for (let i = 1; i <= 151; i++) {
    const pokemon = document.createElement('div');
    pokemon.classList.add('col');
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('card');
    pokemonCard.style.width = '18 rem';
    console.log("i");
    //pokemonCard.style.width.add('18 rem');
        const pokeImg = document.createElement('img');
        pokeImg.src = `${baseURL}${i}.png`;
        pokeImg.classList.add('card-img-top');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

            const cardtitle = document.createElement('h5');
            cardtitle.classList.add('card-title');
            cardtitle.innerText = 'Pokemon Name';

            const cardtext = document.createElement('p');
            cardtext.classList.add('card-text');

            const cardlink = document.createElement('a');
            cardlink.classList.add('btn');
            cardlink.classList.add('btn-danger')
            cardlink.href = "#";
            cardlink.innerText = "Add ";
            const cardBadge = document.createElement('span');
            cardBadge.classList.add("badge");
            cardBadge.classList.add("bg-warning");
            cardBadge.innerText = "0";

    cardlink.appendChild(cardBadge);        
    cardBody.appendChild(cardtitle);
    cardBody.appendChild(cardtext);
    cardBody.appendChild(cardlink);
    pokemonCard.appendChild(pokeImg);
    pokemonCard.appendChild(cardBody);
    pokemon.appendChild(pokemonCard)
    container1.appendChild(pokemon);
}
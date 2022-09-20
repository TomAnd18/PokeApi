const pokemonsContainer = document.getElementById('pokemons-container');
const botones = document.getElementById('botones');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
var offset = 0;
var limit = 6;

window.addEventListener("scroll", () => {
    let nav = document.getElementById('nav');
    nav.classList.add('abajo');
})

document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        console.log('Presione Enter');
        buscarPokemon();
    }
})

/*BOTON ANTERIOR*/
previous.addEventListener('click', () => {
    if (offset != 0) {
        offset -= 6;
        removeChild(pokemonsContainer);
        getPokemons(offset, limit);
    }
});

/*BOTON SIGUIENTE*/
next.addEventListener('click', () => {
    offset += 6;
    removeChild(pokemonsContainer);
    getPokemons(offset, limit);
});

/*ELIMINO TODO LO QUE HAY EN LA PANTALLA*/
function removeChild(element) {
    while (element.firstChild != null) {
        element.removeChild(element.firstChild);
    }
}

/*BUSCAR POKEMON*/
function buscarPokemon() {
    
    let name = document.getElementById('buscar').value;
    
    if(name == '') {
        console.log('Ingrese un pokemon');
    } else {
        removeChild(pokemonsContainer);
        botones.style.visibility = 'hidden';
        let buscando = document.createElement('h3');
        buscando.textContent = 'Buscando Pokemon...';
        let cargando = document.createElement('div');
        cargando.classList.add('rueda');
        const buscandoContainer = document.createElement('div');
        buscandoContainer.classList.add('buscandoContainer');
        buscandoContainer.appendChild(cargando);
        buscandoContainer.appendChild(buscando);
        pokemonsContainer.appendChild(buscandoContainer);

        // fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        //     .then(res => res.json())
        //     .then(pokemon => createCardPokemon(pokemon))
        //     .catch(err => console.log(err));

        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${1200}&offset=${0}`)
            .then(res => res.json())
            .then(pokemons => obtenerPokemon(pokemons.results, name))
            .catch(err => console.log(err));
    }
}

/*OBTENER POKEMON BUSCADO */
async function obtenerPokemon(pokemons, name) {
    const poke = [];
    const encontre = false;
    let i = 0;

    try {
        while (!encontre) {
            const res = await fetch(pokemons[i].url);
            const datos = await res.json();
            if(datos.name == name) {
                poke[0] = datos;
                encontre = true;
            }
            i++;
        }
    } catch (err) {
        console.log(err);
    }

    if(poke.length == 1) {
        removeChild(pokemonsContainer);
        createCardPokemon(poke[0]);
        botones.style.visibility = 'hidden';
    } else {
        removeChild(pokemonsContainer);
        let noEncontrado = document.createElement('h3');
        noEncontrado.textContent = 'Pokemon no encontrado';
        let imgNE = document.createElement('img');
        imgNE.src = './img/noEncontrado1.png';
        const noEncontradoContainer = document.createElement('div');
        noEncontradoContainer.classList.add('noEncontradoContainer');
        noEncontradoContainer.appendChild(imgNE);
        noEncontradoContainer.appendChild(noEncontrado);
        pokemonsContainer.appendChild(noEncontradoContainer);
        console.log('LLEGUEEEEEEE');
    }
}

function filtrar(tipo) {
    console.log(tipo);
    removeChild(pokemonsContainer);
    fetch(`https://pokeapi.co/api/v2/type`)
        .then(res => res.json())
        .then(tipos => tiposPokemon(tipos.results, tipo))
        .catch(err => console.log(err));
}

function tiposPokemon(tipos, tipo) {
    console.log(tipos)
    let pokemonsTipo = tipos.filter(e => (e.name == tipo));
    console.log(pokemonsTipo);
    fetch(pokemonsTipo[0].url)
        .then(res => res.json())
        .then(datos => filtroComplete(datos))
        .catch(err => console.log(err));
}

async function filtroComplete(datos) {
    console.log(datos.pokemon)
    
    try {
        botones.style.visibility = 'hidden';
        for(let i=0; i<datos.pokemon.length; i++) {
            const res = await fetch(datos.pokemon[i].pokemon.url);
            const data = await res.json();
            // console.log(data);
            createCardPokemon(data);
        }
    } catch (err) {
        console.log(err);
    }
}

function inicio() {
    removeChild(pokemonsContainer);
    botones.style.visibility = 'visible';
    let buscar = document.getElementById('buscar');
    buscar.value = '';
    limit = 6;
    offset = 0;
    getPokemons();
}

/*OBTENGO ARRAY DE POKEMONS*/
function getPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then(res => res.json())
        .then(pokemons => getPokemon(pokemons.results))
        .catch(err => console.log(err));
}

/*OBTENGO LOS DATOS DE CADA POKEMON Y DIBUJO LA CARD*/
async function getPokemon(pokemons) {
    console.log(pokemons);
    try {
        
        for (var i=0; i<pokemons.length; i++) {
            const res = await fetch(pokemons[i].url);
            const datos = await res.json();
            createCardPokemon(datos);
        }
    } catch (err) {
        console.log(err);
    }
}

/*CREO CARD DE POKEMON*/
function createCardPokemon(pokemon) {
    console.log(pokemon);
    // fetch(pokemon.stats[0].stat.url)
    //     .then(res => res.json())
    //     .then(datos => console.log(datos));

    const card = document.createElement('div');
    card.classList.add('card-pokemon');
    card.classList.add(pokemon.types[0].type.name);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const imgPokemon = document.createElement('img');
    if(pokemon.sprites.other.home.front_default == null) {
        imgPokemon.src = pokemon.sprites.front_default;
    } else {
        imgPokemon.src = pokemon.sprites.other.home.front_default;
    }
    

    imgContainer.appendChild(imgPokemon);

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');

    const numPokemon = document.createElement('h3');
    numPokemon.textContent = `#${pokemon.id}`;

    const type = document.createElement('h3');
    type.textContent = pokemon.types[0].type.name;

    const namePokemon = document.createElement('h2');
    namePokemon.textContent = pokemon.name;

    card.appendChild(imgContainer);
    infoContainer.appendChild(namePokemon);
    infoContainer.appendChild(numPokemon);
    infoContainer.appendChild(type);

    card.appendChild(infoContainer);

    pokemonsContainer.appendChild(card);

    /*EVENTO DE CADA CARD*/
    card.addEventListener('click', () => {
        removeChild(pokemonsContainer);
        botones.style.visibility = 'hidden';

        // const body = document.getElementById('body');
        // body.classList.add(pokemon.types[0].type.name);
        
        const card = document.createElement('div');
        card.classList.add('card-pokemon-info');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container-info');

        const imgPokemon = document.createElement('img');
        imgPokemon.src = pokemon.sprites.other.home.front_default;

        imgContainer.appendChild(imgPokemon);
        // imgPokemon.style.width = '20rem';

        const infoContainerPoke = document.createElement('div');
        infoContainerPoke.classList.add('info-container-poke');

        const imgInfo = document.createElement('div');
        imgInfo.classList.add('img-info');

        const botonBack = document.createElement('button');
        botonBack.textContent = 'Back';

        /*BOTON BACK*/
        botonBack.addEventListener('click', () => {
            removeChild(pokemonsContainer);
            botones.style.visibility = 'visible';
            getPokemons(offset, limit);
        })

        /*ESTADISTICAS DEL POKEMON*/
        const namePokemon = document.createElement('h2');
        namePokemon.textContent = pokemon.name;

        const numPokemon = document.createElement('h3');
        numPokemon.textContent = `#${pokemon.id}`;

        const type = document.createElement('h3');
        type.textContent = pokemon.types[0].type.name;

        const headTitle = document.createElement('div');
        headTitle.classList.add('head-title-container');
        headTitle.appendChild(namePokemon);
        headTitle.appendChild(numPokemon);
        headTitle.appendChild(type);

        /*STATS*/
        /*HP*/
        const hp = document.createElement('h3');
        hp.textContent = pokemon.stats[0].stat.name + ' :';
        const hpNum = document.createElement('h3');
        hpNum.textContent = pokemon.stats[0].base_stat;
        const hpContainer = document.createElement('div');
        hpContainer.classList.add('detalles-container');
        hpContainer.appendChild(hp);
        hpContainer.appendChild(hpNum);

        /*ATTACK*/
        const attack = document.createElement('h3');
        attack.textContent = pokemon.stats[1].stat.name + ' : ';
        const attackNum = document.createElement('h3');
        attackNum.textContent = pokemon.stats[1].base_stat;
        const attackContainer = document.createElement('div');
        attackContainer.classList.add('detalles-container');
        attackContainer.appendChild(attack);
        attackContainer.appendChild(attackNum);

        /*DEFENSE*/
        const defense = document.createElement('h3');
        defense.textContent = pokemon.stats[2].stat.name + ' : ';
        const defenseNum = document.createElement('h3');
        defenseNum.textContent = pokemon.stats[2].base_stat;
        const defenseContainer = document.createElement('div');
        defenseContainer.classList.add('detalles-container');
        defenseContainer.appendChild(defense);
        defenseContainer.appendChild(defenseNum);
        
        /*SPECIALATTACK*/
        const specialAttack = document.createElement('h3');
        specialAttack.textContent = pokemon.stats[3].stat.name + ' : ';
        const specialAttackNum = document.createElement('h3');
        specialAttackNum.textContent = pokemon.stats[3].base_stat;
        const specialAttackContainer = document.createElement('div');
        specialAttackContainer.classList.add('detalles-container');
        specialAttackContainer.appendChild(specialAttack);
        specialAttackContainer.appendChild(specialAttackNum);

        /*SPECIALdEFENSE*/
        const specialDefense = document.createElement('h3');
        specialDefense.textContent = pokemon.stats[4].stat.name + ' : ';
        const specialDefenseNum = document.createElement('h3');
        specialDefenseNum.textContent = pokemon.stats[4].base_stat;
        const specialDefenseContainer = document.createElement('div');
        specialDefenseContainer.classList.add('detalles-container');
        specialDefenseContainer.appendChild(specialDefense);
        specialDefenseContainer.appendChild(specialDefenseNum);
        
        /*SPEED*/
        const speed = document.createElement('h3');
        speed.textContent = pokemon.stats[5].stat.name + ' : ';
        const speedNum = document.createElement('h3');
        speedNum.textContent = pokemon.stats[5].base_stat;
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('detalles-container');
        speedContainer.appendChild(speed);
        speedContainer.appendChild(speedNum);

        card.appendChild(botonBack);
        imgInfo.appendChild(imgContainer);
        // infoContainerPoke.appendChild(namePokemon);
        // infoContainerPoke.appendChild(numPokemon);
        // infoContainerPoke.appendChild(type);
        infoContainerPoke.appendChild(headTitle);
        // infoContainerPoke.appendChild(hp);
        infoContainerPoke.appendChild(hpContainer);
        // infoContainerPoke.appendChild(attack);
        infoContainerPoke.appendChild(attackContainer);
        // infoContainerPoke.appendChild(defense);
        infoContainerPoke.appendChild(defenseContainer);
        // infoContainerPoke.appendChild(specialAttack);
        infoContainerPoke.appendChild(specialAttackContainer);
        // infoContainerPoke.appendChild(specialDefense);
        infoContainerPoke.appendChild(specialDefenseContainer);
        infoContainerPoke.appendChild(speedContainer);

        imgInfo.appendChild(infoContainerPoke);
        card.appendChild(imgInfo);

        pokemonsContainer.appendChild(card);


    });
}
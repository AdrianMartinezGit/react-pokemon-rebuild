import { IEvolution, IPokemon } from "../Interfaces/Interface";

export const saveToLocalStorage = (pokename: string) => {
    let favorites = getLocalStorage();

    favorites.push(pokename);

    favorites.sort((a: number, b: number) => a - b);

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

export const getLocalStorage = () => {

    let localStorageData = localStorage.getItem("Favorites");

    if (localStorageData == null) {
        return [];
    }

    return JSON.parse(localStorageData);
}

export const getLocalFavoriteData = () => {
    let localFavoriteData = localStorage.getItem('FavoriteData');

    if (localFavoriteData === null) {
        localStorage.setItem('Favorites', '[]');
        localStorage.setItem('FavoriteData', '{}');
        return {};
    }

    return JSON.parse(localFavoriteData);
}

export const saveLocalFavoriteData = (name: string, id: string) => {
    let favorites = getLocalStorage();

    if (!favorites.some((fav: { name: string, id: string }) => fav.name === name && fav.id === id)) {
        favorites.push({ name: name, id: id });
        localStorage.setItem("Favorites", JSON.stringify(favorites));
    }
};

export const removeFromLocalStorage = (pokemon: IPokemon | string) => {
    let favorites = getLocalStorage();

    favorites = favorites.filter((fav: { name: string, id: number }) => {
        if (typeof pokemon === 'string') {
            return fav.name !== pokemon;
        } else {
            return fav.name !== pokemon.name || fav.id !== pokemon.id;
        }
    });

    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

export const getPokeData = async (value: string) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}/`);
    const data: IPokemon = await promise.json();

    console.log(data);

    return data;
}
export const getPokeEncounterData = async (id: string) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
    const data = await promise.json();
  
    console.log(data);

    return data;
}

export const getPokeEvolveData = async (value: string) =>{
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${value.toLowerCase()}`);
    const data : IEvolution = await promise.json();
    
    console.log(data);
    
    return data;
}
import React, { useCallback, useEffect, useState } from 'react'

import HomeUnFaveButton from '../Assets/IMG_SubButton.png'
import HomeFaveButton from '../Assets/IMG_AddButton.png'
import HomeLoadPhoto from '../Assets/ANIM_Loading.gif'
import PokemonIcon from '../Assets/IMG_PokemonIcon.png'

import { getLocalStorage, getPokeData, getPokeEncounterData, getPokeEvolveData, removeFromLocalStorage, saveLocalFavoriteData, getPokeEvolveChain, getPokeEvolveImage, getPokeEvolveId } from '../DataServices/DataService'

import { IPokemon, ILocation, IEvolution, IRegEvolution } from '../Interfaces/Interface'

import { capitalSplitCase, padNumbers } from '../DataServices/Utilities'

import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

const PokePageComponent = () => {
    const [userInput, setUserInput] = useState<string>('bulbasaur');
    const [pokemon, setPokemon] = useState<IPokemon | null>(null);
    const [pokeImage, setPokeImage] = useState<string>();
    const [pokeName, setPokeName] = useState<string>('Placeholder');
    const [pokePlace, setPokePlace] = useState<string>('Unknown');
    const [pokeAbility, setPokeAbility] = useState<string>('Unknown');
    const [pokeMoves, setPokeMoves] = useState<string>('Unknown');
    const [pokeText, setPokeText] = useState<string>('Not much is known about this mysterious Pokemon. Play the latest game to find out more!');
    const [homeFavButton, setHomeFavButton] = useState<string>();

    const [shiny, setShiny] = useState<boolean>(true);

    const [pokemonEvolution, setPokemonEvolution] = useState<IRegEvolution | null>(null);
    const [pokemonEvoData, setPokeEvoData] = useState<string[]>([]);
    const [evolutionDatas, setEvolutionData] = useState<{ evolutionImage: string, evolutionId: string }[]>([])

    const [evolveData, setEvolveData] = useState<IRegEvolution>();

    useEffect(() => {
        setPokeImage(HomeLoadPhoto);
        setShiny(true);

        const getMainData = async () => {
            const pokeData = await getPokeData(userInput);
            const data: IPokemon = pokeData;

            const encounterData = await getPokeEncounterData(userInput);

            const locateData: string[] = encounterData.map((location: ILocation) => capitalSplitCase(location.location_area.name).replace(' Area', ''));
            const locateString: string = encounterData.length !== 0 ? locateData.join(', ') : 'Unknown';

            const abilities: string[] = data.abilities.map(data => capitalSplitCase(data.ability.name));
            const abilityData: string = abilities.join(', ');

            const moves: string[] = data.moves.map(data => capitalSplitCase(data.move.name));
            const movesData: string = moves.join(', ');

            const evolutionData = await getPokeEvolveData(userInput);
            const evoData: IEvolution = evolutionData;
            console.log(evoData.evolution_chain.url);
            const evoTypeData = await getPokeEvolveChain(evoData.evolution_chain.url);
            const evoType: { evolution_chain: { chain: { species: { name: string }; evolves_to: { species: { name: string }[] }[] } } } | any | IRegEvolution = evoTypeData;
            console.log(evoType);

            setPokemon(data);
            setPokeName(capitalSplitCase(data.name) + " - #" + padNumbers(data.id, 3));
            setPokePlace(locateString);
            setPokeAbility(abilityData);
            setPokeMoves(movesData);
            setPokeImage(data?.sprites.other?.['official-artwork'].front_default);
            setEvolveData(evoType);

            const favorites: (IPokemon | string)[] = getLocalStorage();
            const isFavorite = favorites.some((favPokemon: IPokemon | string) => {
                if (typeof favPokemon === 'string') {
                    return favPokemon === userInput;
                } else {
                    return favPokemon.name === userInput;
                }
            });

            if (isFavorite) {
                setHomeFavButton(HomeUnFaveButton);
            } else {
                setHomeFavButton(HomeFaveButton);
            }

            const GetFlavorText = () => {
                let flavorArray = evoData.flavor_text_entries;
                let flavor = 'Not much is known about this mysterious Pokemon. Play the latest game to find out more!';

                for (let i = 0; i < flavorArray.length; i++) {
                    if (flavorArray[i].language.name === 'en') {
                        flavor = flavorArray[i].flavor_text.replaceAll('', ' ');
                        break;
                    }
                }

                setPokeText(flavor);
            }

            GetFlavorText();

            const pokemonEvolutionChain: string[] = [];

            if (evoType && evoType.chain) {
                pokemonEvolutionChain.push(evoType.chain.species.name);
                evoType.chain.evolves_to.forEach((e: { species: { name: string; }; evolves_to: string[]; }) => {
                    e.species && pokemonEvolutionChain.push(e.species.name);
                    e.evolves_to.forEach((e: any) => {
                        e.species && pokemonEvolutionChain.push(e.species.name);
                    });
                });
            }
            setPokeEvoData(pokemonEvolutionChain);
            console.log(pokemonEvolutionChain);
        }

        getMainData();
    }, [userInput]);

    const fetchEvolutionData = useCallback(async () => {
        const promise = pokemonEvoData.map(async (evolutionName: string) => {
            const evolutionImage = await getPokeEvolveImage(evolutionName);
            const evolutionId = await getPokeEvolveId(evolutionName);

            console.log(evolutionImage);

            return { evolutionImage, evolutionId: String(evolutionId) };
        });

        const dataEvo = await Promise.all(promise);
        setEvolutionData(dataEvo);
    }, [pokemonEvoData]);

    useEffect(() => {
        fetchEvolutionData();
    }, [fetchEvolutionData]);

    const handleShinyPokemon = () => {
        const shinyPic = pokemon?.sprites.other?.['official-artwork'].front_shiny;
        const defaultPic = pokemon?.sprites.other?.['official-artwork'].front_default;

        if (shinyPic && pokeImage !== shinyPic) {
            setPokeImage(shinyPic);
        } else if (defaultPic && pokeImage !== defaultPic) {
            setPokeImage(defaultPic);
        }
    };

    const doSomething = (event: React.FormEvent) => {
        event.preventDefault();
    }

    const genRandomNumber = async () => {
        const randomId: string = String(Math.floor(Math.floor(Math.random() * 1008) + 1));
        const getName: IPokemon = await getPokeData(randomId);
        setUserInput(getName.name);
        setPokeImage(HomeLoadPhoto);
    }

    const handleHomeFavoriteButton = () => {
        const pokemonName = pokemon?.name;
        const pokemonId = String(pokemon?.id);

        if (pokemonName && pokemonId) {
            const favorites = getLocalStorage();
            const isAlreadyFavorite = favorites.some((fav: { name: string, id: string }) => fav.name === pokemonName && fav.id === pokemonId);

            if (isAlreadyFavorite) {
                setHomeFavButton(HomeFaveButton);
                removeFromLocalStorage(pokemonName);
            } else {
                setHomeFavButton(HomeUnFaveButton);
                saveLocalFavoriteData(pokemonName, pokemonId)
            }
        }

        console.log(homeFavButton);
    };

    return (
        <>
            <div className="bg-gray-800" id="topElement">
                <div className="flex justify-center">
                    <form className="pt-5" style={{ width: "90%" }} onSubmit={doSomething}>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search"
                                className="block w-full font-custom p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search by Name or Pokédex Number" required onKeyDown={(e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
                                    if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Enter") {
                                        setUserInput((e as React.ChangeEvent<HTMLInputElement>).target.value);
                                    }
                                }} />
                        </div>
                    </form>
                </div>

                <h1 className="text-center text-6xl font-semibold text-white pt-5 font-custom" style={{ textShadow: "4px 4px 6px black" }} id="pokemonName">{pokeName}</h1>
                <hr style={{ border: "3px solid black" }} className="mt-5" />
            </div>

            <img src={pokeImage} className="pokeImgSize h-auto mx-auto pt-5 pb-5" id="pokemonImg" onClick={handleShinyPokemon} alt='pokemonImage' />

            <div className="flex justify-center">
                <button type="button" style={{ width: '160px', borderRadius: '15px' }}
                    className="font-custom text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    id="randomPokeButton" onClick={genRandomNumber}>Random</button>
                <button type="button" style={{ width: '160px', borderRadius: '15px' }} id="favoriteDrawerButton"
                    className="font-custom focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    data-drawer-backdrop="true"
                    aria-controls="favoriteDrawer">Favorites</button>
                <input type="image" id="favoritePokeButton" src={homeFavButton} style={{ height: '40px', width: '40px' }} alt='homeFavoriteButton' onClick={handleHomeFavoriteButton} />
            </div>

            <div className="bg-white">
                <hr style={{ border: "3px solid black" }} className="mt-5" />
                <h1 className="text-center text-5xl font-extrabold text-black pt-5 font-custom">Flavor Text:</h1>
                <div className="flex justify-center">
                    <p id="pokemonFlavorText" className="font-custom text-center font-semibold text-black pt-5 flavor-text" style={{ width: "90%" }}>{pokeText}</p>
                </div>
                <hr style={{ border: "3px solid black" }} className="mt-5" />
            </div>

            <div className="bg-white">
                <h1 className="text-center text-5xl font-extrabold text-black pt-5 font-custom">Type:</h1>

                <div id="typeContainer" className="flex justify-center pt-10 pb-5 flex-row space-x-4 font-custom">
                {pokemon ? pokemon.types.map((type: { type: { name: string } }, index: number) => (
                            <div className='typeIconContainer flex items-center' key={index} style={{backgroundColor: 'gray'}}>
                                <img src={`../assets/IMG_${capitalSplitCase(`${type.type.name}`)}.png`} className='typeImg' alt='typeIcon'/>
                                <p className='text-white mx-auto text-2xl pr-4'>{capitalSplitCase(`${type.type.name}`)}</p>
                            </div>
                        ))
                            : "N/A"}
                </div>

                <hr style={{ border: "3px solid black" }} className="mt-5" />
                <h1 className="text-center text-5xl font-extrabold text-black pt-5 font-custom">Location:</h1>
                <p id="pokemonPlace" className="text-center text-4xl font-semibold text-black pt-5 font-custom">{pokePlace}</p>
                <hr style={{ border: "3px solid black" }} className="mt-5" />
                <h1 className="text-center text-5xl font-extrabold text-black pt-5 font-custom">Abilities:</h1>
                <p id="pokemonAbility" className="text-center font-semibold text-black pt-5 abilities-text font-custom">{pokeAbility}</p>
                <hr style={{ border: "3px solid black" }} className="mt-5" />
                <h1 className="text-center text-5xl font-extrabold text-black pt-5 font-custom">Moves:</h1>

                <div className="flex justify-center">
                    <p id="pokemonMoves" className="text-center font-semibold text-black pt-5 move-text font-custom" style={{ width: "90%" }}>{pokeMoves}</p>
                </div>

                <hr style={{ border: "3px solid black" }} className="mt-5" />
            </div>

            <div style={{ backgroundColor: "#CEFFCD" }}>
                <h1 id="pokemonMoves" className="text-center text-5xl font-extrabold text-white pt-5 font-custom" style={{ textShadow: "4px 4px 6px black" }}>Evolutions:</h1>

                <div id="evolveContainer" className="pt-5 pb-5 font-custom">
                <div className='flex items-center justify-center evolveBranch' style={{ outline: '2px solid black', backgroundColor: 'white', borderRadius: '5px' }}>
                        {evolutionDatas.map(({ evolutionImage, evolutionId }, index) => (
                            <>
                                {index > 0 && <i className='ph-arrow-right-bold' />}
                                <div className="evolveCol">
                                <img src={`${evolutionImage}`} className="evolveImg mx-auto"
                                    onClick={() => {
                                        setUserInput(pokemonEvoData[index]);
                                        window.scroll({
                                            top: 0,
                                            left: 0,
                                            behavior: "smooth",
                                        });
                                    }} alt={pokemonEvoData[index]}
                                />
                                <p className="text-center">{capitalSplitCase(pokemonEvoData[index])}</p>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <Sidebar aria-label="Sidebar with logo branding example">
                <Sidebar.Logo href="#" img={PokemonIcon} imgAlt="Flowbite logo">
                    My Favorite Pokémon
                </Sidebar.Logo>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={HiChartPie}>
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiViewBoards}>
                            Kanban
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiInbox}>
                            Inbox
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiUser}>
                            Users
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiShoppingBag}>
                            Products
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiArrowSmRight}>
                            Sign In
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiTable}>
                            Sign Up
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </>
    )
}

export default PokePageComponent

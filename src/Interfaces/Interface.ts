export interface IPokemon {
    abilities: IAbility[];
    base_experience: number;
    cries: ICries;
    forms: ISpecies[];
    game_indices: IGameIndex[];
    height: number;
    held_items: IHeldItem[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: IMove[];
    name: string;
    order: number;
    past_abilities: any[];
    past_types: any[];
    species: ISpecies;
    sprites: ISprites;
    stats: IStat[];
    types: IType[];
    weight: number;
}

export interface IAbility {
    ability: ISpecies;
    is_hidden: boolean;
    slot: number;
}

export interface ISpecies {
    name: string;
    url: string;
}

export interface ICries {
    latest: string;
    legacy: string;
}

export interface IGameIndex {
    game_index: number;
    version: ISpecies;
}

export interface IHeldItem {
    item: ISpecies;
    version_details: IVersionDetail[];
}

export interface IVersionDetail {
    rarity: number;
    version: ISpecies;
}

export interface IMove {
    move: ISpecies;
    version_group_details: IVersionGroupDetail[];
}

export interface IVersionGroupDetail {
    level_learned_at: number;
    move_learn_method: ISpecies;
    version_group: ISpecies;
}

export interface IGenerationV {
    "black-white": ISprites;
}

export interface IGenerationIv {
    "diamond-pearl": ISprites;
    "heartgold-soulsilver": ISprites;
    platinum: ISprites;
}

export interface IVersions {
    "generation-i": IGenerationI;
    "generation-ii": IGenerationIi;
    "generation-iii": IGenerationIii;
    "generation-iv": IGenerationIv;
    "generation-v": IGenerationV;
    "generation-vi": { [key: string]: IHome };
    "generation-vii": IGenerationVii;
    "generation-viii": IGenerationViii;
}

export interface IOther {
    dream_world: IDreamWorld;
    home: IHome;
    "official-artwork": IOfficialArtwork;
    showdown: ISprites;
}

export interface ISprites {
    animated?: ISprites;
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: null | string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
    other?: IOther;
    versions?: IVersions;
}

export interface IGenerationI {
    "red-blue": IRedBlue;
    yellow: IRedBlue;
}

export interface IRedBlue {
    back_default: string;
    back_gray: string;
    back_transparent: string;
    front_default: string;
    front_gray: string;
    front_transparent: string;
}

export interface IGenerationIi {
    crystal: ICrystal;
    gold: IGold;
    silver: IGold;
}

export interface ICrystal {
    back_default: string;
    back_shiny: string;
    back_shiny_transparent: string;
    back_transparent: string;
    front_default: string;
    front_shiny: string;
    front_shiny_transparent: string;
    front_transparent: string;
}

export interface IGold {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
    front_transparent?: string;
}

export interface IGenerationIii {
    emerald: IOfficialArtwork;
    "firered-leafgreen": IGold;
    "ruby-sapphire": IGold;
}

export interface IOfficialArtwork {
    front_default: string;
    front_shiny: string;
}

export interface IHome {
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
}

export interface IGenerationVii {
    icons: IDreamWorld;
    "ultra-sun-ultra-moon": IHome;
}

export interface IDreamWorld {
    front_default: string;
    front_female: null | string;
}

export interface IGenerationViii {
    icons: IDreamWorld;
}

export interface IStat {
    base_stat: number;
    effort: number;
    stat: ISpecies;
}

export interface IType {
    slot: number;
    type: ISpecies;
}


export interface IEvolution {
    base_happiness: number;
    capture_rate: number;
    color: IColor;
    egg_groups: IColor[];
    evolution_chain: IEvolutionChain;
    evolves_from_species: IColor;
    flavor_text_entries: IFlavorTextEntry[];
    form_descriptions: any[];
    forms_switchable: boolean;
    gender_rate: number;
    genera: IGenus[];
    generation: IColor;
    growth_rate: IColor;
    habitat: IColor;
    has_gender_differences: boolean;
    hatch_counter: number;
    id: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    name: string;
    names: IName[];
    order: number;
    pal_park_encounters: IPalParkEncounter[];
    pokedex_numbers: IPokedexNumber[];
    shape: IColor;
    varieties: IVariety[];
}

export interface IColor {
    name: string;
    url: string;
}

export interface IEvolutionChain {
    url: string;
}

export interface IFlavorTextEntry {
    flavor_text: string;
    language: IColor;
    version: IColor;
}

export interface IGenus {
    genus: string;
    language: IColor;
}

export interface IName {
    language: IColor;
    name: string;
}

export interface IPalParkEncounter {
    area: IColor;
    base_score: number;
    rate: number;
}

export interface IPokedexNumber {
    entry_number: number;
    pokedex: IColor;
}

export interface IVariety {
    is_default: boolean;
    pokemon: IColor;
}



export interface ILocation {
    location_area: ILocationArea;
    version_details: IVersionDetail[];
}

export interface ILocationArea {
    name: string;
    url: string;
}

export interface IVersionDetail {
    encounter_details: IEncounterDetail[];
    max_chance: number;
    version: ILocationArea;
}

export interface IEncounterDetail {
    chance: number;
    condition_values: ILocationArea[];
    max_level: number;
    method: ILocationArea;
    min_level: number;
}

export interface ILocation2 {
    location_area: {
        name: string;
    }[];
}

export interface IRegEvolution {
    baby_trigger_item: null;
    chain: IChain;
    id: number;
}

export interface IChain {
    evolution_details: IEvolutionDetail[];
    evolves_to: IChain[];
    is_baby: boolean;
    species: ISpecies;
}

export interface IEvolutionDetail {
    gender: null;
    held_item: null;
    item: ISpecies | null;
    known_move: null;
    known_move_type: null;
    location: null;
    min_affection: null;
    min_beauty: null;
    min_happiness: number | null;
    min_level: null;
    needs_overworld_rain: boolean;
    party_species: null;
    party_type: null;
    relative_physical_stats: null;
    time_of_day: string;
    trade_species: null;
    trigger: ISpecies;
    turn_upside_down: boolean;
}

export interface ISpecies {
    name: string;
    url: string;
}

export interface IPokeNameProp {
    pokeName: string;
}

export interface IPokeImageProp {
    pokeImage?: string
}

export interface IPokeLocationProp {
    pokeLocation: string
}

export interface IPokeAbilitiesProp {
    pokeAbilities: string
}

export interface IPokeMovesProp {
    pokeMoves: string
}

export interface IPokeFlavorProp {
    pokeFlavorText: string
}

export interface ILocations {
    id: number,
    name: string,
}
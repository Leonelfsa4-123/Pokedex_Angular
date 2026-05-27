export interface PokemonListItem {
  name: string;
  id: number;
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonType {
  type: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': { front_default: string };
    };
    versions: {
      'generation-v': {
        'black-white': {
          animated: { front_default: string };
        };
      };
    };
  };
}

export interface PokemonSpecies {
  gender_rate: number;
  genera: Array<{ genus: string; language: { name: string } }>;
  evolution_chain: { url: string };
}

export interface EvoChainLink {
  species: { name: string; url: string };
  evolves_to: EvoChainLink[];
}

export interface EvolutionChain {
  chain: EvoChainLink;
}

export interface PokemonDetail {
  pokemon: Pokemon;
  species: PokemonSpecies;
  gender: string;
  category: string;
  abilityName: string;
  animatedImg: string;
  staticImg: string;
  cryUrl: string;
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpAtk',
  'special-defense': 'SpDef',
  speed: 'Vel'
};

export const STAT_COLORS: Record<string, string> = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2'
};

export const DISPLAY_STATS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

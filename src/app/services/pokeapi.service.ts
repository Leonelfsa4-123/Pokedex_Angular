import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import {
  Pokemon,
  PokemonDetail,
  PokemonListItem,
  PokemonSpecies,
  EvolutionChain,
  EvoChainLink,
  DISPLAY_STATS
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokeapiService {
  private http = inject(HttpClient);
  private base = 'https://pokeapi.co/api/v2';

  /** Load full list (up to 1010 Pokémon) for the search index */
  getAllPokemon(): Observable<PokemonListItem[]> {
    return this.http
      .get<{ results: { name: string }[] }>(`${this.base}/pokemon?limit=1010`)
      .pipe(map(res => res.results.map((p, i) => ({ name: p.name, id: i + 1 }))));
  }

  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.base}/pokemon/${nameOrId}`);
  }

  getSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.base}/pokemon-species/${nameOrId}`);
  }

  getEvolutionChain(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChain>(url);
  }

  /** Build a full PokemonDetail object */
  getPokemonDetail(name: string): Observable<PokemonDetail> {
    return forkJoin([this.getPokemon(name), this.getSpecies(name)]).pipe(
      map(([pokemon, species]) => this.buildDetail(pokemon, species))
    );
  }

  /** Load all evolutions of a Pokémon (excluding itself) */
  getEvolutions(baseName: string): Observable<PokemonDetail[]> {
    return this.getSpecies(baseName).pipe(
      switchMap(species => this.getEvolutionChain(species.evolution_chain.url)),
      map(chain => this.flattenChain(chain.chain).filter(n => n !== baseName)),
      switchMap(names =>
        names.length
          ? forkJoin(names.map(n => this.getPokemonDetail(n)))
          : new Observable<PokemonDetail[]>(obs => { obs.next([]); obs.complete(); })
      )
    );
  }

  // ── helpers ────────────────────────────────────────────────────

  buildDetail(pokemon: Pokemon, species: PokemonSpecies): PokemonDetail {
    const id = pokemon.id;
    const abilityName = pokemon.abilities.find(a => !a.is_hidden)?.ability.name
      ?? pokemon.abilities[0]?.ability.name
      ?? '—';

    const animatedImg =
      pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
      ?? '';

    const staticImg =
      pokemon.sprites.other?.['official-artwork']?.front_default
      ?? pokemon.sprites.front_default
      ?? '';

    const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

    return {
      pokemon,
      species,
      gender: this.getGender(species),
      category: this.getCategory(species),
      abilityName,
      animatedImg,
      staticImg,
      cryUrl
    };
  }

  getDisplayStats(pokemon: Pokemon) {
    return pokemon.stats.filter(s => DISPLAY_STATS.includes(s.stat.name));
  }

  private getGender(species: PokemonSpecies): string {
    const rate = species.gender_rate;
    if (rate === -1) return 'Asexuado';
    if (rate === 0)  return 'Solo ♂';
    if (rate === 8)  return 'Solo ♀';
    return '♂ / ♀';
  }

  private getCategory(species: PokemonSpecies): string {
    return species.genera?.find(g => g.language.name === 'en')?.genus ?? '—';
  }

  private flattenChain(link: EvoChainLink, list: string[] = []): string[] {
    list.push(link.species.name);
    link.evolves_to.forEach(e => this.flattenChain(e, list));
    return list;
  }
}

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PokeapiService } from '../../services/pokeapi.service';
import { PokemonListItem } from '../../models/pokemon.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private router = inject(Router);
  private api = inject(PokeapiService);

  query = signal('');
  allPokemon = signal<PokemonListItem[]>([]);
  results = signal<Array<PokemonListItem & { img: string }>>([]);
  loadingResults = signal(false);
  showDropdown = signal(false);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.api.getAllPokemon().subscribe(list => this.allPokemon.set(list));
  }

  onInput(value: string) {
    this.query.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (!value || value.length < 2) {
      this.results.set([]);
      this.showDropdown.set(false);
      return;
    }
    this.searchTimer = setTimeout(() => this.search(value.toLowerCase()), 220);
  }

  private search(q: string) {
    const matches = this.allPokemon()
      .filter(p => p.name.includes(q))
      .slice(0, 10);

    if (!matches.length) {
      this.results.set([]);
      this.showDropdown.set(false);
      return;
    }

    this.loadingResults.set(true);
    this.showDropdown.set(true);

    // Build results with static artwork img (no extra HTTP calls needed)
    const withImg = matches.map(p => ({
      ...p,
      img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`
    }));
    this.results.set(withImg);
    this.loadingResults.set(false);
  }

  select(name: string) {
    this.showDropdown.set(false);
    this.query.set('');
    this.router.navigate(['/pokemon', name]);
  }

  closeDropdown() {
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  padId(id: number): string {
    return String(id).padStart(3, '0');
  }
}

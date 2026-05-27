import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokeapiService } from '../../services/pokeapi.service';
import { EvolutionCardComponent } from '../evolution-card/evolution-card.component';
import { PokemonDetail, STAT_LABELS, STAT_COLORS, DISPLAY_STATS } from '../../models/pokemon.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, EvolutionCardComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(PokeapiService);

  detail = signal<PokemonDetail | null>(null);
  evolutions = signal<PokemonDetail[]>([]);
  loading = signal(true);
  error = signal(false);

  statLabels = STAT_LABELS;
  statColors = STAT_COLORS;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name') ?? '';
      this.load(name);
    });
  }

  private load(name: string) {
    this.loading.set(true);
    this.error.set(false);
    this.detail.set(null);
    this.evolutions.set([]);

    this.api.getPokemonDetail(name).subscribe({
      next: detail => {
        this.detail.set(detail);
        this.loading.set(false);
        this.loadEvolutions(name);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private loadEvolutions(name: string) {
    this.api.getEvolutions(name).subscribe({
      next: evos => this.evolutions.set(evos),
      error: () => this.evolutions.set([])
    });
  }

  get displayStats() {
    const d = this.detail();
    if (!d) return [];
    return d.pokemon.stats.filter(s => DISPLAY_STATS.includes(s.stat.name));
  }

  get types() {
    return this.detail()?.pokemon.types.map(t => t.type.name) ?? [];
  }

  get heightM(): string {
    const h = this.detail()?.pokemon.height ?? 0;
    return (h / 10).toFixed(1);
  }

  get weightKg(): string {
    const w = this.detail()?.pokemon.weight ?? 0;
    return (w / 10).toFixed(1);
  }

  statPct(val: number): number {
    return Math.min(100, Math.round((val / 255) * 100));
  }

  padId(id: number): string {
    return String(id).padStart(3, '0');
  }

  goBack() {
    this.router.navigate(['/']);
  }

  navigateTo(name: string) {
    this.router.navigate(['/pokemon', name]);
  }
}

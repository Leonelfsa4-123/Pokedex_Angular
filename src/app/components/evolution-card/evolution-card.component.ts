import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetail, STAT_LABELS, STAT_COLORS, DISPLAY_STATS } from '../../models/pokemon.model';

@Component({
  selector: 'app-evolution-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evolution-card.component.html',
  styleUrls: ['./evolution-card.component.css']
})
export class EvolutionCardComponent {
  @Input() detail!: PokemonDetail;
  @Output() navigate = new EventEmitter<string>();

  statLabels = STAT_LABELS;
  statColors = STAT_COLORS;

  get displayStats() {
    return this.detail.pokemon.stats.filter(s => DISPLAY_STATS.includes(s.stat.name));
  }

  get types() {
    return this.detail.pokemon.types.map(t => t.type.name);
  }

  statPct(val: number): number {
    return Math.min(100, Math.round((val / 255) * 100));
  }

  padId(id: number): string {
    return String(id).padStart(3, '0');
  }

  get heightM(): string {
    return (this.detail.pokemon.height / 10).toFixed(1);
  }

  get weightKg(): string {
    return (this.detail.pokemon.weight / 10).toFixed(1);
  }
}

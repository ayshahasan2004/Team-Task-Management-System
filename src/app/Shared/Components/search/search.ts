import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})
export class Search {
  readonly placeholder = input('Search...');

  readonly searchChanged = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }
}
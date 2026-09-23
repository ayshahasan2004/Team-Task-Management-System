import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})
export class Search {
  @Input() placeholder = 'Search...';

  @Output() searchChanged = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Member {
  id: string;
  name: string;
  initial: string;
  role: string;
  email: string;
  projectsCount: number;
  status: 'Online' | 'Offline';
}

@Component({
  imports: [CommonModule],
  selector: 'app-member-card',
  styleUrl: './member-card.css',
  templateUrl: './member-card.html',
})
export class MemberCard {
  @Input() member!: Member;

  @Output() cardClicked = new EventEmitter<string>();

  onCardClick() {
    this.cardClicked.emit(this.member.id);
  }
}
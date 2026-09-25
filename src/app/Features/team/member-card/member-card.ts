import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge, BadgeVariant } from '../../../Shared/Components/avatar/badge/badge';
import { Member } from '../../../Core/models/member.model';

@Component({
  standalone: true,
  imports: [CommonModule, Badge],
  selector: 'app-member-card',
  styleUrl: './member-card.css',
  templateUrl: './member-card.html',
})
export class MemberCard {
  @Input() member!: Member;

  @Output() cardClicked = new EventEmitter<string>();

  get statusVariant(): BadgeVariant {
    return this.member.status === 'Online' ? 'success' : 'neutral';
  }

  onCardClick() {
    this.cardClicked.emit(this.member.id);
  }
}
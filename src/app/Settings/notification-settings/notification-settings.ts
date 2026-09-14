import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-notification-settings',
  styleUrl: './notification-settings.css',
  templateUrl: './notification-settings.html',
})
export class NotificationSettings {
  // Phase 1 — local visual-only toggle state
  emailNotifications = true;
  pushNotifications = false;
}
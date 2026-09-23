import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SettingsUser {
  name: string;
  email: string;
  role: string;
  initial: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-profile-settings',
  styleUrl: './profile-settings.css',
  templateUrl: './profile-settings.html',
})
export class ProfileSettings {
  // Data comes down from parent (Settings)
  @Input() user!: SettingsUser;
}
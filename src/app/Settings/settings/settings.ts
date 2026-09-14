import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettings, SettingsUser } from '../profile-settings/profile-settings';
import { NotificationSettings } from '../notification-settings/notification-settings';
import { SecuritySettings } from '../security-settings/security-settings';

type SettingsTab = 'Profile' | 'Notifications' | 'Security';

@Component({
  imports: [CommonModule, ProfileSettings, NotificationSettings, SecuritySettings],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  // Phase 1 — tab switching is visual-only
  tabs: SettingsTab[] = ['Profile', 'Notifications', 'Security'];
  activeTab: SettingsTab = 'Profile';

  // Owned here, passed down to ProfileSettings via @Input()
  user: SettingsUser = {
    name: 'Aysha',
    email: 'aysha@taskflow.dev',
    role: 'Frontend Developer',
    initial: 'A',
  };

  selectTab(tab: SettingsTab) {
    this.activeTab = tab;
  }
}
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettings, SettingsUser } from '../profile-settings/profile-settings';
import { NotificationSettings } from '../notification-settings/notification-settings';
import { SecuritySettings } from '../security-settings/security-settings';
import { MemberService } from '../../../Core/services/member.service';

type SettingsTab = 'Profile' | 'Notifications' | 'Security';

@Component({
  standalone: true,
  imports: [CommonModule, ProfileSettings, NotificationSettings, SecuritySettings],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  private memberService = inject(MemberService);
  // Phase 1 — tab switching is visual-only
  tabs: SettingsTab[] = ['Profile', 'Notifications', 'Security'];
  activeTab: SettingsTab = 'Profile';

  user = computed<SettingsUser>(() => {
    const member = this.memberService.getById('m1');
    return {
      name: member?.name ?? 'Team member',
      email: member?.email ?? '',
      role: member?.role ?? 'Team member',
      initial: member?.initial ?? '?',
    };
  });

  selectTab(tab: SettingsTab) {
    this.activeTab = tab;
  }
}
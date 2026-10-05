import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../../Core/services/member.service';
import { ActivityService } from '../../../Core/services/activity.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-activity-list',
  styleUrl: './activity-list.css',
  templateUrl: './activity-list.html',
})
export class ActivityList {
  private memberService = inject(MemberService);
  private activityService = inject(ActivityService);

  activities = computed(() =>
    this.activityService.activitiesWithTime().map(activity => {
      const member = this.memberService.getById(activity.memberId);
      const memberName = activity.memberName?.trim() || member?.name || 'A team member';
      const memberInitial = member?.initial ?? (activity.memberName
        ? activity.memberName.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase()
        : '?');

      return { ...activity, memberName, memberInitial };
    }),
  );
}

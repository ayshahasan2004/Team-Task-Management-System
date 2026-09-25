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

  activities = computed(() => this.activityService.activities().map(activity => ({
    ...activity,
    member: this.memberService.getById(activity.memberId),
  })));
}

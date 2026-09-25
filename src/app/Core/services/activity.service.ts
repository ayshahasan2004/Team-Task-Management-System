import { Injectable, signal } from '@angular/core';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly _activities = signal<Activity[]>(MOCK_ACTIVITIES);
  readonly activities = this._activities.asReadonly();

  add(memberId: string, text: string): void {
    const activity: Activity = {
      id: crypto.randomUUID(),
      memberId,
      text,
      time: 'Just now',
      createdAt: new Date(),
    };

    this._activities.update(activities => [activity, ...activities]);
  }
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'activity-1', memberId: 'm1', text: 'completed task "Update login UI"', time: '10m ago', createdAt: new Date() },
  { id: 'activity-2', memberId: 'm5', text: 'added a comment on "API Migration"', time: '32m ago', createdAt: new Date() },
  { id: 'activity-3', memberId: 'm2', text: 'created project "Marketing Campaign"', time: '1h ago', createdAt: new Date() },
];

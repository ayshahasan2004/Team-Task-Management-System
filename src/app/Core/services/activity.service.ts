import { Injectable, computed, signal } from '@angular/core';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly _activities = signal<Activity[]>(MOCK_ACTIVITIES);
  readonly activities = this._activities.asReadonly();

  add(memberId: string, text: string): void {
    const createdAt = new Date();
    const activity: Activity = {
      id: crypto.randomUUID(),
      memberId,
      text,
      time: formatRelativeTime(createdAt),
      createdAt,
    };

    this._activities.update(activities => [activity, ...activities]);
  }

  /** Recomputes each entry's label from createdAt, so it stays truthful over time. */
  readonly activitiesWithTime = computed(() =>
    this._activities().map(activity => ({
      ...activity,
      time: formatRelativeTime(activity.createdAt),
    })),
  );
}

// Turns a timestamp into a short human label like "just now" / "10m ago" / "2h ago".
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'activity-1', memberId: 'm1', text: 'completed task "Update login UI"', time: '10m ago', createdAt: new Date() },
  { id: 'activity-2', memberId: 'm5', text: 'added a comment on "API Migration"', time: '32m ago', createdAt: new Date() },
  { id: 'activity-3', memberId: 'm2', text: 'created project "Marketing Campaign"', time: '1h ago', createdAt: new Date() },
];

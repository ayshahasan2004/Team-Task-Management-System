import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import { Activity } from '../models/activity.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface BackendActivity {
  id: string;
  memberId: string;
  memberName?: string | null;
  text: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly _activities = signal<Activity[]>([]);
  readonly activities = this._activities.asReadonly();

  constructor() {
    effect(() => {
      const token = this.authService.token();
      if (!token) {
        this._activities.set([]);
        return;
      }

      this.refresh().subscribe({
        error: () => this._activities.set([]),
      });
    });
  }

  refresh(): Observable<Activity[]> {
    return this.http.get<BackendActivity[]>(`${environment.coreApiUrl}/activity`).pipe(
      map(items => items.map(item => this.toActivity(item))),
      tap(items => this._activities.set(items))
    );
  }

  add(memberId: string, text: string): void {
    const currentUser = this.authService.currentUser();
    const actorId = currentUser?.userId ?? memberId;
    const actorName = currentUser?.fullName ?? null;
    const createdAt = new Date();
    const activity: Activity = {
      id: crypto.randomUUID(),
      memberId: actorId,
      memberName: actorName,
      text,
      time: formatRelativeTime(createdAt),
      createdAt,
    };

    this._activities.update(activities => [activity, ...activities]);

    this.http.post<BackendActivity>(`${environment.coreApiUrl}/activity`, {
      memberId: actorId,
      memberName: actorName,
      text,
    }).pipe(
      map(item => this.toActivity(item)),
      tap(saved => {
        this._activities.update(activities => [saved, ...activities.filter(a => a.id !== activity.id)]);
      })
    ).subscribe({
      error: () => {
        this._activities.update(activities => [activity, ...activities.filter(a => a.id !== activity.id)]);
      },
    });
  }

  /** Recomputes each entry's label from createdAt, so it stays truthful over time. */
  readonly activitiesWithTime = computed(() =>
    this._activities().map(activity => ({
      ...activity,
      time: formatRelativeTime(activity.createdAt),
    })),
  );

  private toActivity(item: BackendActivity): Activity {
    return {
      id: item.id,
      memberId: item.memberId,
      memberName: item.memberName ?? null,
      text: item.text,
      time: formatRelativeTime(new Date(item.createdAt)),
      createdAt: new Date(item.createdAt),
    };
  }
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


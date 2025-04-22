import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification>({
    message: '',
    type: 'info',
    visible: false
  });

  notification$: Observable<Notification> = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.notificationSubject.next({
      message,
      type,
      visible: true
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide(): void {
    const current = this.notificationSubject.value;
    this.notificationSubject.next({
      ...current,
      visible: false
    });
  }
}
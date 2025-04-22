import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="(notification$ | async)?.visible"
      class="notification"
      [class.success]="(notification$ | async)?.type === 'success'"
      [class.error]="(notification$ | async)?.type === 'error'"
      [class.info]="(notification$ | async)?.type === 'info'">
      <div class="notification-content">
        <span class="message">{{ (notification$ | async)?.message }}</span>
        <button class="close-button" (click)="closeNotification()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      z-index: 1000;
      min-width: 300px;
      max-width: calc(100% - 48px);
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .success {
      background-color: #10B981;
      color: white;
    }

    .error {
      background-color: #EF4444;
      color: white;
    }

    .info {
      background-color: #3B82F6;
      color: white;
    }

    .message {
      font-weight: 500;
    }

    .close-button {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      margin-left: 16px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .close-button:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notification {
        bottom: 16px;
        right: 16px;
        left: 16px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notification$!: Observable<Notification>;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notification$ = this.notificationService.notification$;
  }

  closeNotification(): void {
    this.notificationService.hide();
  }
}
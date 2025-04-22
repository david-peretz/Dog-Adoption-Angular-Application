import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogsService } from './services/dogs.service';
import { SearchTabComponent } from './components/search-tab/search-tab.component';
import { RequestTabComponent } from './components/request-tab/request-tab.component';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchTabComponent,
    RequestTabComponent,
    NotificationComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>Dog Adoption Center</h1>
        <p>Find your perfect companion</p>
      </header>

      <div class="tabs">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'search'"
          (click)="setActiveTab('search')">
          Search Dogs
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'request'"
          (click)="setActiveTab('request')">
          Adoption Request
        </button>
      </div>

      <main>
        <app-search-tab *ngIf="activeTab === 'search'"></app-search-tab>
        <app-request-tab *ngIf="activeTab === 'request'"></app-request-tab>
      </main>

      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    header {
      text-align: center;
      margin-bottom: 32px;
      padding: 24px 0;
      border-bottom: 1px solid #eaeaea;
    }

    header h1 {
      color: #3B82F6;
      margin: 0;
      font-size: 2.5rem;
      line-height: 1.2;
    }

    header p {
      color: #666;
      margin-top: 8px;
      font-size: 1.2rem;
    }

    .tabs {
      display: flex;
      margin-bottom: 24px;
      border-bottom: 1px solid #eaeaea;
    }

    .tab-button {
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: 500;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: #3B82F6;
    }

    .tab-button.active {
      color: #3B82F6;
      border-bottom: 2px solid #3B82F6;
    }

    main {
      min-height: 400px;
    }

    @media (max-width: 768px) {
      .tabs {
        flex-direction: column;
      }

      .tab-button {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #eaeaea;
      }

      .tab-button.active {
        border-bottom: 2px solid #3B82F6;
      }
    }
  `]
})
export class App {
  activeTab: 'search' | 'request' = 'search';

  constructor(private dogsService: DogsService, private notificationService: NotificationService) {}

  setActiveTab(tab: 'search' | 'request'): void {
    this.activeTab = tab;
  }
}
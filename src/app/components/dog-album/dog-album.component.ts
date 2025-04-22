import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dog-album',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="album-container">
      <h2>Dog Gallery</h2>
      <div class="image-grid">
        <div class="image-card" *ngFor="let image of images">
          <div class="image-wrapper">
            <img [src]="image" alt="Dog image" class="dog-image" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .album-container {
      margin-top: 16px;
    }

    h2 {
      margin-bottom: 16px;
      color: #374151;
      font-weight: 600;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .image-card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .image-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    }

    .image-wrapper {
      aspect-ratio: 1 / 1;
      overflow: hidden;
    }

    .dog-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-card:hover .dog-image {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .image-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }

    @media (max-width: 480px) {
      .image-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  `]
})
export class DogAlbumComponent {
  @Input() images: string[] = [];
}
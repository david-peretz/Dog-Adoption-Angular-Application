import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DogsService } from '../../services/dogs.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DogAlbumComponent } from '../dog-album/dog-album.component';

@Component({
  selector: 'app-search-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DogAlbumComponent
  ],
  template: `
    <div class="search-container">
      <form [formGroup]="searchForm" class="search-form">
        <div class="form-group">
          <label for="breed">Select Breed (with sub-breeds)</label>
          <select id="breed" formControlName="breed" class="form-control">
            <option value="">Select a breed</option>
            <option *ngFor="let breed of breeds" [value]="breed">
              {{ breed | titlecase }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="count">Number of Dogs (1-50)</label>
          <input 
            type="number" 
            id="count" 
            formControlName="count" 
            class="form-control"
            min="1"
            max="50">
          <div class="error-message" *ngIf="searchForm.get('count')?.invalid && searchForm.get('count')?.touched">
            Please enter a number between 1 and 50.
          </div>
        </div>
      </form>

      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Fetching dogs...</p>
      </div>

      <app-dog-album 
        *ngIf="!isLoading && dogImages.length > 0" 
        [images]="dogImages">
      </app-dog-album>

      <div class="no-results" *ngIf="!isLoading && dogImages.length === 0 && searchForm.get('breed')?.value">
        <p>No dogs found for the selected breed. Please try another breed.</p>
      </div>

      <div class="instructions" *ngIf="!isLoading && !searchForm.get('breed')?.value">
        <p>Select a breed and the number of dogs to see images from our collection.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .search-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      flex: 1;
      min-width: 250px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      border-color: #3B82F6;
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .error-message {
      color: #EF4444;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(59, 130, 246, 0.1);
      border-radius: 50%;
      border-top-color: #3B82F6;
      animation: spin 1s linear infinite;
    }

    .no-results, .instructions {
      text-align: center;
      padding: 32px;
      background-color: #f9fafb;
      border-radius: 8px;
      color: #6b7280;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .search-form {
        flex-direction: column;
      }
    }
  `]
})
export class SearchTabComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  breeds: string[] = [];
  dogImages: string[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dogsService: DogsService
  ) {
    this.searchForm = this.fb.group({
      breed: ['', Validators.required],
      count: [10, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to breeds list
    this.dogsService.breedsWithSubBreeds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(breeds => {
        this.breeds = breeds;
      });

    // Listen for form changes and fetch images
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => 
          JSON.stringify(prev) === JSON.stringify(curr)
        ),
        switchMap(formValue => {
          if (this.searchForm.valid && formValue.breed) {
            this.isLoading = true;
            return this.dogsService.getBreedImages(formValue.breed, formValue.count);
          }
          return [];
        })
      )
      .subscribe({
        next: (images) => {
          this.dogImages = images;
          this.isLoading = false;
        },
        error: () => {
          this.dogImages = [];
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
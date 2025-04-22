import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DOG_COLORS } from '../../models/adoption-request.model';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-request-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="request-container">
      <h2>Dog Adoption Request Form</h2>
      <p class="form-description">Fill out this form to submit your request for dog adoption.</p>

      <form [formGroup]="adoptionForm" (ngSubmit)="onSubmit()" class="adoption-form">
        <div class="form-group">
          <label for="weight">Weight (kg)</label>
          <input 
            type="number" 
            id="weight" 
            formControlName="weight" 
            class="form-control"
            [class.error]="isFieldInvalid('weight')">
          <div class="error-message" *ngIf="isFieldInvalid('weight')">
            <span *ngIf="adoptionForm.get('weight')?.errors?.['required']">
              Weight is required.
            </span>
            <span *ngIf="adoptionForm.get('weight')?.errors?.['min'] || adoptionForm.get('weight')?.errors?.['max']">
              Weight must be between 1 and 100 kg.
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="color">Color</label>
          <select 
            id="color" 
            formControlName="color" 
            class="form-control"
            [class.error]="isFieldInvalid('color')">
            <option value="">Select a color</option>
            <option *ngFor="let color of dogColors" [value]="color">
              {{ color }}
            </option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('color')">
            Color is required.
          </div>
        </div>

        <div class="form-group checkbox-group">
          <div class="checkbox-wrapper">
            <input 
              type="checkbox" 
              id="isFirstAdoption" 
              formControlName="isFirstAdoption">
            <label for="isFirstAdoption" class="checkbox-label">Is this your first adoption?</label>
          </div>
        </div>

        <div class="form-group">
          <label for="age">Age (years)</label>
          <input 
            type="number" 
            id="age" 
            formControlName="age" 
            class="form-control"
            [class.error]="isFieldInvalid('age')">
          <div class="error-message" *ngIf="isFieldInvalid('age')">
            <span *ngIf="adoptionForm.get('age')?.errors?.['required']">
              Age is required.
            </span>
            <span *ngIf="adoptionForm.get('age')?.errors?.['min'] || adoptionForm.get('age')?.errors?.['max']">
              <ng-container *ngIf="adoptionForm.get('isFirstAdoption')?.value; else normalAgeRange">
                For first-time adopters, age must be between 0 and 8 years.
              </ng-container>
              <ng-template #normalAgeRange>
                Age must be between 0 and 20 years.
              </ng-template>
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="submit-button" 
            [disabled]="adoptionForm.invalid || isSubmitting">
            <span *ngIf="!isSubmitting">Submit Adoption Request</span>
            <span *ngIf="isSubmitting" class="button-spinner"></span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .request-container {
      max-width: 600px;
      margin: 0 auto;
    }

    h2 {
      color: #374151;
      margin-bottom: 8px;
    }

    .form-description {
      color: #6b7280;
      margin-bottom: 24px;
    }

    .adoption-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
      background-color: #f9fafb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 8px;
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
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #3B82F6;
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.error {
      border-color: #EF4444;
    }

    .error-message {
      color: #EF4444;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .checkbox-group {
      margin: 8px 0;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
    }

    input[type="checkbox"] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
    }

    .checkbox-label {
      margin-bottom: 0;
    }

    .form-actions {
      margin-top: 16px;
    }

    .submit-button {
      width: 100%;
      padding: 12px;
      background-color: #3B82F6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .submit-button:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }

    .button-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .adoption-form {
        padding: 16px;
      }
    }
  `]
})
export class RequestTabComponent implements OnDestroy {
  adoptionForm: FormGroup;
  dogColors = DOG_COLORS;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.adoptionForm = this.fb.group({
      weight: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      color: ['', Validators.required],
      isFirstAdoption: [false],
      age: [null, [Validators.required, Validators.min(0), Validators.max(20)]]
    });

    // Listen for changes to isFirstAdoption to update age validation
    this.adoptionForm.get('isFirstAdoption')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(isFirstAdoption => {
        const ageControl = this.adoptionForm.get('age');
        if (ageControl) {
          const maxAge = isFirstAdoption ? 8 : 20;
          ageControl.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(maxAge)
          ]);
          ageControl.updateValueAndValidity();
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adoptionForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit(): void {
    if (this.adoptionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate API call with a 2-second delay
      setTimeout(() => {
        this.notificationService.show(
          'Your adoption request has been registered in the system.',
          'success'
        );
        this.adoptionForm.reset({
          isFirstAdoption: false
        });
        this.isSubmitting = false;
      }, 2000);
    } else {
      // Mark all fields as touched to trigger validation
      Object.keys(this.adoptionForm.controls).forEach(key => {
        const control = this.adoptionForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
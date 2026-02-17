import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Custom validator for password confirmation matching.
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  return null;
}

/**
 * Registration component with reactive form validation and modern UI.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <div class="glass-card register-card">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Join us today and get started</p>
        </div>
        
        @if (authService.error()) {
          <div class="error-message">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ authService.error() }}</span>
          </div>
        }
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-field mb-4">
              <label for="firstName">First Name</label>
              <input 
                pInputText 
                id="firstName" 
                type="text" 
                formControlName="firstName" 
                class="w-full"
                placeholder="John"
              />
            </div>
            
            <div class="form-field mb-4">
              <label for="lastName">Last Name</label>
              <input 
                pInputText 
                id="lastName" 
                type="text" 
                formControlName="lastName" 
                class="w-full"
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div class="form-field mb-4">
            <label for="email">Email Address</label>
            <input 
              pInputText 
              id="email" 
              type="email" 
              formControlName="email" 
              class="w-full"
              [class.ng-invalid]="isFieldInvalid('email')"
              placeholder="name@example.com"
            />
            
            @if (isFieldInvalid('email')) {
              <small class="error-text">
                @if (registerForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (registerForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </small>
            }
          </div>
          
          <div class="form-field mb-4">
            <label for="password">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true"
              [feedback]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="isFieldInvalid('password')"
              placeholder="••••••••"
            />
            
            @if (isFieldInvalid('password')) {
              <small class="error-text">
                @if (registerForm.get('password')?.errors?.['required']) {
                  Password is required
                } @else if (registerForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 8 characters
                }
              </small>
            }
          </div>
          
          <div class="form-field mb-4">
            <label for="confirmPassword">Confirm Password</label>
            <p-password 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="isFieldInvalid('confirmPassword')"
              placeholder="••••••••"
            />
            
            @if (isFieldInvalid('confirmPassword')) {
              <small class="error-text">
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  Please confirm your password
                } @else if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  Passwords do not match
                }
              </small>
            }
          </div>
          
          <div class="action-buttons mt-6">
            <p-button 
              type="submit" 
              label="Create Account" 
              icon="pi pi-user-plus"
              styleClass="w-full"
              [loading]="authService.isLoading()"
              [disabled]="registerForm.invalid || authService.isLoading()"
            />
          </div>
        </form>
        
        <div class="divider-container">
          <p-divider align="center">
            <span class="divider-text">or</span>
          </p-divider>
        </div>
        
        <div class="login-link text-center">
          <span>Already have an account?</span>
          <a routerLink="/auth/login" class="highlight-link">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    
    .register-card {
      width: 100%;
      max-width: 520px;
      padding: 3.5rem 2.5rem;
      animation: fadeIn 0.6s ease-out;
      border-radius: 20px;
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 2.5rem;
      
      h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #fff 0%, #9ca3af 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      p {
        color: var(--text-muted);
        font-size: 1.05rem;
      }
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      margin-bottom: 2rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      color: #fca5a5;
      font-size: 0.95rem;
      
      i { font-size: 1.25rem; }
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .form-field {
      position: relative;
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
    
    .error-text {
      display: block;
      margin-top: 0.4rem;
      margin-left: 0.25rem;
      color: #ef4444;
      font-size: 0.85rem;
    }
    
    .divider-container {
      margin: 2.5rem 0;
      
      .divider-text {
        color: var(--text-muted);
        font-size: 0.9rem;
        background: transparent;
        padding: 0 0.5rem;
      }
    }
    
    .login-link {
      color: var(--text-muted);
      font-size: 0.95rem;
      
      .highlight-link {
        color: var(--primary-color);
        font-weight: 600;
        margin-left: 0.5rem;
        
        &:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
      }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 480px) {
      .register-card { padding: 2rem 1.5rem; }
      .register-header h1 { font-size: 2rem; }
      .form-row { grid-template-columns: 1fr; gap: 0; }
    }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  registerForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...request } = this.registerForm.value;
      this.authService.register(request).subscribe({
        next: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

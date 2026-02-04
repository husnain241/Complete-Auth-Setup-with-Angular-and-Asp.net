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
 * Registration component with reactive form validation.
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
      <div class="register-card">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Join us today and get started</p>
        </div>
        
        @if (authService.error()) {
          <div class="error-message">
            <i class="pi pi-exclamation-circle"></i>
            {{ authService.error() }}
          </div>
        }
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-field">
              <label for="firstName">First Name</label>
              <p-iconfield>
                <p-inputicon styleClass="pi pi-user" />
                <input 
                  pInputText 
                  id="firstName" 
                  type="text" 
                  formControlName="firstName" 
                  placeholder="John"
                />
              </p-iconfield>
            </div>
            
            <div class="form-field">
              <label for="lastName">Last Name</label>
              <p-iconfield>
                <p-inputicon styleClass="pi pi-user" />
                <input 
                  pInputText 
                  id="lastName" 
                  type="text" 
                  formControlName="lastName" 
                  placeholder="Doe"
                />
              </p-iconfield>
            </div>
          </div>
          
          <div class="form-field">
            <label for="email">Email</label>
            <p-iconfield>
              <p-inputicon styleClass="pi pi-envelope" />
              <input 
                pInputText 
                id="email" 
                type="email" 
                formControlName="email" 
                placeholder="john.doe@example.com"
                [class.ng-invalid]="isFieldInvalid('email')"
              />
            </p-iconfield>
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
          
          <div class="form-field">
            <label for="password">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              placeholder="Create a strong password"
              [toggleMask]="true"
              [feedback]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
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
          
          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <p-password 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              placeholder="Confirm your password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
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
          
          <p-button 
            type="submit" 
            label="Create Account" 
            icon="pi pi-user-plus"
            styleClass="w-full register-button"
            [loading]="authService.isLoading()"
            [disabled]="registerForm.invalid || authService.isLoading()"
          />
        </form>
        
        <p-divider align="center">
          <span class="divider-text">or</span>
        </p-divider>
        
        <div class="login-link">
          <span>Already have an account?</span>
          <a routerLink="/auth/login">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    }
    
    .register-card {
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(90deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        color: #a0aec0;
        font-size: 0.95rem;
      }
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      color: #f87171;
      font-size: 0.9rem;
      
      i {
        font-size: 1.1rem;
      }
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-field {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #e2e8f0;
        font-size: 0.9rem;
      }
      
      :host ::ng-deep {
        .p-inputtext, .p-password input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          
          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
          }
          
          &.ng-invalid.ng-touched {
            border-color: #ef4444;
          }
        }
        
        .p-iconfield {
          width: 100%;
        }
      }
    }
    
    .error-text {
      display: block;
      margin-top: 0.5rem;
      color: #f87171;
      font-size: 0.8rem;
    }
    
    :host ::ng-deep .register-button {
      margin-top: 0.5rem;
      
      .p-button {
        background: linear-gradient(90deg, #667eea, #764ba2);
        border: none;
        padding: 0.875rem;
        font-weight: 600;
        
        &:hover:not(:disabled) {
          background: linear-gradient(90deg, #764ba2, #667eea);
        }
      }
    }
    
    .divider-text {
      color: #64748b;
      font-size: 0.875rem;
    }
    
    .login-link {
      text-align: center;
      color: #a0aec0;
      font-size: 0.9rem;
      
      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        margin-left: 0.25rem;
        
        &:hover {
          text-decoration: underline;
        }
      }
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
    return !!(control?.invalid && control?.touched);
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

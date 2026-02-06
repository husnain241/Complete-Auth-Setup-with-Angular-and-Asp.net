import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FloatLabelModule } from 'primeng/floatlabel';

/**
 * Login component with reactive form validation and modern UI.
 */
@Component({
  selector: 'app-login',
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
    ProgressSpinnerModule,
    FloatLabelModule
  ],
  template: `
    <div class="login-container">
      <div class="glass-card login-card">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>
        
        @if (authService.error()) {
          <div class="error-message">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ authService.error() }}</span>
          </div>
        }
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div class="form-field mb-4">
            <p-floatLabel>
              <input 
                pInputText 
                id="email" 
                type="email" 
                formControlName="email" 
                class="w-full"
                [class.ng-invalid]="isFieldInvalid('email')"
              />
              <label for="email">Email Address</label>
            </p-floatLabel>
            
            @if (isFieldInvalid('email')) {
              <small class="error-text">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </small>
            }
          </div>
          
          <div class="form-field mb-4">
            <p-floatLabel>
              <p-password 
                id="password" 
                formControlName="password" 
                [toggleMask]="true"
                [feedback]="false"
                styleClass="w-full"
                inputStyleClass="w-full"
                [class.ng-invalid]="isFieldInvalid('password')"
              />
              <label for="password">Password</label>
            </p-floatLabel>
            
            @if (isFieldInvalid('password')) {
              <small class="error-text">
                @if (loginForm.get('password')?.errors?.['required']) {
                  Password is required
                } @else if (loginForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 8 characters
                }
              </small>
            }
          </div>
          
          <div class="action-buttons mt-4">
            <p-button 
              type="submit" 
              label="Sign In" 
              icon="pi pi-sign-in"
              styleClass="w-full"
              [loading]="authService.isLoading()"
              [disabled]="loginForm.invalid || authService.isLoading()"
            />
          </div>
        </form>
        
        <div class="divider-container">
          <p-divider align="center">
            <span class="divider-text">or</span>
          </p-divider>
        </div>
        
        <div class="register-link text-center">
          <span>Don't have an account?</span>
          <a routerLink="/auth/register" class="highlight-link">Create one</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      /* Background handled globally, but ensuring container placement */
    }
    
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 3rem 2.5rem;
      animation: fadeIn 0.6s ease-out;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
      
      h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        letter-spacing: -0.025em;
        background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      p {
        color: var(--text-muted);
        font-size: 1rem;
      }
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      margin-bottom: 2rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #fca5a5;
      font-size: 0.95rem;
      
      i {
        font-size: 1.25rem;
      }
    }
    
    .form-field {
      position: relative;
    }
    
    .error-text {
      display: block;
      margin-top: 0.25rem;
      margin-left: 0.25rem;
      color: #fca5a5;
      font-size: 0.85rem;
    }
    
    .divider-container {
      margin: 2rem 0;
      
      .divider-text {
        color: var(--text-muted);
        font-size: 0.9rem;
        background: transparent; 
        padding: 0 0.5rem;
      }
    }
    
    .register-link {
      color: var(--text-muted);
      font-size: 0.95rem;
      
      .highlight-link {
        color: #818cf8;
        font-weight: 600;
        margin-left: 0.5rem;
        transition: color 0.2s;
        
        &:hover {
          color: #a5b4fc;
          text-decoration: underline;
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Responsive details */
    @media (max-width: 480px) {
      .login-card {
        padding: 2rem 1.5rem;
      }
      
      .login-header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

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
import { SignalrService } from '../../../core/services/signalr';

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
    ProgressSpinnerModule
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
            <label for="email" class="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
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
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </small>
            }
          </div>
          
          <div class="form-field mb-4">
            <label for="password" class="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="isFieldInvalid('password')"
              placeholder="••••••••"
            />
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
          
          <div class="action-buttons mt-6">
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
    }
    
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 3.5rem 2.5rem;
      animation: fadeIn 0.6s ease-out;
      border-radius: 20px;
    }
    
    .login-header {
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
    
    .register-link {
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
      .login-card { padding: 2rem 1.5rem; }
      .login-header h1 { font-size: 2rem; }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly authService = inject(AuthService);
  private readonly signalrService = inject(SignalrService);

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
        next: (response) => {
          // 2. Navigation se pehle Connection start karein
          this.signalrService.startConnection();
          // Check for redirect URL from query params first
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];

          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            // Role-based redirection
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

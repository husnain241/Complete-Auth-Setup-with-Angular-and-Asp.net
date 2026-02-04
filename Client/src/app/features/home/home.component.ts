import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/**
 * Home page component - displays landing content.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            Secure Authentication
            <span class="gradient-text">Made Simple</span>
          </h1>
          <p class="hero-subtitle">
            Enterprise-grade authentication system built with ASP.NET Core 10 and Angular 21.
            Featuring JWT tokens, refresh token rotation, and role-based access control.
          </p>
          
          @if (!authService.isAuthenticated()) {
            <div class="hero-actions">
              <a routerLink="/auth/register">
                <p-button 
                  label="Get Started" 
                  icon="pi pi-arrow-right" 
                  iconPos="right"
                  styleClass="hero-button primary"
                />
              </a>
              <a routerLink="/auth/login">
                <p-button 
                  label="Sign In" 
                  icon="pi pi-sign-in"
                  severity="secondary"
                  [outlined]="true"
                  styleClass="hero-button"
                />
              </a>
            </div>
          } @else {
            <div class="welcome-section">
              <p class="welcome-text">
                Welcome back, <strong>{{ authService.currentUser()?.firstName || authService.currentUser()?.email }}</strong>!
              </p>
              @if (authService.isAdmin()) {
                <a routerLink="/admin">
                  <p-button 
                    label="Go to Admin Dashboard" 
                    icon="pi pi-shield"
                    styleClass="hero-button primary"
                  />
                </a>
              }
            </div>
          }
        </div>
        
        <div class="hero-visual">
          <div class="visual-card">
            <div class="card-header">
              <div class="dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="card-title">auth.service.ts</span>
            </div>
            <pre class="code-preview"><code>&#64;Injectable()
export class AuthService &#123;
  private readonly _currentUser = 
    signal&lt;User | null&gt;(null);
  
  public readonly isAuthenticated = 
    computed(() => !!this._currentUser());
  
  login(request: LoginRequest) &#123;
    return this.http.post('/api/auth/login');
  &#125;
&#125;</code></pre>
          </div>
        </div>
      </section>
      
      <section class="features">
        <h2 class="section-title">Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>JWT Authentication</h3>
            <p>Secure token-based authentication with 15-minute access tokens and automatic refresh.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Token Rotation</h3>
            <p>Refresh tokens are rotated on each use for enhanced security and protection.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Role-Based Access</h3>
            <p>Granular access control with Admin and User roles for route protection.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Angular Signals</h3>
            <p>Modern reactive state management using Angular's new Signals API.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
    }
    
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      padding: 4rem;
      max-width: 1400px;
      margin: 0 auto;
      align-items: center;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      
      .gradient-text {
        display: block;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: #a0aec0;
      line-height: 1.7;
      margin-bottom: 2rem;
      max-width: 540px;
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
      
      @media (max-width: 1024px) {
        justify-content: center;
      }
    }
    
    :host ::ng-deep .hero-button {
      &.primary .p-button {
        background: linear-gradient(90deg, #667eea, #764ba2);
        border: none;
        padding: 0.875rem 1.5rem;
        font-weight: 600;
        
        &:hover {
          background: linear-gradient(90deg, #764ba2, #667eea);
        }
      }
      
      .p-button-outlined {
        border-color: rgba(102, 126, 234, 0.5);
        color: #667eea;
        
        &:hover {
          background: rgba(102, 126, 234, 0.1);
        }
      }
    }
    
    .welcome-section {
      .welcome-text {
        font-size: 1.25rem;
        color: #e2e8f0;
        margin-bottom: 1.5rem;
        
        strong {
          color: #667eea;
        }
      }
    }
    
    .hero-visual {
      @media (max-width: 1024px) {
        display: none;
      }
    }
    
    .visual-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .dots {
        display: flex;
        gap: 0.5rem;
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          
          &.red { background: #ef4444; }
          &.yellow { background: #eab308; }
          &.green { background: #22c55e; }
        }
      }
      
      .card-title {
        color: #64748b;
        font-size: 0.85rem;
      }
      
      .code-preview {
        padding: 1.5rem;
        margin: 0;
        
        code {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.9rem;
          color: #e2e8f0;
          line-height: 1.6;
        }
      }
    }
    
    .features {
      padding: 4rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .section-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 3rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .feature-card {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: transform 0.2s, border-color 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        border-color: rgba(102, 126, 234, 0.3);
      }
      
      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #fff;
        margin-bottom: 0.75rem;
      }
      
      p {
        color: #a0aec0;
        line-height: 1.6;
      }
    }
  `]
})
export class HomeComponent {
  public readonly authService = inject(AuthService);
}

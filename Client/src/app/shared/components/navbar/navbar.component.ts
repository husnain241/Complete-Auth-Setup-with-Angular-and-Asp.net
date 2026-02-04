import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

/**
 * Navigation bar component with user authentication state display.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MenubarModule, ButtonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">
          <span class="brand-icon">🔐</span>
          <span class="brand-text">AuthSystem</span>
        </a>
      </div>
      
      <div class="navbar-menu">
        @if (authService.isAuthenticated()) {
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            Home
          </a>
          
          @if (authService.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">
              Admin Dashboard
            </a>
          }
          
          <div class="user-section">
            <span class="user-greeting">
              Hello, {{ authService.currentUser()?.firstName || authService.currentUser()?.email }}
            </span>
            <p-button 
              label="Logout" 
              icon="pi pi-sign-out" 
              severity="secondary"
              [text]="true"
              (onClick)="authService.logout()" 
            />
          </div>
        } @else {
          <a routerLink="/auth/login" routerLinkActive="active" class="nav-link">
            Login
          </a>
          <a routerLink="/auth/register" routerLinkActive="active" class="nav-link">
            <p-button label="Get Started" icon="pi pi-user-plus" severity="primary" />
          </a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar-brand {
      .brand-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        
        .brand-icon {
          font-size: 1.5rem;
        }
        
        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(90deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .nav-link {
      color: #a0aec0;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      
      &:hover, &.active {
        color: #667eea;
      }
    }
    
    .admin-link {
      color: #ffd700;
      
      &:hover, &.active {
        color: #ffed4a;
      }
    }
    
    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      
      .user-greeting {
        color: #e2e8f0;
        font-weight: 500;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public readonly authService: AuthService) { }
}

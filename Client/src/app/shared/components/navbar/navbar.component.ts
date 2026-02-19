import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

/**
 * Navigation bar component with a modern tech-shop design.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MenubarModule, ButtonModule, InputTextModule],
  template: `
    <nav class="navbar glass-panel">
      <!-- Logo Section -->
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">
          <i class="pi pi-mobile brand-icon"></i>
          <span class="brand-text">Tech<span class="highlight">Zone</span></span>
        </a>
      </div>
      
      <!-- Search Bar (Desktop) -->
      <div class="navbar-search">
        <div class="search-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input type="text" pInputText placeholder="Search for phones, accessories..." />
        </div>
      </div>

      <!-- Actions Section -->
      <div class="navbar-actions">
        <!-- Cart Icon -->
        <button pButton icon="pi pi-shopping-cart" class="p-button-text p-button-rounded action-btn" badge="2"></button>

        @if (authService.isAuthenticated()) {
          <!-- User Menu -->
          <div class="user-menu">
             <span class="user-greeting">Hi, {{ authService.currentUser()?.firstName }}</span>
             <button pButton icon="pi pi-user" class="p-button-rounded p-button-outlined action-btn"></button>
             <button pButton icon="pi pi-sign-out" class="p-button-text p-button-danger action-btn" (click)="authService.logout()"></button>
          </div>
        } @else {
          <!-- Auth Buttons -->
           <div class="auth-buttons">
            <a routerLink="/auth/login">
              <button pButton label="Login" class="p-button-text"></button>
            </a>
            <a routerLink="/auth/register">
              <button pButton label="Register" class="p-button-rounded"></button>
            </a>
           </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2.5rem;
      position: sticky;
      top: 1.5rem;
      z-index: 1000;
      margin: 0 2rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(10, 15, 30, 0.7);
      backdrop-filter: blur(16px);
    }
    
    .navbar-brand .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
      
      .brand-icon {
        font-size: 1.75rem;
        color: var(--primary-color);
        background: rgba(59, 130, 246, 0.1);
        padding: 0.5rem;
        border-radius: 12px;
      }
      
      .highlight {
        color: var(--primary-color);
      }
    }
    
    .navbar-search {
      flex: 1;
      max-width: 480px;
      margin: 0 3rem;
      
      .search-wrapper {
        position: relative;
        
        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        
        input {
          width: 100%;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-main);
          border-radius: 50px;
          padding: 0.85rem 1.5rem 0.85rem 3rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          
          &:focus {
              background: rgba(17, 24, 39, 0.9);
              border-color: var(--primary-color);
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
          }
          
          &::placeholder {
            color: #6b7280;
          }
        }
      }
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      .action-btn {
        color: var(--text-main);
        width: 44px;
        height: 44px;
        
        &:hover { 
          color: var(--primary-color); 
          background: rgba(255,255,255,0.05); 
        }
      }
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .user-greeting {
            display: none;
            @media(min-width: 1024px) { display: block; }
            font-size: 0.95rem;
            color: var(--text-muted);
            font-weight: 500;
        }
    }
    
    .auth-buttons {
        display: flex;
        gap: 1rem;
        align-items: center;
        
        a {
          text-decoration: none;
        }
    }

    @media (max-width: 1024px) {
      .navbar { margin: 0; top: 0; border-radius: 0; border-top: none; padding: 1rem 1.5rem; }
      .navbar-search { display: none; }
    }
  `]
})
export class NavbarComponent {
  constructor(public readonly authService: AuthService) { }
}


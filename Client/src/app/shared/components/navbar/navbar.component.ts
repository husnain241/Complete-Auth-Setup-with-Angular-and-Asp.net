import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [CommonModule, RouterLink, RouterLinkActive, MenubarModule, ButtonModule, InputTextModule],
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
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input type="text" pInputText placeholder="Search phones, accessories..." />
        </span>
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
              <button pButton label="Register" class="p-button-primary"></button>
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
      padding: 0.75rem 2rem;
      position: sticky;
      top: 1rem;
      z-index: 1000;
      margin: 0 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .navbar-brand .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      
      .brand-icon {
        font-size: 1.5rem;
        color: var(--primary-color);
      }
      
      .highlight {
        color: var(--primary-color);
      }
    }
    
    .navbar-search {
      flex: 1;
      max-width: 500px;
      margin: 0 2rem;
      
      .p-input-icon-left {
        width: 100%;
        i { color: var(--text-muted); }
      }
      
      input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        border-radius: 50px;
        padding-left: 2.5rem;
        
        &:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--primary-color);
        }
      }
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .action-btn {
        color: var(--text-main);
        &:hover { color: var(--primary-color); background: rgba(255,255,255,0.05); }
      }
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        
        .user-greeting {
            display: none;
            @media(min-width: 768px) { display: block; }
            font-size: 0.9rem;
            color: var(--text-muted);
        }
    }
    
    .auth-buttons {
        display: flex;
        gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .navbar-search { display: none; }
      .navbar { padding: 0.75rem 1rem; margin: 0; top: 0; border-radius: 0; border-top: none; }
    }
  `]
})
export class NavbarComponent {
  constructor(public readonly authService: AuthService) { }
}


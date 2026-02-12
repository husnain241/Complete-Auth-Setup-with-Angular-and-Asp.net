import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

/**
 * Admin dashboard component - role-protected.
 * Displays admin-specific information and controls.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {{ authService.currentUser()?.firstName || 'Admin' }}</p>
        </div>
        <div class="header-badge">
          <p-tag severity="info" value="Admin" icon="pi pi-shield" />
        </div>
      </header>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-content">
            <h3>1,234</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>892</h3>
            <p>Active Sessions</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <h3>47</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3>98.5%</h3>
            <p>System Health</p>
          </div>
        </div>
      </div>
      
      <div class="content-grid">
        <p-card header="Recent Activity" styleClass="activity-card glass-card">
          <div class="activity-list">
            @for (activity of recentActivity; track activity.id) {
              <div class="activity-item">
                <div class="activity-icon-wrapper" [ngClass]="activity.type">
                  <i [class]="activity.icon"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-message">{{ activity.message }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            }
          </div>
        </p-card>
        
        <p-card header="Quick Actions" styleClass="actions-card glass-card">
          <div class="actions-grid">
            <button pButton class="action-btn">
              <i class="pi pi-users text-2xl mb-2"></i>
              <span>Manage Users</span>
            </button>
            <button pButton class="action-btn">
              <i class="pi pi-chart-bar text-2xl mb-2"></i>
              <span>View Reports</span>
            </button>
            <button pButton class="action-btn">
              <i class="pi pi-cog text-2xl mb-2"></i>
              <span>Settings</span>
            </button>
            <button pButton class="action-btn">
              <i class="pi pi-file text-2xl mb-2"></i>
              <span>View Logs</span>
            </button>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
      color: #e2e8f0;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      
      .header-content {
        h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          background: linear-gradient(90deg, #fff, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        p {
          color: #94a3b8;
          font-size: 1.1rem;
        }
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      transition: transform 0.2s, border-color 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.15);
      }
      
      .stat-icon {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        font-size: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        
        &.users {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
        }
        
        &.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
        }
        
        &.pending {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
        }
        
        &.revenue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
        }
      }
      
      .stat-content {
        h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
        }
        
        p {
          color: #94a3b8;
          font-size: 0.95rem;
          font-weight: 500;
        }
      }
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
    
    /* PrimeNG Overrides for Glassmorphism */
    :host ::ng-deep {
      .p-card {
        background: rgba(30, 41, 59, 0.4) !important;
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        color: #e2e8f0 !important;
        border-radius: 16px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
      }
      
      .p-card-header {
         padding: 1.5rem 1.5rem 0 1.5rem !important;
      }
      
      .p-card-body {
        padding: 1.5rem !important;
      }
      
      .p-card-title {
        color: #fff !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      
      .p-card-content {
        padding: 1rem 0 0 0 !important;
      }
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 12px;
      transition: background 0.2s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      
      .activity-icon-wrapper {
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        
        &.login {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        }
        
        &.register {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        
        &.warning {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
      }
      
      .activity-details {
        flex: 1;
        
        .activity-message {
          color: #e2e8f0;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        
        .activity-time {
          color: #64748b;
          font-size: 0.8rem;
        }
      }
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #e2e8f0;
      transition: all 0.2s;
      cursor: pointer;
      width: 100%;
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      
      i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #818cf8;
      }
      
      span {
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  `]
})
export class AdminDashboardComponent {
  public readonly authService = inject(AuthService);

  recentActivity = [
    { id: 1, type: 'login', icon: 'pi pi-sign-in', message: 'User john@example.com logged in', time: '2 minutes ago' },
    { id: 2, type: 'register', icon: 'pi pi-user-plus', message: 'New user jane@example.com registered', time: '15 minutes ago' },
    { id: 3, type: 'warning', icon: 'pi pi-exclamation-triangle', message: 'Failed login attempt detected', time: '1 hour ago' },
    { id: 4, type: 'login', icon: 'pi pi-sign-in', message: 'User admin@example.com logged in', time: '2 hours ago' },
    { id: 5, type: 'register', icon: 'pi pi-user-plus', message: 'New user mike@example.com registered', time: '3 hours ago' },
  ];
}

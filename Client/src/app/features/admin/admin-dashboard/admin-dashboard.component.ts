import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

/**
 * Admin dashboard component - role-protected.
 * Displays admin-specific information and controls.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardModule, TableModule, TagModule, ButtonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {{ authService.currentUser()?.firstName || 'Admin' }}</p>
        </div>
        <div class="header-badge">
          <p-tag severity="warn" value="Admin" icon="pi pi-shield" />
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
        <p-card header="Recent Activity" styleClass="activity-card">
          <div class="activity-list">
            @for (activity of recentActivity; track activity.id) {
              <div class="activity-item">
                <div class="activity-icon" [class]="activity.type">
                  <i [class]="activity.icon"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-text">{{ activity.message }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            }
          </div>
        </p-card>
        
        <p-card header="Quick Actions" styleClass="actions-card">
          <div class="actions-grid">
            <p-button 
              label="Manage Users" 
              icon="pi pi-users" 
              severity="secondary"
              styleClass="action-button"
            />
            <p-button 
              label="View Reports" 
              icon="pi pi-chart-bar" 
              severity="secondary"
              styleClass="action-button"
            />
            <p-button 
              label="System Settings" 
              icon="pi pi-cog" 
              severity="secondary"
              styleClass="action-button"
            />
            <p-button 
              label="View Logs" 
              icon="pi pi-file" 
              severity="secondary"
              styleClass="action-button"
            />
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
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      .header-content {
        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        
        p {
          color: #a0aec0;
        }
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      .stat-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-size: 1.5rem;
        
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        }
        
        p {
          color: #a0aec0;
          font-size: 0.9rem;
        }
      }
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    
    :host ::ng-deep {
      .activity-card, .actions-card {
        .p-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }
        
        .p-card-title {
          color: #fff;
          font-size: 1.1rem;
        }
      }
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.2s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      
      .activity-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        
        &.login {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
        }
        
        &.register {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        
        &.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
      }
      
      .activity-details {
        flex: 1;
        
        .activity-text {
          color: #e2e8f0;
          font-size: 0.9rem;
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
      gap: 0.75rem;
      
      :host ::ng-deep .action-button .p-button {
        width: 100%;
        justify-content: flex-start;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
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

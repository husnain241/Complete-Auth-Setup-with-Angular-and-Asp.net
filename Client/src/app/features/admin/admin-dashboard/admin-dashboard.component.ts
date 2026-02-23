import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SignalrService } from '../../../core/services/signalr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, ButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private userService = inject(UserService);
  private signalRService = inject(SignalrService);
  private router = inject(Router);

  // Data Signals
  users = signal<{ id: number; role: string }[]>([]);
  totalUsers = computed(() => this.users().length);
  adminCount = computed(() => this.users().filter(u => u.role === 'Admin').length);
  memberCount = computed(() => this.users().filter(u => u.role !== 'Admin').length);
  loadingStats = signal(true);


 // 1. Recent Activity ko dynamic banayein
  recentActivity = [
      { id: 1, type: 'login', icon: 'pi pi-sign-in', message: 'User john@example.com logged in', time: '2 min ago' },
      { id: 2, type: 'register', icon: 'pi pi-user-plus', message: 'New user jane@example.com registered', time: '15 min ago' }
  ];

  ngOnInit(): void {
    this.loadDashboardStats();

    this.signalRService.addListener('UpdateUserStats', (data) => {
    console.log('Real-time notification received!', data);

    this.loadDashboardStats(); // Data ko dobara fetch karein taake count update ho jaye
    // 2. Activity list mein naya item top par add karein
      const newLog = {
          id: Date.now(),
          type: data.type || 'register',
          icon: data.type === 'register' ? 'pi pi-user-plus' : 'pi pi-info-circle',
          message: typeof data === 'string' ? data : data.message,
          time: 'Just now'
      };
      this.recentActivity = [newLog, ...this.recentActivity];
  });
  }

  loadDashboardStats(): void {
    this.loadingStats.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users.map(u => ({ id: u.id, role: u.role })));
        this.loadingStats.set(false);
      },
      error: () => this.loadingStats.set(false)
    });
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
}
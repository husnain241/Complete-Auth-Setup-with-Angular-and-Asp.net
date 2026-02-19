import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Data Signals
  totalUsers = signal<number>(0);

  recentActivity = [
    { id: 1, type: 'login', icon: 'pi pi-sign-in', message: 'User john@example.com logged in', time: '2 minutes ago' },
    { id: 2, type: 'register', icon: 'pi pi-user-plus', message: 'New user jane@example.com registered', time: '15 minutes ago' },
    { id: 3, type: 'warning', icon: 'pi pi-exclamation-triangle', message: 'Failed login attempt detected', time: '1 hour ago' },
    { id: 4, type: 'login', icon: 'pi pi-sign-in', message: 'User admin@example.com logged in', time: '2 hours ago' },
    { id: 5, type: 'register', icon: 'pi pi-user-plus', message: 'New user mike@example.com registered', time: '3 hours ago' },
  ];

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.totalUsers.set(users.length),
      error: (err) => console.error('Dashboard Stats Error:', err)
    });
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
}
import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/auth.models';
import { SignalrService } from '../../../../core/services/signalr';

type SortField = 'id' | 'email' | 'firstName' | 'lastName' | 'role';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    SkeletonModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmService = inject(ConfirmationService);  
  private signalRService = inject(SignalrService);
  

  // ── State ─────────────────────────────────────────────────
  users = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);

  searchQuery = signal('');
  roleFilter = signal('');
  sortField = signal<SortField>('id');
  sortOrder = signal<SortOrder>('asc');

  showAddModal = signal(false);
  showEditModal = signal(false);
  selectedUser = signal<User | null>(null);

  // ── Computed filtered & sorted list ───────────────────────
  filteredUsers = computed(() => {
    let list = this.users();
    const q = this.searchQuery().toLowerCase().trim();
    const role = this.roleFilter();

    if (q) {
      list = list.filter(u =>
        u.email.toLowerCase().includes(q) ||
        (u.firstName ?? '').toLowerCase().includes(q) ||
        (u.lastName ?? '').toLowerCase().includes(q)
      );
    }
    if (role) {
      list = list.filter(u => u.role === role);
    }

    const field = this.sortField();
    const order = this.sortOrder() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const aVal = (a[field] ?? '').toString().toLowerCase();
      const bVal = (b[field] ?? '').toString().toLowerCase();
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    });
  });

  // ── Dropdown Options ──────────────────────────────────────
  roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
  ];

  roleFormOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' },
  ];

  skeletonRows = Array(6);

  // ── Forms ─────────────────────────────────────────────────
  addForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: [''],
    lastName: [''],
    role: ['User', Validators.required],
  });

  editForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    role: ['User', Validators.required],
  });

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit() { this.loadUsers();
   
this.signalRService.addListener('UserStatusChanged', (userId: any, isOnline: boolean) => {
    this.users.update(allUsers => 
        allUsers.map(u => u.id === Number(userId) ? { ...u, isOnline } : u)
    );
});
   }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: data => { this.users.set(data); this.loading.set(false); },
      error: () => {
        this.loading.set(false);
        this.toast('error', 'Load Failed', 'Could not fetch users from server.');
      }
    });
  }

  // ── Search / Filter / Sort ────────────────────────────────
  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onRoleFilter(value: string) { this.roleFilter.set(value); }

  toggleSort(field: SortField) {
    if (this.sortField() === field) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) return 'pi pi-sort-alt';
    return this.sortOrder() === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down';
  }

  // ── Add User ──────────────────────────────────────────────
  openAddModal() {
    this.addForm.reset({ role: 'User' });
    this.showAddModal.set(true);
  }

  submitAdd() {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }
    this.saving.set(true);
    this.userService.createUser(this.addForm.value).subscribe({
      next: user => {
        this.users.update(list => [...list, user]);
        this.showAddModal.set(false);
        this.saving.set(false);
        this.toast('success', 'User Created', `${user.email} has been added.`);
      },
      error: err => {
        this.saving.set(false);
        const msg = err?.error?.message ?? 'Failed to create user.';
        this.toast('error', 'Create Failed', msg);
      }
    });
  }

  // ── Edit User ─────────────────────────────────────────────
  openEditModal(user: User) {
    this.selectedUser.set(user);
    this.editForm.reset({ firstName: user.firstName, lastName: user.lastName, role: user.role });
    this.showEditModal.set(true);
  }

  submitEdit() {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    const user = this.selectedUser();
    if (!user) return;
    this.saving.set(true);
    this.userService.updateUser(user.id, this.editForm.value).subscribe({
      next: () => {
        this.users.update(list => list.map(u =>
          u.id === user.id ? { ...u, ...this.editForm.value } : u
        ));
        this.showEditModal.set(false);
        this.saving.set(false);
        this.toast('success', 'User Updated', 'User details have been saved.');
      },
      error: err => {
        this.saving.set(false);
        const msg = err?.error?.message ?? 'Failed to update user.';
        this.toast('error', 'Update Failed', msg);
      }
    });
  }

  // ── Delete User ───────────────────────────────────────────
  confirmDelete(user: User) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete <strong>${user.email}</strong>?<br>This action cannot be undone.`,
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.executeDelete(user)
    });
  }

  private executeDelete(user: User) {
    this.deleting.set(true);
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== user.id));
        this.deleting.set(false);
        this.toast('success', 'User Deleted', `${user.email} has been removed.`);
      },
      error: err => {
        this.deleting.set(false);
        const msg = err?.error?.message ?? 'Failed to delete user.';
        this.toast('error', 'Delete Failed', msg);
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  private toast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 4000 });
  }

  getUserInitials(user: User): string {
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || user.email[0].toUpperCase();
  }

  getRoleSeverity(role: string): 'danger' | 'info' {
    return role === 'Admin' ? 'danger' : 'info';
  }

  goBack() { this.router.navigate(['/admin']); }

  hasError(form: FormGroup, field: string, error: string) {
    const ctrl = form.get(field);
    return ctrl?.hasError(error) && ctrl.touched;
  }
}
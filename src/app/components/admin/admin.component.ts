import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {User} from "../../dto/response.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  jumpPage: number = 1;

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers(this.currentPage);
  }

  fetchUsers(page:number): void {
    this.adminService.getAllUsers(page).subscribe({
      next: (response) => {
        this.users = response.users;
        this.isLoading = false;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users from the server.';
        this.isLoading = false;
      }
    });
  }

  goToSpecificPage() {
    if (this.jumpPage >= 1 && this.jumpPage <= this.totalPages) {
      this.fetchUsers(this.jumpPage);
    } else {
      alert(`Vui lòng nhập trang từ 1 đến ${this.totalPages}`);
      this.jumpPage = this.currentPage;
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {

      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.user_id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete the user. Please check the console for details.');
        }
      });
    }
  }

  toggleLockStatus(user: User): void {
    const newStatus = !user.user_islocked;
    const actionText = newStatus ? 'lock' : 'unlock';

    if (confirm(`Are you sure you want to ${actionText} this user?`)) {
      if(user.user_islocked){
        this.adminService.unlockUser(user.user_id).subscribe({
            next: () => {
              user.user_islocked = newStatus;
            },
            error: (err) => {
              console.error(`Error trying to ${actionText} user:`, err);
              alert(`Failed to ${actionText} the user. Please check the console.`);
            }
        });
      }
      if(!user.user_islocked){
        this.adminService.lockUser(user.user_id).subscribe({
          next: () => {

            user.user_islocked = newStatus;
          },
          error: (err) => {
            console.error(`Error trying to ${actionText} user:`, err);
            alert(`Failed to ${actionText} the user. Please check the console.`);
          }
        });
      }

    }
  }

  toggleAdminStatus(user: User): void {
    let newAdminStatus = false;
    if(user.user_role=='admin'){
      newAdminStatus = true;
    }

    const actionText = newAdminStatus ? 'drop' : 'promote';

    if (confirm(`Are you sure you want to ${actionText} this user?`)) {
      if(newAdminStatus){
        this.authService.dropAdmin(user.user_id).subscribe({
          next: () => {
            user.user_role = newAdminStatus ? 'user' : 'admin';
          },
          error: (err) => {
            console.error(`Error trying to ${actionText} user:`, err);
            alert(`Failed to ${actionText} the user. Please check the console.`);
          }
        });
      }
      if(!newAdminStatus){
        this.authService.createAdmin(user.user_id).subscribe({
          next: () => {
            user.user_role = newAdminStatus ? 'user' : 'admin';
          },
          error: (err) => {
            console.error(`Error trying to ${actionText} user:`, err);
            alert(`Failed to ${actionText} the user. Please check the console.`);
          }
        });
      }

    }
  }
}

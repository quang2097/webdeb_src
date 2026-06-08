import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {User} from "../../dto/response.model";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        // Extract the array from the 'users' wrapper key
        this.users = response.users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users from the server.';
        this.isLoading = false;
      }
    });
  }

  // ... existing code ...

  deleteUser(userId: string): void {
    // 1. Ask for confirmation
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {

      // 2. Call the service
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          // 3. Remove the user from the local array to instantly update the UI
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
    // Determine the opposite of their current status
    const newStatus = !user.user_islocked;
    const actionText = newStatus ? 'lock' : 'unlock';

    if (confirm(`Are you sure you want to ${actionText} this user?`)) {
      if(user.user_islocked){
        this.adminService.unlockUser(user.user_id).subscribe({
            next: () => {
              // Update the local user object to instantly swap the button UI
              user.user_islocked = newStatus;
            },      //   },
            error: (err) => {
              console.error(`Error trying to ${actionText} user:`, err);
              alert(`Failed to ${actionText} the user. Please check the console.`);
            }
        });
      }
      if(!user.user_islocked){
        this.adminService.lockUser(user.user_id).subscribe({
          next: () => {
            // Update the local user object to instantly swap the button UI
            user.user_islocked = newStatus;
          },      //   },
          error: (err) => {
            console.error(`Error trying to ${actionText} user:`, err);
            alert(`Failed to ${actionText} the user. Please check the console.`);
          }
        });
      }

    }
  }
}

import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";

// 1. Define the structure based on your Swagger API screenshot
export interface UserProfile {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Inject the service that contains your myInfo() method
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.userService.myInfo().subscribe({
      next: (data: UserProfile) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching profile', error);
        this.errorMessage = 'Could not load profile data.';
        this.isLoading = false;
      }
    });
  }
}

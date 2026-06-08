import {Component, HostListener,ElementRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  // Example flag for auth state
  isLoggedIn: boolean = false;
  isDropdownOpen: boolean = false;
  isAdmin: boolean = false;
  constructor(private router: Router,private authService: AuthService,private userService: UserService, private elementRef: ElementRef) {}

  ngOnInit(): void {
        if(this.authService.getToken()){
          this.isLoggedIn=true;
          this.userService.myInfo().subscribe({
            next: (userInfo) => {
              if (userInfo.user_role === 'admin') {
                this.isAdmin = true;
              }
            },
            error: (err) => {
              console.error('Failed to fetch user info', err);
            }
          });
  }
  }

  checklogin(){
    if(!this.isLoggedIn){
      alert("đăng nhập để sử dụng tính năng này");
    }
  }

  logout() {
    // Clear auth token and navigate away
    this.authService.deleteToken();
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Kiểm tra xem phần tử bị click (event.target) có nằm TRONG component này không
    // Nếu click ra ngoài component (hoặc ra ngoài avatar-container), ta sẽ đóng dropdown
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}

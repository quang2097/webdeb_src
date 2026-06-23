import {Component, HostListener, ElementRef, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {UploadService} from "../../services/upload.service";
import {SearchService} from "../../services/search.service";
import {interval, Subscription} from "rxjs";
import {AuthStateService} from "../../services/auth.state.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{

  @Output() userStatusChangeEvent = new EventEmitter<{ isLoggedIn: boolean, isAdmin: boolean }>();

  isLoggedIn: boolean = false;
  isNotificationOpen = false;
  isUserDropdownOpen: boolean = false;
  isAdmin: boolean = false;
  isSearchDropdownOpen: boolean = false;
  index: number =0;
  searchResults: any[] = [];
  username: any = '';

  listDocFailed: any[] = [];
  listDocCompleted: any[] = [];
  listDocProcessing: any[] = [];
  userId: string = '';
  searchQuery: string = '';
  constructor(private router: Router,private authService: AuthService, private elementRef: ElementRef, private uploadService: UploadService, private searchService : SearchService, private authStateService : AuthStateService) {}

  private intervalId: any;
  ngOnInit(): void {
        this.updateLoginStatus();
        this.intervalId = setInterval(()=>{
          this.updateLoginStatus();
        },30000);
  }

  updateLoginStatus(){
    this.authService.verify_token().subscribe({
      next :(data:any)=>{
        this.isLoggedIn = !!data.status;
        this.isAdmin = data.user_role === 'admin';
        this.userId = data.user_id;
        this.username = data.user_name

        this.authStateService.updateStatus(this.isLoggedIn, this.isAdmin);

        this.uploadService.getAllDocsStatus().subscribe({
          next: (data) => {
            this.listDocFailed = data.listFailed;
            this.listDocCompleted = data.listCompleted;
            this.listDocProcessing = data.listProcessing;
            console.log(this.listDocProcessing)
            if(this.listDocProcessing.length>0){
              const now = new Date().getTime();

              const REFERENCE_SIZE_BYTES = 20 * 1024 * 1024; // ~ 20.97 triệu bytes
              const REFERENCE_TIME_MS = 8 * 60 * 1000;       // 480,000 mili-giây
              const MAX_TIMEOUT_MS = 15 * 60 * 1000;

              this.listDocProcessing.forEach(doc => {
                let dateString = doc.doc_createdat;
                if (dateString && !dateString.endsWith('Z')) {
                  dateString += 'Z';
                }

                doc.loadBar=true;

                const createdAtTimestamp = new Date(dateString).getTime();
                let elapsedTime = now - createdAtTimestamp;
                if (elapsedTime < 0) elapsedTime = 0;

                if (elapsedTime > MAX_TIMEOUT_MS) {
                  doc.remainingTimeStr = "Gửi file thất bại (Quá thời gian chờ)";

                  doc.loadBar = false;

                  return;
                }

                let totalLoadTimeMs = REFERENCE_TIME_MS;

                if (doc.doc_size && doc.doc_size > 0) {

                  totalLoadTimeMs = (doc.doc_size / REFERENCE_SIZE_BYTES) * REFERENCE_TIME_MS;
                }

                if (totalLoadTimeMs < 5000) {
                  totalLoadTimeMs = 5000;
                }

                let remainingTimeMs = totalLoadTimeMs - elapsedTime;
                if (remainingTimeMs < 0) remainingTimeMs = 0;

                const remainingMinutes = Math.floor(remainingTimeMs / 60000);
                const remainingSeconds = Math.floor((remainingTimeMs % 60000) / 1000);

                let progressPercent = (elapsedTime / totalLoadTimeMs) * 100;
                if (progressPercent > 95) progressPercent = 95;

                doc.progressPercent = progressPercent;

                if (remainingTimeMs > 0) {
                  if (remainingMinutes === 0) {
                    doc.remainingTimeStr = `Còn khoảng ${remainingSeconds} giây`;
                  } else {
                    doc.remainingTimeStr = `Còn khoảng ${remainingMinutes} phút ${remainingSeconds} giây`;
                  }
                } else {
                  doc.remainingTimeStr = "Đang hoàn tất...";
                }
              });
            }
          }
        });
      },
      error: (err) => {
        this.isLoggedIn = false;
        this.isAdmin = false;

        this.authStateService.updateStatus(this.isLoggedIn, this.isAdmin);

        console.log('Lỗi đăng nhập: ' + (err.error?.detail || 'Chưa đăng nhập'));
      }
    });
  }

  toggleNotification() {
    if (!this.isNotificationOpen) {
      this.isUserDropdownOpen = false;
      this.isSearchDropdownOpen = false;
    }

    this.isNotificationOpen = !this.isNotificationOpen;
  }

  logout() {
    this.authService.deleteToken();
    this.isLoggedIn = false;
    this.isUserDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    if (!this.isUserDropdownOpen) {
      this.isNotificationOpen = false;
      this.isSearchDropdownOpen = false;
    }

    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  onSearchInput() {
    if (this.searchQuery.trim().length > 0) {
      this.isSearchDropdownOpen = true;

      this.isUserDropdownOpen = false;
      this.isNotificationOpen = false;

      this.searchService.querySearch(this.searchQuery).subscribe({
        next: (data: any): void => {
          this.searchResults = data;
          console.log('Kết quả tìm kiếm:', this.searchResults);
        }
      });
    } else {
      this.isSearchDropdownOpen = false;
      this.searchResults = [];
    }
  }
  onSearchFocus() {
    if (this.searchQuery.trim().length > 0) {
      this.isSearchDropdownOpen = true;

      this.isUserDropdownOpen = false;
      this.isNotificationOpen = false;
    }
  }

  onSearchBlur() {
    this.isSearchDropdownOpen = false;
  }

  selectSearchResult(result: any) {
    this.searchQuery = result.novel_title;
    this.isSearchDropdownOpen = false;

    console.log('Selected:', result);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Đang tìm kiếm:', this.searchQuery);

      const exactMatch = this.searchResults.find(item =>
        item.novel_title.toLowerCase() === this.searchQuery.toLowerCase()
      );

      if (exactMatch) {
        window.location.href = `/home/novel/preview/${exactMatch.novel_id}`;
      }

      this.isSearchDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isUserDropdownOpen = false;
      this.isNotificationOpen = false;
      this.isSearchDropdownOpen = false;
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

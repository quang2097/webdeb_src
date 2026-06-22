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

  // Example flag for auth state
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

        // 👉 BROADCAST THE NEW STATUS TO THE ENTIRE APP
        this.authStateService.updateStatus(this.isLoggedIn, this.isAdmin);

        this.uploadService.getAllDocsStatus().subscribe({
          next: (data) => {
            this.listDocFailed = data.listFailed;
            this.listDocCompleted = data.listCompleted;
            this.listDocProcessing = data.listProcessing;
            console.log(this.listDocProcessing)
            if(this.listDocProcessing.length>0){
              const now = new Date().getTime();

              // Đặt mốc quy chiếu: 20MB (tính bằng byte) mất 8 phút (tính bằng ms)
              const REFERENCE_SIZE_BYTES = 20 * 1024 * 1024; // ~ 20.97 triệu bytes
              const REFERENCE_TIME_MS = 8 * 60 * 1000;       // 480,000 mili-giây
              const MAX_TIMEOUT_MS = 15 * 60 * 1000;

              this.listDocProcessing.forEach(doc => {
// 1. Chuẩn hóa múi giờ sang UTC
                let dateString = doc.doc_createdat;
                if (dateString && !dateString.endsWith('Z')) {
                  dateString += 'Z';
                }

                doc.loadBar=true;

                const createdAtTimestamp = new Date(dateString).getTime();
                let elapsedTime = now - createdAtTimestamp;
                if (elapsedTime < 0) elapsedTime = 0;

                if (elapsedTime > MAX_TIMEOUT_MS) {
                  // Chỉ cập nhật dòng chữ thông báo
                  doc.remainingTimeStr = "Gửi file thất bại (Quá thời gian chờ)";

                  // Bật cờ lỗi để thanh tiến trình chuyển sang màu đỏ (tùy chọn)
                  doc.loadBar = false;

                  // Lệnh return này chỉ dùng để "bỏ qua các bước tính toán thời gian ở bên dưới",
                  // tuyệt đối không làm chuyển trang hay load lại trang.
                  return;
                }

                // 2. TÍNH TOÁN THỜI GIAN TỔNG DỰA TRÊN DUNG LƯỢNG FILE
                let totalLoadTimeMs = REFERENCE_TIME_MS; // Mặc định là 8 phút nếu rủi ro không đọc được size

                if (doc.doc_size && doc.doc_size > 0) {
                  // Quy tắc tam suất: Thời gian = (Dung lượng thực tế / Dung lượng chuẩn) * Thời gian chuẩn
                  totalLoadTimeMs = (doc.doc_size / REFERENCE_SIZE_BYTES) * REFERENCE_TIME_MS;
                }

                // Thiết lập thời gian chờ tối thiểu (VD: File vài KB cũng nên chạy thanh tiến trình khoảng 5 giây cho đẹp, không bị giật cái lên 100% luôn)
                if (totalLoadTimeMs < 5000) {
                  totalLoadTimeMs = 5000;
                }

                // 3. Tính thời gian còn lại
                let remainingTimeMs = totalLoadTimeMs - elapsedTime;
                if (remainingTimeMs < 0) remainingTimeMs = 0;

                const remainingMinutes = Math.floor(remainingTimeMs / 60000);
                const remainingSeconds = Math.floor((remainingTimeMs % 60000) / 1000);

                // 4. Tính phần trăm
                let progressPercent = (elapsedTime / totalLoadTimeMs) * 100;
                if (progressPercent > 95) progressPercent = 95;

                // 5. Gắn dữ liệu hiển thị
                doc.progressPercent = progressPercent;

                if (remainingTimeMs > 0) {
                  // Nếu còn chưa tới 1 phút thì chỉ hiện số giây cho gọn
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

        // 👉 BROADCAST THE LOGGED-OUT STATUS
        this.authStateService.updateStatus(this.isLoggedIn, this.isAdmin);

        console.log('Lỗi đăng nhập: ' + (err.error?.detail || 'Chưa đăng nhập'));
      }
    });
  }

  toggleNotification() {
    // If opening notifications, close everything else
    if (!this.isNotificationOpen) {
      this.isUserDropdownOpen = false;
      this.isSearchDropdownOpen = false;
    }

    this.isNotificationOpen = !this.isNotificationOpen;
  }

  logout() {
    // Clear auth token and navigate away
    this.authService.deleteToken();
    this.isLoggedIn = false;
    this.isUserDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    // If opening the user profile menu, close everything else
    if (!this.isUserDropdownOpen) {
      this.isNotificationOpen = false;
      this.isSearchDropdownOpen = false;
    }

    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  //SEARCH


  // Triggers every time the user types
  onSearchInput() {
    if (this.searchQuery.trim().length > 0) {
      this.isSearchDropdownOpen = true;

      // FORCE CLOSE other menus when search dropdown appears from typing
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

// Triggers when the user clicks inside the search box
  onSearchFocus() {
    if (this.searchQuery.trim().length > 0) {
      this.isSearchDropdownOpen = true;

      // FORCE CLOSE other menus when user clicks back into an active search box
      this.isUserDropdownOpen = false;
      this.isNotificationOpen = false;
    }
  }

// Triggers when the user clicks completely outside the search box
  onSearchBlur() {
    this.isSearchDropdownOpen = false;
  }

// Triggers when a user clicks a specific item in the dropdown
  selectSearchResult(result: any) {
    this.searchQuery = result.novel_title; // Fill input with selected title
    this.isSearchDropdownOpen = false; // Close menu

    console.log('Selected:', result);
    // Navigate to the preview page using the syntax we fixed earlier!
    // this.router.navigate(['/home/novel/preview', result.novel_id]);
  }

// Triggers when hitting the Enter key or clicking the magnifying glass
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Đang tìm kiếm:', this.searchQuery);


      // 1. Tìm xem có truyện nào khớp chính xác với từ khóa không
      const exactMatch = this.searchResults.find(item =>
        item.novel_title.toLowerCase() === this.searchQuery.toLowerCase()
      );

      if (exactMatch) {
        // Chú ý: exactMatch.novel_id không có chữ 'this'
        window.location.href = `/home/novel/preview/${exactMatch.novel_id}`;
      }

      this.isSearchDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Check if the clicked target element sits outside the header area component
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      // Cleanly clear and close ALL active menus at once
      this.isUserDropdownOpen = false;
      this.isNotificationOpen = false;
      this.isSearchDropdownOpen = false;
    }
  }

  ngOnDestroy(): void {
    // Dọn dẹp bộ đếm khi rời đi
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

import {Component, HostListener, OnInit} from '@angular/core';
import {NovelService} from "../../services/novel.service";
import {enviroments} from "../../../enviroments";
import { HttpParams } from '@angular/common/http';
import {TagService} from "../../services/tag.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  api_url: string = enviroments.API_URL
  novels: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  jumpPage: number = 1;

  listTag: any[] = [];
  selectedTags: any[] = [];
  selectedTagsName: any[] = [];
  isDropdownOpen = false;

  isDown = false;

  startX: number = 0;
  scrollLeft: number = 0;

  isDragging = false;


  constructor(private novelService: NovelService, private tagService :TagService,private router: Router) { }

  ngOnInit(): void {
    this.fetchNovels(this.currentPage);
    this.fetchTags()
  }

  fetchNovels(page: number): void {
    this.novelService.getAllNovels(page).subscribe({
      next: (response) => {
        this.novels = response.data;
        // Update your page trackers based on what FastAPI sends back!
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.total_pages;

        // Keep the input box synced with the actual current page
        this.jumpPage = this.currentPage;
      },
      error: (error) => {
        console.error('Error fetching novels:', error);
      }
    });
  }

  goToSpecificPage() {
    // 1. Validation: Make sure they didn't type -5 or page 1000 if it doesn't exist
    if (this.jumpPage >= 1 && this.jumpPage <= this.totalPages) {
      this.fetchNovels(this.jumpPage);
    } else {
      alert(`Vui lòng nhập trang từ 1 đến ${this.totalPages}`);
      // Reset the input box back to the current safe page
      this.jumpPage = this.currentPage;
    }
  }

  fetchTags() {
    this.tagService.getTags().subscribe({
      next:(data:any)=>{
        this.listTag=data;
      }
    })
  }

  onSearchClick() {
    // 1. Check if the user actually selected any tags
    if (this.selectedTags.length === 0) {
      this.fetchNovels(1);
    }

    this.currentPage = 1;

    let params = new HttpParams();

    // Nối từng ID vào params
    this.selectedTags.forEach(id => {
      params = params.append('tag_ids', id);
    });

    // 2. Call your service (assuming you named it something like novelService)
    this.novelService.getNovelsByAllTags(params,this.currentPage).subscribe({
      next: (response: any) => {
        console.log("Search Successful! Found novels:", response);

        // 👉 FIX 1: Dig into the response to grab the actual array
        this.novels = response.data;

        // 👉 FIX 2: Update your pagination so the HTML buttons update!
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.total_pages;
        this.jumpPage = this.currentPage;
      },
      error: (error) => {
        console.error("Search failed:", error);
      }
    });
  }

  @HostListener('window:mouseup')
  onWindowMouseUp() {
    this.isDown = false;
    // Đợi 100ms để chặn sự kiện click kịp thời trước khi reset cờ
    setTimeout(() => this.isDragging = false, 100);
  }

  onMouseDown(e: MouseEvent, element: HTMLElement) {
    this.isDown = true;
    this.isDragging = false;
    element.style.cursor = 'grabbing';
    this.startX = e.pageX - element.offsetLeft;
    this.scrollLeft = element.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
    // XÓA BỎ dòng reset isDragging ở đây. Để cho onWindowMouseUp lo!
  }


  onMouseMove(e: MouseEvent, element: HTMLElement) {
    if (!this.isDown) return;
    this.isDragging = true;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - this.startX) * 2;
    element.scrollLeft = this.scrollLeft - walk;
  }
  goToNovelDetail(novelId: string) {
    // Kiểm tra: Nếu nãy giờ người dùng đang kéo tag thì BỎ QUA lệnh chuyển trang
    if (this.isDragging) {
      return;
    }
    // Nếu click bình thường thì mới chuyển trang
    this.router.navigate(['/home/novel/preview', novelId]);
  }

  onCheckboxChange(tag: any, event: Event) {
    // Lấy trạng thái check từ DOM
    const isChecked = (event.target as HTMLInputElement).checked;

    // Cập nhật trạng thái cho object
    tag.checked = isChecked;

    if (isChecked) {
      // Nếu check: Thêm ID và Tên vào 2 mảng
      this.selectedTags.push(tag.tag_id);
      this.selectedTagsName.push(tag.tag_name);
    } else {
      // NẾU BỎ CHECK: Tìm index của ID trong mảng và xóa
      // (Sửa lại điều kiện tìm kiếm cho đúng với tag_id)
      const index = this.selectedTags.findIndex(id => id === tag.tag_id);

      if (index > -1) {
        this.selectedTags.splice(index, 1);
        this.selectedTagsName.splice(index, 1);
      }
    }
  }

  removeTag(tagNameToRemove: string) {
    // 1. Tìm tag trong danh sách gốc (listTag) dựa vào tên và bỏ check
    const foundItem = this.listTag.find(item => item.tag_name === tagNameToRemove);
    if (foundItem) {
      foundItem.checked = false;
    }

    // 2. Tìm vị trí (index) của tên tag này trong mảng selectedTagsName
    const index = this.selectedTagsName.indexOf(tagNameToRemove);

    // 3. Nếu tìm thấy, xóa phần tử ở vị trí đó trong cả 2 mảng
    if (index > -1) {
      this.selectedTags.splice(index, 1);      // Xóa ID gửi về backend
      this.selectedTagsName.splice(index, 1);  // Xóa Tên hiển thị trên UI
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  protected readonly onmousedown = onmousedown;
}

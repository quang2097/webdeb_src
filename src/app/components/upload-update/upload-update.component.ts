import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Route, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {UploadService} from "../../services/upload.service";
import {enviroments} from "../../../enviroments";
import {NovelService} from "../../services/novel.service";
import {TagService} from "../../services/tag.service";

@Component({
  selector: 'app-upload-update',
  templateUrl: './upload-update.component.html',
  styleUrls: ['./upload-update.component.css']
})
export class UploadUpdateComponent implements OnInit {
  apiUrl: string = enviroments.API_URL;
  documentId: string = '';

  needs_image_upload: string = ''

  // Required fields
  existingCoverUrl: string = '';
  selectedCover: File | null = null;
  novelTitle: string = '';
  novelAuthor: string = '';

  // Optional fields
  novelDescription: string = '';
  novelSeries: string = '';
  isPrivate: boolean = false;

  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  listTag: any[] = [];
  selectedTags: any[] = [];
  selectedTagsName: any[] = [];
  isDropdownOpen = false;

  selectedImg: File | null= null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    private tagService:  TagService,
    private novelService : NovelService
  ) {}

  ngOnInit(): void {
    // 3. Store the result in a variable first to make TypeScript happy
    const idFromUrl :any = this.activatedRoute.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.documentId = idFromUrl;
      // TODO: Fetch your document data here
    } else {
      alert("Document ID is missing")
      this.router.navigate(['/home']);
    }

    this.fetchStatus()
    this.fetchTags()
    this.fetchNovel(idFromUrl)
  }

  fetchNovel(id: string) {
    this.novelService.getNovelInfoById(id).subscribe({
      next: (data: any) => {
        this.existingCoverUrl = data.novel_coverurl;
        this.novelTitle = data.novel_title;
        this.novelAuthor = data.novel_author;
        this.novelDescription = data.novel_description;
        this.novelSeries = data.novel_series;
        this.isPrivate = data.novel_isprivate;
        if (data.tags && data.tags.length > 0) {
          this.selectedTags = data.tags.map((tag: any) => tag.tag_id);
          this.selectedTagsName = data.tags.map((tag: any) => tag.tag_name);
        } else {
          this.selectedTags = [];
          this.selectedTagsName = [];
        }

        this.syncTagsUI();
      }
    });
  }

  fetchTags() {
    this.tagService.getTags().subscribe({
      next: (data: any) => {
        this.listTag = data;

        // Gọi hàm đồng bộ UI
        this.syncTagsUI();
      }
    });
  }

  // THÊM HÀM MỚI NÀY VÀO DƯỚI CÙNG HOẶC GẦN 2 HÀM TRÊN
  syncTagsUI() {
    // Duyệt qua tất cả các tag hiện có trong dropdown
    if (this.listTag && this.listTag.length > 0) {
      this.listTag.forEach(tag => {
        // Nếu tag_id nằm trong danh sách đã chọn -> đánh dấu checked = true
        tag.checked = this.selectedTags.includes(tag.tag_id);
      });
    }
  }
  fetchStatus(){
    this.uploadService.getDocsStatus(this.documentId).subscribe({
      next: (data) => {
        this.needs_image_upload=data.needs_image_upload
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  onAdditionalFileSelected(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedImg = inputElement.files[0];
    }
  }

  removeAdditionalImage(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.selectedImg = null;
    const fileInput = document.getElementById('additionalUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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

  onFileSelected(e: Event) {
    // Sử dụng biến 'e' thay vì 'event'
    const inputElement = e.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      this.selectedCover = file;
    }
  }

  // Thêm hàm xóa ảnh này
  removeCover(e: Event) {
    // Ngăn không cho sự kiện click lan truyền ra thẻ <label> bên ngoài
    e.preventDefault();
    e.stopPropagation();

    // Xóa biến lưu trữ file
    this.selectedCover = null;

    // Reset lại thẻ input file để người dùng có thể chọn lại chính file đó nếu muốn
    const fileInput = document.getElementById('coverUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (!this.novelTitle || !this.novelAuthor) {
      this.errorMessage = 'Please fill in all required fields (Title and Author).';
      return;
    }

    this.isSubmitting = true;

    // 1. Cập nhật thông tin chính (formData)
    const formData = new FormData();
    if (this.selectedCover instanceof File) {
      formData.append('cover_file', this.selectedCover);
    }
    formData.append('novel_title', this.novelTitle);
    formData.append('novel_author', this.novelAuthor);
    formData.append('novel_description', this.novelDescription || '');
    formData.append('novel_series', this.novelSeries || '');
    formData.append('novel_isprivate', String(this.isPrivate));
    this.selectedTags.forEach(tag => formData.append('tag_ids', tag));

    if(this.existingCoverUrl){
      this.uploadService.addUploadUpdate(formData, this.documentId).subscribe({
        next: (response: any) => {
          this.successMessage = 'Updated successfully!';
          this.isSubmitting = false;
        },
        error: (err) => {
          this.errorMessage = 'Update failed.';
          this.isSubmitting = false;
        }
      });
    }else {
      this.uploadService.uploadUpdate(formData, this.documentId).subscribe({
        next: (response: any) => {
          this.successMessage = 'Updated successfully!';
          this.isSubmitting = false;
        },
        error: (err) => {
          this.errorMessage = 'Update failed.';
          this.isSubmitting = false;
        }
      });
    }

    // 2. Cập nhật ảnh phụ (chỉ gọi nếu có ảnh mới được chọn)
    if (this.selectedImg instanceof File) {
      const additionalImgForm = new FormData();
      additionalImgForm.append('img_file', this.selectedImg);

      if (this.selectedImg instanceof File) {
        additionalImgForm.append('image_file', this.selectedImg);

        // Chỉ gọi API khi đã chắc chắn có file
        this.uploadService.uploadAdditionalImage(additionalImgForm, this.documentId).subscribe({
          // ... xử lý kết quả
        });
      } else {
        console.warn("Không có ảnh để upload, bỏ qua bước này.");
      }
    }
    this.router.navigate(['/home'])
  }
}

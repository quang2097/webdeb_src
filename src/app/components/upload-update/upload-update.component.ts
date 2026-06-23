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

  existingCoverUrl: string = '';
  selectedCover: File | null = null;
  novelTitle: string = '';
  novelAuthor: string = '';

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

        this.syncTagsUI();
      }
    });
  }

  syncTagsUI() {
    if (this.listTag && this.listTag.length > 0) {
      this.listTag.forEach(tag => {
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
    const isChecked = (event.target as HTMLInputElement).checked;

    tag.checked = isChecked;

    if (isChecked) {
      this.selectedTags.push(tag.tag_id);
      this.selectedTagsName.push(tag.tag_name);
    } else {
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
    const foundItem = this.listTag.find(item => item.tag_name === tagNameToRemove);
    if (foundItem) {
      foundItem.checked = false;
    }

    const index = this.selectedTagsName.indexOf(tagNameToRemove);

    if (index > -1) {
      this.selectedTags.splice(index, 1);
      this.selectedTagsName.splice(index, 1);
    }
  }

  onFileSelected(e: Event) {
    const inputElement = e.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      this.selectedCover = file;
    }
  }

  removeCover(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.selectedCover = null;

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

    if (this.selectedImg instanceof File) {
      const additionalImgForm = new FormData();
      additionalImgForm.append('img_file', this.selectedImg);

      if (this.selectedImg instanceof File) {
        additionalImgForm.append('image_file', this.selectedImg);

        this.uploadService.uploadAdditionalImage(additionalImgForm, this.documentId).subscribe({
        });
      } else {
        console.warn("Không có ảnh để upload, bỏ qua bước này.");
      }
    }
    this.router.navigate(['/home'])
  }
}

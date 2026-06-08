import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Route, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {UploadService} from "../../services/upload.service";

@Component({
  selector: 'app-upload-update',
  templateUrl: './upload-update.component.html',
  styleUrls: ['./upload-update.component.css']
})
export class UploadUpdateComponent implements OnInit {
  documentId: string = '';

  // Required fields
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    // 3. Store the result in a variable first to make TypeScript happy
    const idFromUrl = this.activatedRoute.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.documentId = idFromUrl;
      // TODO: Fetch your document data here
    } else {
      alert("Document ID is missing")
      this.router.navigate(['/home']);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCover = file;
    }
  }

  onSubmit() {
    if (!this.selectedCover || !this.novelTitle || !this.novelAuthor) {
      this.errorMessage = 'Please fill in all required fields (Cover, Title, and Author).';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('cover_file', this.selectedCover);
    formData.append('novel_title', this.novelTitle);
    formData.append('novel_author', this.novelAuthor);

    if (this.novelDescription) {
      formData.append('novel_description', this.novelDescription);
    }
    if (this.novelSeries) {
      formData.append('novel_series', this.novelSeries);
    }

    formData.append('novel_isprivate', String(this.isPrivate));

    this.uploadService.uploadUpdate(formData,this.documentId).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Novel information updated successfully!';
        console.log('Update success:', response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update novel information.';
        console.error('Update error:', error);
      }
    });
  }
}

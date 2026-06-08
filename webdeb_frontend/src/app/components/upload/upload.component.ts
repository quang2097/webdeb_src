import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import {UploadService} from "../../services/upload.service";
import {provideRouter, Router} from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private uploadService: UploadService, private router: Router) {}

  // Triggered when the user selects a file via the input
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadMessage = '';
      this.errorMessage = '';
      this.uploadProgress = 0;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a PDF file first.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.uploadMessage = '';

    // 1. Prepare the form data (Must match the 'pdf_file' key from Swagger)
    const formData = new FormData();
    formData.append('pdf_file', this.selectedFile);

    // 3. Make the POST request to the exact URL from your cURL command
    this.uploadService.uploadStart(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Calculate the percentage
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          // The upload has completely finished
          this.isUploading = false;
          this.uploadMessage = 'File successfully uploaded to the server!';
          this.router.navigate(['/home/upload/update', event.body.document_id]);

          // TODO: Here you would grab the event.body.document_id and start polling for background processing status
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = 'An error occurred during upload.';
        console.error('Upload error:', err);
      }
    });
  }
}

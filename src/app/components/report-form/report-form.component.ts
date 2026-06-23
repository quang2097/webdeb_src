import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NovelService } from '../../services/novel.service';
import {ReportService} from "../../services/report.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  @Input() novelId: string = '';

  reportForm: FormGroup;
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitReport() {
    if (this.reportForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const reasonText = this.reportForm.value;

    console.log("novel id :"+this.novelId);
    console.log("data : "+reasonText)

    this.reportService.createReport(this.novelId, reasonText).subscribe({
      next: (response) => {
        this.successMessage = 'Your report has been submitted successfully.';
        this.reportForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit report. Please try again.';
        this.isSubmitting = false;
        console.error('Report Error:', err);
      }
    });
  }

}

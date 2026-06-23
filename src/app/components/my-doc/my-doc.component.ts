import {Component, OnDestroy, OnInit} from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {NovelService} from "../../services/novel.service";
import {AuthStateService} from "../../services/auth.state.service";

import { Subscription } from 'rxjs';
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-my-doc',
  templateUrl: './my-doc.component.html',
  styleUrls: ['./my-doc.component.css']
})
export class MyDocComponent implements OnInit, OnDestroy{
  documents: any[] = [];
  reports:any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  novelCurrentPage: number = 1;
  novelTotalPages: number = 1;
  novelJumpPage: number = 1;

  reportCurrentPage: number = 1;
  reportTotalPages: number = 1;
  reportJumpPage: number = 1;

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  private authSubscription!: Subscription;

  constructor(private  novelService: NovelService, private authStateService: AuthStateService, private reportService: ReportService) {
  }
  ngOnInit(): void {
    this.authSubscription = this.authStateService.currentAuthState.subscribe(status => {
      this.isLoggedIn = status.isLoggedIn;
      this.isAdmin = status.isAdmin;
      console.log("MyDoc Page sees Admin status as:", this.isAdmin);
      console.log("MyDoc Page sees Login status as:", this.isLoggedIn);
      this.fetchReports(this.reportCurrentPage)
      this.fetchDocuments(this.novelCurrentPage);
    });

  }

  fetchReports(page:number){
      if(this.isAdmin){
      console.log("fetiching report")
      this.reportService.getReports(page).subscribe({
        next:(data:any) => {
          this.reports= data.items;
          this.reportTotalPages = data.total_pages
          this.reportCurrentPage = data.page
        },
        error: (error) => {
          console.error('Error fetching reports:', error);
          this.errorMessage = 'Failed to load reports from the server.';
          this.isLoading = false;
        }
      })
    }
    if(!this.isAdmin){
      console.log("fetiching report")
      this.reportService.getMyReports(page).subscribe({
        next:(data:any) => {
          this.reports= data.items;
          this.reportTotalPages = data.total_pages
          this.reportCurrentPage = data.page
        },
        error: (error) => {
          console.error('Error fetching reports:', error);
          this.errorMessage = 'Failed to load reports from the server.';
          this.isLoading = false;
        }
      })
    }
  }

  fetchDocuments(page:number): void {
    if(this.isAdmin){
      this.novelService.getAdminDocuments(page).subscribe({
        next: (data:any) => {
          this.documents = data.items;
          this.isLoading = false;
          this.novelTotalPages = data.total_pages
          this.novelCurrentPage = data.page
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
          this.errorMessage = 'Failed to load documents from the server.';
          this.isLoading = false;
        }
      });
    }
    if(!this.isAdmin){
      this.novelService.getUserDocuments(page).subscribe({
        next: (data:any) => {
          this.documents = data.items;
          this.isLoading = false;
          this.novelTotalPages = data.total_pages
          this.novelCurrentPage = data.page
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
          this.errorMessage = 'Failed to load documents from the server.';
          this.isLoading = false;
        }
      });
    }
  }

  goToSpecificNovelPage() {
    if (this.novelJumpPage >= 1 && this.novelJumpPage <= this.novelTotalPages) {
      this.fetchDocuments(this.novelJumpPage);
    } else {
      alert(`Vui lòng nhập trang từ 1 đến ${this.novelTotalPages}`);
      this.novelJumpPage = this.novelCurrentPage;
    }
  }

  goToSpecificReportPage() {
    if (this.reportJumpPage >= 1 && this.reportJumpPage <= this.reportTotalPages) {
      this.fetchReports(this.reportJumpPage);
    } else {
      alert(`Vui lòng nhập trang từ 1 đến ${this.reportTotalPages}`);
      this.reportJumpPage = this.reportCurrentPage;
    }
  }



  deleteDoc(novelId: string): void {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {

      this.novelService.deleteNodelById(novelId).subscribe({
        next: () => {
          this.documents = this.documents.filter(doc => doc.novel_id !== novelId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete the user. Please check the console for details.');
        }
      });
    }
  }

  deleteReport(reportId: string): void {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {

      this.reportService.deleteReport(reportId).subscribe({
        next: () => {
          this.reports = this.reports.filter(report => report.report_id !== reportId);
        },
        error: (err) => {
          console.error('Error deleting report:', err);
          alert('Failed to delete the report. Please check the console for details.');
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }


}

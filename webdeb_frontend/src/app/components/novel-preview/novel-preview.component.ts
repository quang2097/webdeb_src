import {Component, OnInit} from '@angular/core';
import {NovelDetail} from "../../dto/response.model";
import {NovelService} from "../../services/novel.service";
import {ActivatedRoute} from "@angular/router";
import {enviroments} from "../../../enviroments";

@Component({
  selector: 'app-novel',
  templateUrl: './novel-preview.component.html',
  styleUrls: ['./novel-preview.component.css']
})
export class NovelPreviewComponent implements OnInit{
  apiUrl:string = enviroments.API_URL;
  novelId: string = '';
  novelData: NovelDetail | null = null;

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private novelService: NovelService,private activatedRoute : ActivatedRoute) {}

  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.novelId = idFromUrl;
      this.fetchNovel();
    }
  }

  fetchNovel(): void {

    this.isLoading = true;
    this.errorMessage = '';
    this.novelData = null;

    this.novelService.getNovelContentById(this.novelId).subscribe({
      next: (data) => {
        this.novelData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching novel:', error);
        this.errorMessage = 'Failed to load novel data. Please check the ID and try again.';
        this.isLoading = false;
      }
    });
  }
}

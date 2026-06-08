import {Component, OnInit} from '@angular/core';
import {NovelService} from "../../services/novel.service";
import {enviroments} from "../../../enviroments";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  api_url: string = enviroments.API_URL
  novels: any[] = [];

  constructor(private novelService: NovelService) { }

  ngOnInit(): void {
    this.fetchNovels();
  }

  fetchNovels(): void {
    this.novelService.getNovelList().subscribe({
      next: (data) => {
        this.novels = data;
      },
      error: (error) => {
        console.error('Error fetching novels:', error);
      }
    });
  }

  protected readonly enviroments = enviroments;
}

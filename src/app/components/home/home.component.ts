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
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.total_pages;

        this.jumpPage = this.currentPage;
      },
      error: (error) => {
        console.error('Error fetching novels:', error);
      }
    });
  }

  goToSpecificPage() {
    if (this.jumpPage >= 1 && this.jumpPage <= this.totalPages) {
      this.fetchNovels(this.jumpPage);
    } else {
      alert(`Vui lòng nhập trang từ 1 đến ${this.totalPages}`);
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
    if (this.selectedTags.length === 0) {
      this.fetchNovels(1);
    }

    this.currentPage = 1;

    let params = new HttpParams();

    this.selectedTags.forEach(id => {
      params = params.append('tag_ids', id);
    });

    this.novelService.getNovelsByAllTags(params,this.currentPage).subscribe({
      next: (response: any) => {
        console.log("Search Successful! Found novels:", response);

        this.novels = response.data;

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
    if (this.isDragging) {
      return;
    }
    this.router.navigate(['/home/novel/preview', novelId]);
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  protected readonly onmousedown = onmousedown;
}

import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {enviroments} from "../../../enviroments";
import {MarkdownService} from "ngx-markdown";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements AfterViewInit, OnInit,OnDestroy {
  public zoomLevel: number = 1.0;
  public showToolbar: boolean = false;

  apiUrl : string = enviroments.API_URL
  typeFromUrl: string|null = ''
  idFromUrl: string | null = '';
  fileUrlFromUrl: string | null = '';

  imageUrls: string[] = [];

  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  @ViewChild('toolbar') toolbarElement!: ElementRef;

  private boundWheelListener = this.onWheel.bind(this);

  constructor(private activatedRoute : ActivatedRoute,private markdownService: MarkdownService,private http:HttpClient) {
  }

  ngOnInit(): void {
    this.typeFromUrl = this.activatedRoute.snapshot.paramMap.get('type')
    this.fileUrlFromUrl = this.activatedRoute.snapshot.paramMap.get('file_url')
    this.idFromUrl = this.activatedRoute.snapshot.paramMap.get('id')

    this.markdownService.renderer.image = ({ href, title, text }: any) => {
      let cleanHref: string = href;

      if (href && href.startsWith('local_storage/')) {
        cleanHref = href.replace('local_storage/', '');
      }

      href = `${this.apiUrl}storage/view/local_storage/${cleanHref}`;

      return `<img src="${href}" alt="${text}" title="${title || ''}" class="img-fluid" style="max-width: 100%;" />`;
    };

    if (this.typeFromUrl === 'markdown' || this.typeFromUrl === 'markdown_reveal') {

      if (this.fileUrlFromUrl) {

        const folderName = this.fileUrlFromUrl.replace('.md', '');
        this.fetchSecondaryImages(folderName);
      }
    }
  }

  fetchSecondaryImages(folderName: string) {
    const apiListUrl = `${this.apiUrl}storage/list/local_storage/image_secondary/${folderName}`;

    this.http.get<{images: string[]}>(apiListUrl).subscribe({
      next: (res) => {
        this.imageUrls = res.images;
      },
      error: (err) => {
        console.log('Không có ảnh phụ hoặc lỗi API:', err);
      }
    });
  }
  ngAfterViewInit() {

    if (this.pdfContainer) {

      this.pdfContainer.nativeElement.addEventListener('wheel', this.boundWheelListener, { passive: false });
    }
  }

  ngOnDestroy() {
    if (this.pdfContainer) {
      this.pdfContainer.nativeElement.removeEventListener('wheel', this.boundWheelListener);
    }
  }


  onWheel(event: WheelEvent) {

    if (event.ctrlKey) {
      event.preventDefault();

      this.showToolbar = true;

      if (event.deltaY > 0) {
        this.zoomOut();
      } else {
        this.zoomIn();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.showToolbar) return;

    const clickedInside = this.toolbarElement?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showToolbar = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (event.ctrlKey) {


      if (event.key === '+' || event.key === '=' || event.code === 'NumpadAdd') {
        event.preventDefault();
        this.showToolbar = true;
        this.zoomIn();
      }


      else if (event.key === '-' || event.code === 'NumpadSubtract') {
        event.preventDefault();
        this.showToolbar = true;
        this.zoomOut();
      }
    }
  }

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.3) {
      this.zoomLevel -= 0.1;
    }
  }

  get zoomPercentage(): number {
    return Math.round(this.zoomLevel * 100);
  }

  onManualZoom(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);

    if (value < 30) value = 30;

    this.zoomLevel = value / 100;
  }

}

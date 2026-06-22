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
  public showToolbar: boolean = false; // <--- 1. Add visibility tracker

  apiUrl : string = enviroments.API_URL
  typeFromUrl: string|null = ''
  idFromUrl: string | null = '';
  fileUrlFromUrl: string | null = '';

  imageUrls: string[] = [];

  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  @ViewChild('toolbar') toolbarElement!: ElementRef; // <--- 2. Add toolbar reference
  // We have to bind the context of 'this' so it works inside the event listener
  private boundWheelListener = this.onWheel.bind(this);

  constructor(private activatedRoute : ActivatedRoute,private markdownService: MarkdownService,private http:HttpClient) {
  }

  ngOnInit(): void {
    this.typeFromUrl = this.activatedRoute.snapshot.paramMap.get('type')
    this.fileUrlFromUrl = this.activatedRoute.snapshot.paramMap.get('file_url')
    this.idFromUrl = this.activatedRoute.snapshot.paramMap.get('id')

// Bọc các tham số vào trong { href, title, text } để khớp với kiểu Image của thư viện
    this.markdownService.renderer.image = ({ href, title, text }: any) => {
      let cleanHref: string = href;

      if (href && href.startsWith('local_storage/')) {
        cleanHref = href.replace('local_storage/', '');
      }

      // Nối với endpoint backend của bạn
      href = `${this.apiUrl}storage/view/local_storage/${cleanHref}`;

      return `<img src="${href}" alt="${text}" title="${title || ''}" class="img-fluid" style="max-width: 100%;" />`;
    };

    if (this.typeFromUrl === 'markdown' || this.typeFromUrl === 'markdown_reveal') {
      // Giả sử tên thư mục ảnh trùng với tên file markdown (biến fileUrlFromUrl)
      // Ví dụ: fileUrlFromUrl là "6ef8ced1903..." thì thư mục ảnh cũng tên vậy
      if (this.fileUrlFromUrl) {
        // Cắt bỏ đuôi .md nếu có để lấy đúng tên thư mục
        const folderName = this.fileUrlFromUrl.replace('.md', '');
        this.fetchSecondaryImages(folderName);
      }
    }
  }

  fetchSecondaryImages(folderName: string) {
    const apiListUrl = `${this.apiUrl}storage/list/local_storage/image_secondary/${folderName}`;

    this.http.get<{images: string[]}>(apiListUrl).subscribe({
      next: (res) => {
        this.imageUrls = res.images; // Gán dữ liệu trả về vào mảng
      },
      error: (err) => {
        console.log('Không có ảnh phụ hoặc lỗi API:', err);
      }
    });
  }

  // 2. Attach the strict listener AFTER the HTML loads
// 2. Attach the strict listener AFTER the HTML loads
  ngAfterViewInit() {
    // Thêm dòng IF này để check: Chỉ khi nào mở file PDF (thẻ có tồn tại) thì mới gắn sự kiện
    if (this.pdfContainer) {
      // The { passive: false } is CRITICAL. It tells Chrome "Wait, I might cancel this scroll!"
      this.pdfContainer.nativeElement.addEventListener('wheel', this.boundWheelListener, { passive: false });
    }
  }
  // 3. Clean up the listener if the user leaves the page to save memory
  ngOnDestroy() {
    if (this.pdfContainer) {
      this.pdfContainer.nativeElement.removeEventListener('wheel', this.boundWheelListener);
    }
  }

  // 4. The actual Zoom Logic
  onWheel(event: WheelEvent) {
    // Only trigger if they are holding the Control key
    if (event.ctrlKey) {
      event.preventDefault(); // STOPS the whole browser window from zooming!

      this.showToolbar = true;

      // deltaY is the scroll direction. Positive = scrolling down/towards you.
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

    // Check if the click was inside the toolbar
    const clickedInside = this.toolbarElement?.nativeElement.contains(event.target);

    // If click was outside, hide the toolbar
    if (!clickedInside) {
      this.showToolbar = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Only trigger if they are holding the Control key
    if (event.ctrlKey) {

      // Check for Zoom In: We check both '+' and '=' because
      // the '+' key usually requires holding Shift as well!
      if (event.key === '+' || event.key === '=' || event.code === 'NumpadAdd') {
        event.preventDefault(); // Stops the whole browser from zooming
        this.showToolbar = true; // Show our custom UI
        this.zoomIn();
      }

      // Check for Zoom Out
      else if (event.key === '-' || event.code === 'NumpadSubtract') {
        event.preventDefault(); // Stops the whole browser from zooming
        this.showToolbar = true; // Show our custom UI
        this.zoomOut();
      }
    }
  }

  // --- Your existing zoom methods below ---
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

    // Keep the zoom within a reasonable range (e.g., 30% to 300%)
    if (value < 30) value = 30;
    // if (value > 500) value = 500;

    // Convert the percentage back into the decimal format the library expects
    this.zoomLevel = value / 100;
  }

}

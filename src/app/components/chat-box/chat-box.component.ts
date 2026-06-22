import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import {SearchService} from "../../services/search.service";
import {ChatSearchRequest} from "../../dto/request.model";
import {FormBuilder} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {ChatbotService} from "../../services/chatbot.service";
import {Router} from "@angular/router";

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  linkUrl?: string;
  linkText?: string;
}

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})


export class ChatBoxComponent implements AfterViewChecked, OnInit, OnChanges {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  messages: ChatMessage[] = [];
  startMessage: string = '';
  newMessage: string = '';

  // 1. Thêm biến cờ để theo dõi trạng thái load của Bot
  isBotLoading: boolean = false;

  chatFormSearch: any;
  chatFormNovel: any;
  @Input() type: string = '';
  @Input() novelId: string = '';
  @Input() novelTitle: string = '';

  constructor(private chatbotService: ChatbotService, private fb: FormBuilder) {
    this.chatFormSearch = this.fb.group({
      question: [''],
      limit: [10],
      top_k: [8]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['novelId'] && this.novelId) {
      this.chatFormNovel = this.fb.group({
        novel_id: [this.novelId],
        question: [''],
        history: [this.chatbotService.getChatbotHistory()],
        top_k: [8]
      });
    }
  }

  ngOnInit(): void {
    if (this.type == 'search') {
      this.startMessage = "Chatbot for novel searching";
    } else {
      this.startMessage = "Chatbot for answering questions about " + this.novelTitle;
    }
    this.messages = [
      { sender: 'bot', text: this.startMessage, timestamp: new Date() }
    ];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    if (!this.newMessage.trim() || this.isBotLoading) return;

    this.isBotLoading = true;
    const userPrompt = this.newMessage;
    this.newMessage = '';

    this.messages.push({
      sender: 'user',
      text: userPrompt,
      timestamp: new Date()
    });

    var botResponse = '';
    var data: any = '';
    // 1. Tạo biến cờ để kiểm soát việc có hiện link hay không
    let novelFound = false;

    if (this.type == "search") {
      try {
        this.chatFormSearch.value.question = userPrompt;
        data = await firstValueFrom(this.chatbotService.aiSearch(this.chatFormSearch.value));

        // Kiểm tra nếu mảng novels trả về có phần tử thì mới tính là tìm thấy
        if (data && data.novels && data.novels.length > 0) {
          this.novelId = data.novels[0].novel_id;
          botResponse = data.extracted_query;
          novelFound = true; // Bật cờ tìm thấy truyện thành công!
        } else {
          botResponse = "No novels found matching the AI search query";
          novelFound = false;
        }
      } catch (err: any) {
        // Nếu sập vào catch (như trường hợp lỗi 404 trong ảnh của ông), khóa cờ lại ngay
        novelFound = false;
        if ((err.error?.detail) == 'undefined') {
          botResponse = "thay apiKey";
        } else {
          botResponse = '' + (err.error?.detail);
        }
      }
    } else {
      try {
        this.chatFormNovel.value.question = userPrompt;
        data = await firstValueFrom(this.chatbotService.aiChatNovel(this.chatFormNovel.value));
        this.chatbotService.saveChatbotHistory(data.answer);
        botResponse = data.answer;
      } catch (err: any) {
        botResponse = (err.error?.detail) == 'undefined' ? "thay apiKey" : '' + (err.error?.detail);
      }
    }

    setTimeout(() => {
      // 2. Chỉ add linkUrl khi THỰC SỰ tìm thấy truyện (novelFound === true)
      if (this.type == 'search' && novelFound) {
        this.messages.push({
          sender: 'bot',
          text: botResponse,
          timestamp: new Date(),
          linkUrl: `/home/novel/preview/${this.novelId}`,
          linkText: "Click here to read it"
        });
      } else {
        // Trường hợp không tìm thấy truyện hoặc chat với novel thông thường, không hiện link
        this.messages.push({
          sender: 'bot',
          text: botResponse,
          timestamp: new Date(),
        });
      }

      this.isBotLoading = false;
    }, 1000);
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UploadComponent } from './components/upload/upload.component';
import {UploadUpdateComponent} from "./components/upload-update/upload-update.component";
import { AdminComponent } from './components/admin/admin.component';
import { NovelPreviewComponent } from './components/novel-preview/novel-preview.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { DocViewComponent } from './components/doc-view/doc-view.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {MarkdownModule} from "ngx-markdown";
import { MyDocComponent } from './components/my-doc/my-doc.component';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    UploadComponent,
    UploadUpdateComponent,
    AdminComponent,
    NovelPreviewComponent,
    ChatBoxComponent,
    DocViewComponent,
    MyDocComponent,
    ReportFormComponent,
    ResetPasswordComponent,
    ActivateAccountComponent,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,     // <-- Thêm vào đây
    ReactiveFormsModule,   // <-- Thêm vào đây
    PdfViewerModule,
    MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

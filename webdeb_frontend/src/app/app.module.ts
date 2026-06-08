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

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,     // <-- Thêm vào đây
    ReactiveFormsModule   // <-- Thêm vào đây
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

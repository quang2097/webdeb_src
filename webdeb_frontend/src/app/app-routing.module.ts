import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {UploadComponent} from "./components/upload/upload.component";
import {UploadUpdateComponent} from "./components/upload-update/upload-update.component";
import {AdminComponent} from "./components/admin/admin.component";
import {NovelPreviewComponent} from "./components/novel-preview/novel-preview.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },   // Sẽ thành: /auth/login
      { path: 'signup', component: SignupComponent }  // Sẽ thành: /auth/signup
    ]
  },

  {path: 'home',
    children: [
      {path: '', component: HomeComponent},
      {path: 'profile', component: ProfileComponent},
      {path:'upload',
        children: [
          {path:'start',component: UploadComponent},
          {path:'update/:id',component: UploadUpdateComponent}
        ]
      },
      {path:'novel',
        children:[
          {path:'preview/:id',component: NovelPreviewComponent},
          // {path:'content/:id',component: NovelComponent}
        ]
      }
    ]
  },

  {path: 'admin',component:AdminComponent},

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

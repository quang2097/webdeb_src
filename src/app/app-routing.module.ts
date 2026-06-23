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
import {DocViewComponent} from "./components/doc-view/doc-view.component";
import {MyDocComponent} from "./components/my-doc/my-doc.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {ActivateAccountComponent} from "./components/activate-account/activate-account.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup/:type', component: SignupComponent }  ,
      { path: 'reset/password', component: ResetPasswordComponent},
      { path:'activate', component: ActivateAccountComponent}
    ]
  },

  {path: 'home',
    children: [
      {path: '', component: HomeComponent},
      {path:'profile', component: ProfileComponent},
      {path:'upload',
        children: [
          {path:'start',component: UploadComponent},
          {path:'update/:id',component: UploadUpdateComponent},
          {path:'user/documents',component: MyDocComponent}
        ]
      },
      {path:'novel',
        children:[
          {path:'preview/:id',component: NovelPreviewComponent},
          {path:'view/local_storage/:type/:file_url/:id',component: DocViewComponent}
        ]
      }
    ]
  },

  {path: 'admin',component:AdminComponent},

// Wildcard route: Chuyển hướng mọi đường dẫn không hợp lệ về /home
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

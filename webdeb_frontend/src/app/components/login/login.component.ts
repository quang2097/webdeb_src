import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  // Xóa standalone và imports đi
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['admin123456', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const formValues = this.loginForm.value;

      // Map dữ liệu chuẩn bị gửi đi
      const requestData = {
        username: formValues.email,   // Gán email vào trường username
        password: formValues.password
      };

      // Gửi requestData vào service
      this.authService.login(requestData).subscribe({
        next: (response) => {
            this.authService.saveToken(response.access_token);
            this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Lỗi đăng nhập: ' + (err.error?.detail || 'Sai thông tin'));
        }
      });
    }
  }

}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.emailForm = this.fb.group({
        email: ['Trinhvietcuong690@gmail.com', [Validators.required, Validators.email]]
      });
    } else {
      this.passwordForm = this.fb.group({
        new_password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  }

  onRequestReset() {
    if (this.emailForm.invalid) return;

    this.authService.forgotPassword(this.emailForm.value).subscribe({
      next: () => {
        alert('Nếu email tồn tại trong hệ thống, link khôi phục đã được gửi!');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Lỗi: ' + (err.error?.detail || 'Không thể yêu cầu đặt lại mật khẩu'));
      }
    });
  }

  onResetPassword() {
    if (this.passwordForm.invalid || !this.token) return;

    const payload = {
      token: this.token,
      new_password: this.passwordForm.value.new_password
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        alert('Đặt lại mật khẩu thành công!');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Lỗi: ' + (err.error?.detail || 'Token không hợp lệ hoặc đã hết hạn'));
      }
    });
  }
}

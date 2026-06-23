import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  otpForm!: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('user_id');

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    if (!this.userId) {
      alert('Không tìm thấy thông tin phiên đăng ký. Vui lòng thử lại.');
      this.router.navigate(['/auth/signup']);
    }
  }

  onActivate() {
    if (this.otpForm.invalid || !this.userId) return;

    const payload = {
      user_id: this.userId,
      otp: this.otpForm.value.otp
    };

    this.authService.activateAccount(payload).subscribe({
      next: () => {
        alert('Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Lỗi: ' + (err.error?.detail || 'Mã OTP không chính xác hoặc đã hết hạn.'));
      }
    });
  }
}

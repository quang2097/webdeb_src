import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userForm!: FormGroup; // Chỉ dùng 1 form duy nhất
  type: string | null = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type') || 'register';

    // Xác định validator tùy theo mode
    const isRegister = this.type === 'register';

    this.userForm = this.fb.group({
      user_name: ['', isRegister ? Validators.required : null],
      user_email: ['', isRegister ? [Validators.required, Validators.email] : [Validators.email]],
      password: ['', isRegister ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    // === TRƯỜNG HỢP: ĐĂNG KÝ ===
    if (this.type === 'register') {
      this.authService.signup(this.userForm.value).subscribe({
        next: () => {
          alert('Đăng ký thành công!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Lỗi: ' + (err.error?.detail || 'Không thể đăng ký'));
        }
      });
      return;
    }

    // === TRƯỜNG HỢP: CẬP NHẬT ===
    if (this.type === 'update') {
      const rawValues = this.userForm.value;
      const dataToSend: any = {};

      // Lọc bỏ các trường trống
      Object.keys(rawValues).forEach(key => {
        const value = rawValues[key];
        if (value !== null && value !== undefined && value.toString().trim() !== '') {
          dataToSend[key] = typeof value === 'string' ? value.trim() : value;
        }
      });

      if (Object.keys(dataToSend).length === 0) {
        alert('Vui lòng điền ít nhất một thông tin cần thay đổi!');
        return;
      }

      this.userService.updateInfo(dataToSend).subscribe({
        next: (response:any) => {
          console.log(response)
          console.log("thong tin gui di:",dataToSend)
          alert('Thay đổi thông tin thành công!');
          this.router.navigate(['/home/profile']);
        },
        error: (err) => {
          alert('Lỗi: ' + (err.error?.detail || 'Không thể thay đổi thông tin'));
        }
      });
    }
  }
}

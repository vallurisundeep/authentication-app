import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ILoginRequest } from '../../models/login-request';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
   templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor() {}
  public loginError: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  private authService = inject(AuthService);
  private router = inject(Router);
  loginSubmit() {
    if (this.loginForm.valid) {
      const loginData: ILoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loginError = '';
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.loginError = 'Invalid email or password. Please try again.';
          } else {
            this.loginError = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    }
  }
}

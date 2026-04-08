import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.auth.login(payload).subscribe({
      next: (res: any) => {
        const token = res.token;

        // Store token
        localStorage.setItem('token', token);

        // Decode token
        const decoded: any = jwtDecode(token);

        const user = {
          userId: decoded.nameid,
          username: decoded.unique_name,
          role: decoded.role
        };

        console.log('Logged in user:', user);

        // Store user
        localStorage.setItem('user', JSON.stringify(user));

        alert('Login Successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login Error:', err);
        alert('Invalid credentials');
      }
    });
  }
}
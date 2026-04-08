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
  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const token = res.token;
        // storing token
        localStorage.setItem('token', token);

        // storing user details
        const decoded: any = jwtDecode(token);

        // console.log('Decoded Token:', decoded);
        const user = {
          userId: decoded.nameid,
          email: decoded.email,
          name: decoded.unique_name   //  IMPORTANT (from ClaimTypes.Name)
        };
        console.log(user);
        
        // Store user
        localStorage.setItem('user', JSON.stringify(user));
        alert('Login Successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Invalid credentials');
      }
    });
  }
}

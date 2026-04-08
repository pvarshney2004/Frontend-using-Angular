import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private router: Router) { }

  @Output() refresh = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  isRefreshing = false;
  showProfile = false;
  user: any = {}

  ngOnInit() {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
      console.log(this.user);
      
    }
  }
  onRefresh() {
    this.isRefreshing = true;
    this.refresh.emit();
    setTimeout(() => {
      this.isRefreshing = false;
    }, 800);
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }

  toggleSidebar() {
    this.menuToggle.emit();
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  addAccount() {
    this.router.navigate(['/register']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}

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
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = {
      name: userData.name || 'User',
      email: userData.email || ''
    };

  }
  onRefresh() {
    this.isRefreshing = true;
    this.refresh.emit(); //notify parent (dashboard)
    setTimeout(() => {
      this.isRefreshing = false;
    }, 800); // animation duration
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);   // send to parent
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

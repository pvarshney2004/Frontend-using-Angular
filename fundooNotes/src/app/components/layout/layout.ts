import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  
  isCollapsed = false;

  handleRefresh() {
    // trigger global reload using custom event
    window.dispatchEvent(new Event('refreshNotes'));
  }

  handleSearch(value: string) {
  // lobal event (same pattern as refresh)
  window.dispatchEvent(new CustomEvent('searchNotes', { detail: value }));
}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
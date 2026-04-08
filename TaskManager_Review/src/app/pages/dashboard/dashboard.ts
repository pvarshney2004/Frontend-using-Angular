import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../services/tasks';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskCard } from '../../components/task-card/task-card';
import { Header } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TaskForm, TaskCard, Header, Sidebar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  constructor(private taskService: Tasks, private cdr: ChangeDetectorRef, private router: Router) { }
  get isTrashRoute(): boolean {
    return this.router.url.includes('completed');
  }

  isCollapsed = false;

  allTasks: any[] = [];
  filteredTasks: any[] = [];

  isAdmin = false;


  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin';
    this.loadTasks();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  loadTasks() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role === 'admin') {
      this.taskService.getAllTasksAdmin().subscribe((res: any) => {
        this.allTasks = res;
        this.filteredTasks = res;

        console.log('Admin tasks:', this.allTasks);

        this.cdr.detectChanges();
      });
    } else {
      this.taskService.getTasks().subscribe((res: any) => {
        this.allTasks = res;
        this.filteredTasks = res;

        console.log('User tasks:', this.allTasks);

        this.cdr.detectChanges();
      });
    }
  }

  onSearch(searchText: string) {
    if (!searchText) {
      this.filteredTasks = this.allTasks;
      return;
    }

    const lower = searchText.toLowerCase();

    this.filteredTasks = this.allTasks.filter(task =>
      task.title.toLowerCase().includes(lower)
    );
  }

  trackById(index: number, task: any) {
    return task.id;
  }
}
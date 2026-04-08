import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tasks } from '../../services/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {

  @Input() task: any;
  @Output() refresh = new EventEmitter<void>();
  @Input() isAdmin: boolean = false;

  isEditing = false;
  editTask: any = {};

  constructor(private taskService: Tasks) { }

  enableEdit() {
    this.isEditing = true;
    this.editTask = { ...this.task };
  }

  saveEdit() {
    this.taskService.updateTask(this.task.id, this.editTask).subscribe(() => {
      this.isEditing = false;
      this.refresh.emit();
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }

  toggleComplete() {
    const updated = {
      title: this.task.title,
      description: this.task.description,
      isCompleted: !this.task.isCompleted
    };

    this.taskService.updateTask(this.task.id, updated).subscribe(() => {
      this.refresh.emit();
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe(() => {
      this.refresh.emit();
    });
  }
}
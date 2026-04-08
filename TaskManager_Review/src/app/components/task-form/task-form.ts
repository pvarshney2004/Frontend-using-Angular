import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tasks } from '../../services/tasks';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {

  @Output() taskCreated = new EventEmitter<void>();

  taskForm: FormGroup;
  isExpanded = false;

  expandForm() {
    this.isExpanded = true;
  }

  closeForm(event: Event) {
    event.stopPropagation();
    this.isExpanded = false;
    this.taskForm.reset();
  }

  constructor(private fb: FormBuilder, private taskService: Tasks) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  createTask() {
    if (this.taskForm.invalid) return;

    this.taskService.createTask(this.taskForm.value).subscribe(() => {
      this.taskForm.reset();
      this.taskCreated.emit();
    });
  }
}
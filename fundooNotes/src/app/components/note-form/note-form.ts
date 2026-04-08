import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Notes } from '../../services/notes';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-form.html',
  styleUrls: ['./note-form.scss']
})
export class NoteForm {

  noteForm: FormGroup;
  @Output() noteCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private notesService: Notes) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  createNote() {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }
    this.notesService.createNote(this.noteForm.value).subscribe(() => {
      this.noteForm.reset();
      this.noteCreated.emit();
    });
  }
}
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Notes } from '../../services/notes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
})
export class NoteCard {

  constructor(private notesService: Notes) { }

  showColors = false;
  colors: string[] = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475',
    '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa',
    '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];
  @ViewChild('reminderInput', { static: false }) reminderInput!: ElementRef;
  @Input() note: any;
  @Output() refresh = new EventEmitter();
  @Output() edit = new EventEmitter<any>();

  openReminderPicker() {
    if (this.reminderInput?.nativeElement) {
      this.reminderInput.nativeElement.showPicker(); // modern browsers
    }
  }

  setReminder(event: any) {
    const value = event.target.value;
    if (!value) return;
    const reminderDate = new Date(value).toISOString();
    this.note.reminder = reminderDate;
    this.notesService.setReminder(this.note.noteId, reminderDate).subscribe({
      next: () => console.log('Reminder set'),
      error: (err) => console.error(err)
    });
  }

  toggleColorPalette() {
    this.showColors = !this.showColors;
  }

  changeColor(color: string) {
    this.note.color = color;
    this.notesService.updateNoteColor(this.note.noteId, color).subscribe({
      next: () => console.log('Color updated'),
      error: (err) => console.error(err)
    });
    this.showColors = false;
  }

  openEdit() {
    this.edit.emit(this.note);
  }

  deleteNote() {
    this.notesService.deleteNote(this.note.noteId).subscribe(() => {
      this.refresh.emit();
    });
  }

  toggleArchive() {
    this.notesService.toggleArchive(this.note.noteId).subscribe(() => {
      this.refresh.emit();
    });
  }

  removeReminder(event: any) {
    event.stopPropagation();
    this.notesService.setReminder(this.note.noteId, null).subscribe({
      next: () => {
        this.note.reminder = null;
        this.refresh.emit();
      }
    });
  }

  togglePin(event: any) {
    event.stopPropagation();

    this.notesService.togglePin(this.note.noteId).subscribe({
      next: () => {
        this.note.isPin = !this.note.isPin;

        // If pinned → remove archive
        if (this.note.isPin && this.note.isArchived) {
          this.notesService.toggleArchive(this.note.noteId).subscribe(() => {
            this.refresh.emit();
          });
        } else {
          this.refresh.emit();
        }
      },
      error: (err) => console.error(err)
    });
  }

}
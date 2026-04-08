import { ChangeDetectorRef, Component } from '@angular/core';
import { NoteCard } from '../note-card/note-card';
import { CommonModule } from '@angular/common';
import { Notes } from '../../services/notes';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reminder',
  imports: [NoteCard, CommonModule, FormsModule],
  templateUrl: './reminder.html',
  styleUrls: ['./reminder.scss'],
})
export class Reminder {

  constructor(private notesService: Notes, private cdr: ChangeDetectorRef) { }

  allReminderNotes: any[] = [];
  reminderNotes: any[] = [];

  selectedNote: any = null;
  isEditOpen = false;

  ngOnInit() {
    this.loadNotes();

    // optional: global refresh + search support
    window.addEventListener('refreshNotes', () => {
      this.loadNotes();
    });

    window.addEventListener('searchNotes', (event: any) => {
      this.onSearch(event.detail);
    });
  }

  loadNotes() {
    forkJoin([
      this.notesService.getNotes(),
      this.notesService.getArchiveNotes()
    ]).subscribe({
      next: ([notes1, notes2]: any) => {

        const mapped1 = notes1.map((n: any) => ({
          ...n,
          color: n.colour
        }));

        const mapped2 = notes2.map((n: any) => ({
          ...n,
          color: n.colour
        }));

        const filtered1 = mapped1.filter((n: any) => n.reminder);
        const filtered2 = mapped2.filter((n: any) => n.reminder);

        // ✅ store original
        this.allReminderNotes = [...filtered1, ...filtered2];

        // ✅ initialize UI list
        this.reminderNotes = [...this.allReminderNotes];

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  onSearch(searchText: string) {
    if (!searchText) {
      this.reminderNotes = [...this.allReminderNotes];
      return;
    }

    const lower = searchText.toLowerCase();

    this.reminderNotes = this.allReminderNotes.filter(note =>
      note.title?.toLowerCase().includes(lower)
    );
  }

  // ✅ EDIT FUNCTIONS

  openEditNote(note: any) {
    this.selectedNote = { ...note }; // clone
    this.isEditOpen = true;
  }

  updateNote() {
    this.notesService.updateNote(this.selectedNote.noteId, {
      title: this.selectedNote.title,
      description: this.selectedNote.description
    }).subscribe({
      next: () => {
        this.closeEdit();
        this.loadNotes(); // refresh reminders
      },
      error: (err) => console.error(err)
    });
  }

  closeEdit() {
    this.isEditOpen = false;
  }

  trackByNoteId(index: number, note: any) {
    return note.noteId;
  }
}
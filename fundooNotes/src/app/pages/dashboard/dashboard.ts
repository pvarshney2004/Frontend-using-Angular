import { ChangeDetectorRef, Component } from '@angular/core';
import { NoteForm } from '../../components/note-form/note-form';
import { NoteCard } from '../../components/note-card/note-card';
import { Notes } from '../../services/notes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [NoteForm, NoteCard, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private notesService: Notes, private cdr: ChangeDetectorRef) { }


  allNotes: any[] = [];
  pinnedNotes: any[] = [];
  otherNotes: any[] = [];

  // notes: any[] = [];
  selectedNote: any = null;
  isEditOpen = false;

  ngOnInit() {
    this.loadNotes();
    window.addEventListener('refreshNotes', () => {
      this.loadNotes();
    });

    window.addEventListener('searchNotes', (event: any) => {
      this.onSearch(event.detail);
    });
  }

  openEditNote(note: any) {
    this.selectedNote = { ...note }; // clone (important)
    this.isEditOpen = true;
  }

  updateNote() {
    this.notesService.updateNote(this.selectedNote.noteId, {
      title: this.selectedNote.title,
      description: this.selectedNote.description
    }).subscribe({
      next: () => {
        this.closeEdit();
        this.loadNotes(); // refresh UI
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
  loadNotes() {
    this.notesService.getNotes().subscribe((res: any) => {

      this.allNotes = res.map((n: any) => ({
        ...n,
        color: n.colour
      }));

      this.splitNotes(this.allNotes);

      this.cdr.detectChanges();
    });
  }

  splitNotes(data: any[]) {
    this.pinnedNotes = data.filter(n => n.isPin && !n.isArchived);
    this.otherNotes = data.filter(n => !n.isPin && !n.isArchived);
  }

  onSearch(searchText: string) {
    if (!searchText) {
      this.pinnedNotes = this.allNotes.filter(n => n.isPinned);
      this.otherNotes = this.allNotes.filter(n => !n.isPinned);
      return;
    }

    const lower = searchText.toLowerCase();

    const filtered = this.allNotes.filter(note =>
      note.title?.toLowerCase().includes(lower)
    );

    this.pinnedNotes = filtered.filter(n => n.isPinned);
    this.otherNotes = filtered.filter(n => !n.isPinned);
  }
}

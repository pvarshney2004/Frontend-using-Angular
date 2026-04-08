import { ChangeDetectorRef, Component } from '@angular/core';
import { Notes } from '../../services/notes';
import { CommonModule } from '@angular/common';
import { NoteCard } from '../note-card/note-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, NoteCard, FormsModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss'],
})
export class Archive {
  archiveNotes: any[] = [];
  archiveNotesFiltered: any[] = [];
  searchText: string = '';

  selectedNote: any = null;
  isEditOpen = false;

  constructor(private notesService: Notes, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadArchiveNotes();

    // Optional: listen to global search (from header)
    window.addEventListener('searchNotes', (event: any) => {
      this.onSearch(event.detail);
    });

    window.addEventListener('refreshNotes', () => {
      this.loadArchiveNotes();
    });
  }

  loadArchiveNotes() {
    this.notesService.getArchiveNotes().subscribe((res: any) => {

      this.archiveNotes = res.map((n: any) => ({
        ...n,
        color: n.colour
      }));

      // ❗ exclude pinned
      this.archiveNotesFiltered = this.archiveNotes.filter(n => !n.isPin);

      this.cdr.detectChanges();
    });
  }

  onSearch(searchText: string) {
    if (!searchText) {
      this.archiveNotesFiltered = [...this.archiveNotes];
      return;
    }

    const lower = searchText.toLowerCase();
    this.archiveNotesFiltered = this.archiveNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(lower)
    );
  }

  openEditNote(note: any) {
    this.selectedNote = { ...note }; // clone to avoid mutating original array
    this.isEditOpen = true;
  }

  updateNote() {
    this.notesService.updateNote(this.selectedNote.noteId, {
      title: this.selectedNote.title,
      description: this.selectedNote.description,
    }).subscribe({
      next: () => {
        this.closeEdit();
        this.loadArchiveNotes(); // refresh the archive notes
      },
      error: (err) => console.error(err),
    });
  }

  closeEdit() {
    this.isEditOpen = false;
  }

  trackByNoteId(index: number, note: any) {
    return note.noteId;
  }
}
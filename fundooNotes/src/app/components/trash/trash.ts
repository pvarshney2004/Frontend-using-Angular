import { ChangeDetectorRef, Component } from '@angular/core';
import { Notes } from '../../services/notes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trash',
  imports: [CommonModule],
  templateUrl: './trash.html',
  styleUrl: './trash.scss',
})
export class Trash {
  constructor(private notesService: Notes, private cdr: ChangeDetectorRef) { }

  trashNotes: any[] = [];

  ngOnInit() {
    this.loadTrashNotes();
  }

  loadTrashNotes() {
    this.notesService.getTrashNotes().subscribe({
      next: (res: any) => {
        this.trashNotes = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR:', err);
      }
    })
  }

  restoreNote(id: string) {
    this.notesService.restoreNote(id).subscribe(() => {
      this.loadTrashNotes();
    })
  }

  deleteForever(id: string) {
    this.notesService.deletePermanent(id).subscribe(() => {
      this.loadTrashNotes();
    })
  }

}

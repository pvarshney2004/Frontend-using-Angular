import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Notes {

  private baseUrl = 'https://localhost:7119/api/';

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  createNote(data: any) {
    return this.http.post(this.baseUrl + 'notes', data, this.getHeaders());
  }

  getNotes() {
    return this.http.get(this.baseUrl + 'notes', this.getHeaders());
  }

  getTrashNotes() {
    return this.http.get(this.baseUrl + 'notes/trash', this.getHeaders());
  }

  getArchiveNotes() {
    return this.http.get(this.baseUrl + 'notes/archive', this.getHeaders());
  }

  toggleArchive(id: string) {
    return this.http.patch(this.baseUrl + 'notes/archive/' + id, {}, this.getHeaders());
  }

  restoreNote(id: string) {
    return this.http.patch(this.baseUrl + 'notes/restore/' + id, {}, this.getHeaders());
  }

  deleteNote(id: string) {
    return this.http.delete(this.baseUrl + 'notes/' + id, this.getHeaders());
  }

  deletePermanent(id: string) {
    return this.http.delete(this.baseUrl + 'notes/permanent/' + id, this.getHeaders());
  }

  updateNoteColor(id: string, color: string) {
    return this.http.patch(this.baseUrl + 'notes/color/' + id, { color }, this.getHeaders());
  }

  updateNote(id: string, updatedNote: Object) {
    return this.http.put(this.baseUrl + 'notes/' + id, updatedNote, this.getHeaders());
  }

  setReminder(id: number, reminder: any) {
    return this.http.patch(
      this.baseUrl + 'notes/reminder/' + id,
      { reminder: reminder },
      this.getHeaders()
    );
  }

  togglePin(id: string) {
    return this.http.patch(this.baseUrl + 'notes/pin/' + id, {}, this.getHeaders());
  }

}

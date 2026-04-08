import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  constructor(private http: HttpClient) { }

  private baseUrl = 'https://localhost:7143/api/';

  getHeaders() {
    const token = localStorage.getItem('token');
    console.log("TOKEN:", token);
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  createTask(data: any) {
    return this.http.post(this.baseUrl + 'tasks', data, this.getHeaders());
  }
  getTasks() {
    return this.http.get(this.baseUrl + 'tasks', this.getHeaders());
  }
  updateTask(id: string, updatedTask: Object) {
    return this.http.put(this.baseUrl + 'tasks/' + id, updatedTask, this.getHeaders());
  }
  deleteTask(id: string) {
    return this.http.delete(this.baseUrl + 'tasks/' + id, this.getHeaders());
  }

  getAllTasksAdmin() {
    return this.http.get(this.baseUrl + 'admin/tasks', this.getHeaders());
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) { }

  private baseUrl = 'https://localhost:7143/api/';

  register(data: any) {
    return this.http.post(this.baseUrl + 'auth/register', data);
  }

  login(data: any) {
    return this.http.post(this.baseUrl + 'auth/login', data);
  }

}

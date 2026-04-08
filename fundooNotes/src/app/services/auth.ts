import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'https://localhost:7119/api/';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(this.baseUrl + 'user/register', data);
  }

  login(data:any){
    return this.http.post(this.baseUrl + 'user/login', data)
  }
}

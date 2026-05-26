import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string) {
    return this.http.post<{ token: string, email: string }>(`${this.api}/auth/register`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string, email: string }>(`${this.api}/auth/login`, { email, password });
  }

  saveToken(token: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  }

  getToken() { return localStorage.getItem('token'); }
  getEmail() { return localStorage.getItem('email'); }
  isLoggedIn() { return !!this.getToken(); }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
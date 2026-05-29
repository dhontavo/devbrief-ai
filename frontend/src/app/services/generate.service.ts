import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GenerateService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) { }

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  generate(code: string, docType: string, language: string) {
    return this.http.post<{ result: string, remaining: number }>
      (`${this.api}/generate`, { code, docType, language }, { headers: this.headers() });
  }

  getHistory() {
    return this.http.get<any[]>(`${this.api}/generate/history?id=${JSON.parse(this.auth.getUser()!).id}`, { headers: this.headers() });
  }
}
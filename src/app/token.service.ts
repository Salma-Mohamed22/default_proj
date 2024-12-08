import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = 'http://localhost:3000/api/get-token'; // Backend API URL

  constructor(private http: HttpClient) {}

  getToken(uid: string): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.apiUrl}?uid=${uid}`);
  }
  
}

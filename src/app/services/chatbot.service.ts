import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'http://localhost:5000/chat';

  constructor(private http: HttpClient) {}

  getResponse(message: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.apiUrl, { message }, { headers }).pipe(
      catchError((error) => {
        console.error('API Request Error:', error);
        return throwError(() => new Error('Failed to fetch response. Try again.'));
      })
    );
  }
}

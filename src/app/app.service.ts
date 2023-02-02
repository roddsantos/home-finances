import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getSourceMapRange } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:5000',
    }),
  };

  getUser(user: String) {
    return this.http.get(
      `http://localhost:5000/api/user/${user}`
      // this.httpOptions
    );
  }
}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getSourceMapRange } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class BanksService {
  userId: Number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    let str = localStorage.getItem('user');
    if (str) this.userId = JSON.parse(str);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:5000',
    }),
  };

  getBanks(id: Number) {
    return this.http.get(`http://localhost:5000/api/bank/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private http: HttpClient) {}

  setUser(user: Object) {
    let str = JSON.stringify(user);
    localStorage.setItem('user', str);
    localStorage.setItem('hasUser', 'true');
  }

  getUser() {
    let user = localStorage.getItem('user');
    console.log('USER', user);
    return user ? JSON.parse(user) : null;
  }

  getHasUser() {
    let hasUser = localStorage.getItem('hasUser');
    return hasUser;
  }

  removeUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('hasUser');
  }

  setTypeBills(typeBills: any) {
    let str =
      typeof typeBills == 'string' ? typeBills : JSON.stringify(typeBills);
    localStorage.setItem('typeBills', str);
    localStorage.setItem('hasTypeBills', 'true');
  }

  getTypeBills() {
    let typeBills = localStorage.getItem('typeBills');
    return typeBills ? JSON.parse(typeBills) : null;
  }

  removeTypeBills() {
    localStorage.removeItem('typeBills');
    localStorage.removeItem('hasTypeBills');
  }
}

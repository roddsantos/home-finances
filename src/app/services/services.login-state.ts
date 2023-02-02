import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginStateService {
  user = new Subject<Object>();
  hasUser = new Subject<String>();
  open = new BehaviorSubject(false);
}

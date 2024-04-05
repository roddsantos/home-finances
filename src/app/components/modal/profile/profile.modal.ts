import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/services.local-storage';
import { ModalComponent } from '../modal.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';

export interface DialogData {
  username: string;
}

@Component({
  selector: 'modal-profile',
  templateUrl: './profile.modal.html',
  styleUrls: ['./profile.modal.css'],
  standalone: true,
  imports: [MatFormField, MatLabel, ModalComponent]
})
export class ModalProfile implements OnInit {
  username: String = '';
  user: any = null;
  hasUser: any;
  textString: String;
  @Output() submit = new EventEmitter<String>();
  @Output() logoutClose = new EventEmitter<void>();

  styleTextLabel: any;
  styleTextName: any;
  styleTextfield: any;
  isRounded: any;

  name: any;

  constructor(private storage: LocalStorageService) {}

  update() {
    let userAux = this.storage.getUser();
    let hasUserAux = this.storage.getHasUser();
    if (userAux) {
      this.user = userAux;
      this.hasUser = hasUserAux;
    }
    let styleAux = {
      display: hasUserAux == 'true' ? 'flex' : 'none',
    };
    this.styleTextLabel = styleAux;
    this.styleTextName = styleAux;
    this.styleTextfield = {
      width: '100%',
      display: hasUserAux == 'true' ? 'none' : 'flex',
    };
    this.textString = hasUserAux == 'true' ? 'sair' : 'entrar';
    this.name = this.user ? this.user?.name : '';
    this.isRounded =
      hasUserAux == 'true'
        ? {
            width: '116px',
            height: '36px',
            border: '1px solid blueviolet',
            backgroundColor: 'black',
          }
        : {};
  }

  ngOnInit() {
    this.update();
  }

  onSubmit() {
    if (this.user || this.hasUser) {
      this.logoutClose.emit();
    } else this.submit.emit(this.username);
  }
}

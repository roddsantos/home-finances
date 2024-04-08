import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/services.local-storage';

export interface DialogData {
  username: string;
}

@Component({
  selector: 'modal-new-bank',
  templateUrl: './new-bank.modal.html',
  styleUrls: ['./new-bank.modal.css'],
})
export class ModalNewBank implements OnInit {
  name: String = '';
  description: String = '';
  color: String = '';
  savings: Number = 0;
  @Output() submit = new EventEmitter<String>();
  @Output() onClose = new EventEmitter<void>();

  styleTextLabel: any;
  styleTextName: any;
  styleTextfield: any;
  isRounded: any;

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
  }

  onSubmit() {
    if (this.name && this.color && this.description) {
      console.log("ok")
    } else this.onClose.emit();
  }
}

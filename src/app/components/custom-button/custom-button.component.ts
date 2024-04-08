import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalProfile } from '../modal/profile/profile.modal';

@Component({
  selector: 'custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css'],
})

export class CustomButtonComponent {
  @Input() title: String = '';
  @Input() stylecontainer: Object;
  @Output() inputModelChange = new EventEmitter<any>();

  constructor() {}
  ngOnInit() {
  }
}

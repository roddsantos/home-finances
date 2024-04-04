import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalProfile } from '../modal/profile/profile.modal';

@Component({
  selector: 'textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css'],
})
export class TextfieldComponent {
  @Input() label: String = '';
  @Input() inputModel: String = '';
  @Input() styleContainer: CSSPropertyRule;
  @Output() inputModelChange = new EventEmitter<String>();

  constructor() {}
  ngOnInit() {
    console.log('MADGE', this.styleContainer);
  }
}

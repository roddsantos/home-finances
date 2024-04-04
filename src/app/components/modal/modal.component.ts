import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileDialogType } from 'src/app/types/modal';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [MatIcon, MatDialogModule, MatButtonModule],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileDialogType,
  ) {}
  open: Boolean = false;
  @Input() header: String;
  @Input() styles: Object;
  @Input() size: 'xl' | 'lg' | 'md' | 'sm' | 'xs';

  ngOnInit() {}

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }
}

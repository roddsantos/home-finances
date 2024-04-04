import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  open: Boolean = false;
  @Input() header: String;
  @Input() styles: Object;
  @Input() size: 'xl' | 'lg' | 'md' | 'sm' | 'xs';

  constructor() {}
  ngOnInit() {}

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }
}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TypeBillsService } from './api/api.type-bills';
import { LocalStorageService } from './services/services.local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'bills-app';

  constructor(
    private typeBillApi: TypeBillsService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    this.typeBillApi.getTypeBills().subscribe((data) => {
      if (data) {
        let res = JSON.stringify(data);
        this.storage.setTypeBills(res);
      }
    });
  }
}

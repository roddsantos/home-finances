import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalProfile } from '../modal/profile/profile.modal';
import { AppService } from 'src/app/app.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/services/services.local-storage';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements AfterViewInit {
  toggle: Boolean = false;
  styleModal: Object = {
  };
  @ViewChild(ModalComponent) modal: any;
  @ViewChild(ModalProfile) profile: any;

  constructor(
    private router: Router,
    private appService: AppService,
    private storage: LocalStorageService
  ) {}
  ngOnInit() {}

  onClose() {
    console.log('HAHAHAHA');
    this.toggle = false;
  }

  onHomeClick() {
    this.router.navigate(['']);
  }
  onManagementClick() {
    this.router.navigate(['management']);
  }
  onMonthlyClick() {
    this.router.navigate(['monthly']);
  }
  onDashboardClick() {
    this.router.navigate(['dashboard']);
  }
  
  toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
  }

  onSubmit(event: String) {
    this.appService.getUser(event).subscribe((data) => {
      this.storage.setUser(data);
      this.modal.close();
      this.profile.update();
    });
  }

  onLogout() {
    this.storage.removeUser();
    this.modal.close();
    this.profile.update();
  }

  ngAfterViewInit() {}
}

import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalProfile } from '../modal/profile/profile.modal';
import { AppService } from 'src/app/app.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/services/services.local-storage';
import { ModalComponent } from '../modal/modal.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ProfileDialogType } from 'src/app/types/modal';
import { Dialog } from '@angular/cdk/dialog';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [MatToolbarModule, MatIconModule]
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild(ModalComponent) modal: any;
  @ViewChild(ModalProfile) profile: any;

  constructor(
    private router: Router,
    private appService: AppService,
    private storage: LocalStorageService,
    public dialog: Dialog,
    public overlay: Overlay
  ) {}
  ngOnInit() {}

  openProfile(): void {
    const dialogRef = this.dialog.open<string>(ModalComponent, {
      width: '250px',
      data: {
        header: "perfil",
        username: "a",
      },
      hasBackdrop: true,
      backdropClass: "modal-backdrop"
    });

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
    });
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

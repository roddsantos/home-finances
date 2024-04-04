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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [MatToolbarModule, MatIconModule]
})
export class LayoutComponent implements AfterViewInit {
  toggle: Boolean = false;
  @ViewChild(ModalComponent) modal: any;
  @ViewChild(ModalProfile) profile: any;

  constructor(
    private router: Router,
    private appService: AppService,
    private storage: LocalStorageService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {}

  openProfile(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: "perfil",
        username: "a"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onClose() {
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

import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ServerComponent } from './server/server.component';
import { EncryptionKeyRepositoryComponent } from './encryption-key/encryption-key-repository.component';
import { DecryptionKeyRepositoryComponent } from './decryption-key/decryption-key-repository.component';

import { AuthenticationService } from './auth/authentication.service';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';

import { Roles } from './auth/roles.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Serwis Wymiany Plików';

  constructor(public dialog: MatDialog,
          public auth: AuthenticationService,
          private renderer:Renderer2) {}

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('.spinner');
    loader.style.display = 'none'; //hide loader
  }

  serverOpenDialog() {
          this.dialog.open(ServerComponent, {
              panelClass: 'custom-dialog'});
  }

  encryptionKeyRepositoryOpenDialog() {
      this.dialog.open(EncryptionKeyRepositoryComponent, {
          minWidth: '40vw',
          panelClass: 'custom-dialog'
        });
  }

  decryptionKeyRepositoryOpenDialog() {
      this.dialog.open(DecryptionKeyRepositoryComponent, {
          minWidth: '25vw',
          panelClass: 'custom-dialog'
        });
  }

  login() {
      this.dialog.open(LoginComponent, {
          panelClass: 'custom-dialog'});
  }

  logout() {
    this.dialog.open(LogoutComponent, {});
  }
}

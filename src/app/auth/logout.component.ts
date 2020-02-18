import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import {AuthenticationService} from './authentication.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
  })


  export class LogoutComponent {

    constructor(
            private auth: AuthenticationService,
            public dialogRef: MatDialogRef<LogoutComponent>) { }

    onYesClick(): void {
        this.auth.logout();
        this.dialogRef.close();
      }
}

import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-encryption-key-delete',
    templateUrl: './encryption-key-delete.component.html',
    styleUrls: ['./encryption-key-delete.component.css'],
  })

export class EncryptionKeyDeleteComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }
}

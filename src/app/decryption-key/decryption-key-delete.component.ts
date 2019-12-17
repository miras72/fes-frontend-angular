import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-decryption-key-delete',
    templateUrl: './decryption-key-delete.component.html',
    styleUrls: ['./decryption-key-delete.component.css'],
  })

export class DecryptionKeyDeleteComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }
}

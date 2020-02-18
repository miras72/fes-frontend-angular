import { Component, OnInit, OnChanges, Inject } from '@angular/core';

import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

import { DecryptionKeyService } from './decryption-key.service';
import { StatusMessage } from '../subjects//shared/status-message.model';

import { AuthenticationService } from '../auth/authentication.service';
import { Roles } from '../auth/roles.enum';

import { FileValidators } from '../input-file/file-validators';

@Component( {
    selector: 'app-decryption-key',
    templateUrl: './decryption-key.component.html',
    styleUrls: ['./decryption-key.component.css'],
} )
export class DecryptionKeyComponent implements OnInit, OnChanges {

    decryptionKeyForm: FormGroup;
    progress: { percentage: number } = { percentage: 0 };

    constructor(
            private decryptionKeyService: DecryptionKeyService,
            private fb: FormBuilder,
            public auth: AuthenticationService,
            private snackBar: MatSnackBar,
            public dialogRef: MatDialogRef<DecryptionKeyComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {
        this.createForm();
    }

    ngOnInit() {
        this.ngOnChanges();
    }

    createForm() {
        this.decryptionKeyForm = this.fb.group( {
            keyBinaryFile: ['', [Validators.required, FileValidators.maxContentSize(10485760)]],
        } );
    }

    ngOnChanges() {
        this.decryptionKeyForm.reset( {
            keyBinaryFile: null,
        } );
    }

    downloadKey() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.decryptionKeyService.downloadDecryptionKey(this.data.id, this.data.keyName).subscribe();
        }
    }

    uploadKey() {

        if (this.auth.isAuthorized(Roles.admin)) {
            this.progress.percentage = 0;
            this.decryptionKeyService.uploadDecryptionKey(this.decryptionKeyForm.value.keyBinaryFile._files[0], this.data.id).subscribe(
                      event => {
                          if (event.type === HttpEventType.UploadProgress) {
                              this.progress.percentage = Math.round(100 * event.loaded / event.total);
                          } else if (event instanceof HttpResponse) {
                              this.data.keyName = this.decryptionKeyForm.value.keyBinaryFile._files[0].name.substr(0, 20);
                              this.decryptionKeyService.setDecryptionKeyChange();
                          }
                      },
                      ( err: HttpErrorResponse ) => {
                          if ( err.error ) {
                             // this.snackBar.open( <StatusMessage>err.error.message + ': '
                             //         + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                          } else {
                              //this.snackBar.open( 'Błąd w trakcie wysyłania pliku: ' + err.status
                              //        + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                          }
                      }
              );
        }
    }
}

import { Component, OnInit, OnChanges, Inject } from '@angular/core';

import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { EncryptionKeyService } from './encryption-key.service';
import { StatusMessage } from '../subjects//shared/status-message.model';

import { AuthenticationService } from '../auth/authentication.service';
import { Roles } from '../auth/roles.enum';

import { FileValidators } from '../input-file/file-validators';

@Component( {
    selector: 'app-encryption-key',
    templateUrl: './encryption-key.component.html',
    styleUrls: ['./encryption-key.component.css'],
} )
export class EncryptionKeyComponent implements OnInit, OnChanges {

    encryptionKeyForm: FormGroup;
    progress: { percentage: number } = { percentage: 0 };

    constructor(
            private encryptionKeyService: EncryptionKeyService,
            private fb: FormBuilder,
            public auth: AuthenticationService,
            private snackBar: MatSnackBar,
            public dialogRef: MatDialogRef<EncryptionKeyComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {
        this.createForm();
    }

    ngOnInit() {
        this.ngOnChanges();
    }

    createForm() {
        this.encryptionKeyForm = this.fb.group( {
            keyBinaryFile: ['', [Validators.required, FileValidators.maxContentSize(10485760)]],
        } );
    }

    ngOnChanges() {
        this.encryptionKeyForm.reset( {
            keyBinaryFile: null,
        } );
    }

    downloadKey() {
        if (this.data.key === 'private-key') {
            if (this.auth.isAuthorized(Roles.admin)) {
                this.encryptionKeyService.downloadPrivateKey(this.data.id, this.data.keyName).subscribe();
            }
        } else {
            this.encryptionKeyService.downloadPublicKey(this.data.id, this.data.keyName).subscribe();
        }
    }

    uploadKey() {

        if (this.auth.isAuthorized(Roles.admin)) {
            this.progress.percentage = 0;

            if (this.data.key === 'private-key') {
                this.encryptionKeyService.uploadPrivateKey(this.encryptionKeyForm.value.keyBinaryFile._files[0], this.data.id).subscribe(
                        event => {
                            if (event.type === HttpEventType.UploadProgress) {
                                this.progress.percentage = Math.round(100 * event.loaded / event.total);
                            } else if (event instanceof HttpResponse) {
                                this.data.keyName = this.encryptionKeyForm.value.keyBinaryFile._files[0].name.substr(0, 25);
                                this.encryptionKeyService.setEncryptionKeyChange();
                            }
                        },
                        ( err: HttpErrorResponse ) => {
                            if ( err.error ) {
                             /*   this.snackBar.open( <StatusMessage>err.error.message + ': '
                                        + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );*/
                            } else {
                                /*this.snackBar.open( 'Błąd w trakcie wysyłania pliku: ' + err.status
                                        + ' (' + err.statusText + ')', 'ZAMKNIJ' );*/
                            }
                        }
                );
            } else {
                this.encryptionKeyService.uploadPublicKey(this.encryptionKeyForm.value.keyBinaryFile._files[0], this.data.id).subscribe(
                        event => {
                            if (event.type === HttpEventType.UploadProgress) {
                                this.progress.percentage = Math.round(100 * event.loaded / event.total);
                            } else if (event instanceof HttpResponse) {
                                this.data.keyName = this.encryptionKeyForm.value.keyBinaryFile._files[0].name.substr(0, 25);
                                this.encryptionKeyService.setEncryptionKeyChange();
                            }
                        },
                        ( err: HttpErrorResponse ) => {
                            if ( err.error ) {
                                /*this.snackBar.open( <StatusMessage>err.error.message + ': '
                                        + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );*/
                            } else {
                                /*this.snackBar.open( 'Błąd w trakcie wysyłania pliku: ' + err.status
                                        + ' (' + err.statusText + ')', 'ZAMKNIJ' );*/
                            }
                        }
                );
            }
        }
    }
}

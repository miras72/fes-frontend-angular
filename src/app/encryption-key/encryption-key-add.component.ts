import { Component } from '@angular/core';

import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { FileValidators } from '../input-file/file-validators';

import { EncryptionKeyService } from './encryption-key.service';
import { StatusMessage } from '../subjects//shared/status-message.model';

@Component( {
    selector: 'app-encryption-key-add',
    templateUrl: './encryption-key-add.component.html',
    styleUrls: ['./encryption-key-add.component.css'],
} )

export class EncryptionKeyAddComponent {

    encryptionKeyForm: FormGroup;
    progress: { percentage: number } = { percentage: 0 };

    constructor(
            private encryptionKeyService: EncryptionKeyService,
            private fb: FormBuilder,
            private snackBar: MatSnackBar) {
        this.createForm();
    }

    createForm() {
        this.encryptionKeyForm = this.fb.group( {
            privateKeyBinaryFile: ['', [Validators.required, FileValidators.maxContentSize(10485760)]],
            publicKeyBinaryFile: ['', [Validators.required, FileValidators.maxContentSize(10485760)]],
        } );
    }

    addKey() {
        this.encryptionKeyService.addEncryptionKey(this.encryptionKeyForm.value.privateKeyBinaryFile._files[0],
                this.encryptionKeyForm.value.publicKeyBinaryFile._files[0]).subscribe(
                event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress.percentage = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.encryptionKeyService.setEncryptionKeyChange();
                    }
                },
                ( err: HttpErrorResponse ) => {
                    if ( err.error ) {
                        this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                    } else {
                        this.snackBar.open( 'Błąd w trakcie wysyłania plików: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                    }
                }
          );
    }
}

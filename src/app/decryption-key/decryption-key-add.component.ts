import { Component } from '@angular/core';

import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { FileValidators } from '../input-file/file-validators';

import { DecryptionKeyService } from './decryption-key.service';
import { StatusMessage } from '../subjects//shared/status-message.model';

@Component( {
    selector: 'app-decryption-key-add',
    templateUrl: './decryption-key-add.component.html',
    styleUrls: ['./decryption-key-add.component.css'],
} )

export class DecryptionKeyAddComponent {

    decryptionKeyForm: FormGroup;
    progress: { percentage: number } = { percentage: 0 };

    constructor(
            private decryptionKeyService: DecryptionKeyService,
            private fb: FormBuilder,
            private snackBar: MatSnackBar) {
        this.createForm();
    }

    createForm() {
        this.decryptionKeyForm = this.fb.group( {
            decryptionKeyBinaryFile: ['', [Validators.required, FileValidators.maxContentSize(10485760)]],
        } );
    }

    addKey() {
        this.decryptionKeyService.addDecryptionKey(this.decryptionKeyForm.value.decryptionKeyBinaryFile._files[0]).subscribe(
                event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress.percentage = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.decryptionKeyService.setDecryptionKeyChange();
                    }
                },
                ( err: HttpErrorResponse ) => {
                    if ( err.error ) {
                        //this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                    } else {
                        //this.snackBar.open( 'Błąd w trakcie wysyłania plików: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                    }
                }
          );
    }
}

import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { DecryptionKeyDataSource } from './decryption-key-data-source';
import { DecryptionKeyService } from './decryption-key.service';
import { DecryptionKeyComponent } from './decryption-key.component';
import { DecryptionKeyDeleteComponent } from './decryption-key-delete.component';
import { DecryptionKeyAddComponent } from './decryption-key-add.component';

import { AuthenticationService } from '../auth/authentication.service';
import { Roles } from '../auth/roles.enum';

@Component( {
    selector: 'app-decryption-key-repository',
    templateUrl: './decryption-key-repository.component.html',
    styleUrls: ['./decryption-key-repository.component.css'],
} )

export class DecryptionKeyRepositoryComponent implements OnInit {

    displayedColumns = ['deleteSymbol', 'decryptionKeyName'];
    dataSource: DecryptionKeyDataSource | null;

    constructor(
            private decryptionKeyService: DecryptionKeyService,
            public auth: AuthenticationService,
            private snackBar: MatSnackBar,
            public dialog: MatDialog) {
        }

    ngOnInit() {
        this.dataSource = new DecryptionKeyDataSource(this.decryptionKeyService, this.snackBar);
    }

    deleteDecryptionKey(id: number) {
        if (this.auth.isAuthorized(Roles.admin)) {
            const dialogRef = this.dialog.open(DecryptionKeyDeleteComponent, {});
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.decryptionKeyService.deleteDecryptionKey(id);
                }
            });
        }
    }

    addDecryptionKey() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.dialog.open(DecryptionKeyAddComponent, {
                panelClass: 'custom-dialog'});
        }
    }

    exportImportDecryptionKey(id: number, decryptionKeyName: string) {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.dialog.open(DecryptionKeyComponent, {
                data: {id: id, keyName: decryptionKeyName, key: 'decryption-key'},
                panelClass: 'custom-dialog'
            });
        }
    }
}

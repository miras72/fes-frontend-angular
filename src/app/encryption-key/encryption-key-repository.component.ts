import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { KeyDataSource } from './encryption-key-data-source';
import { EncryptionKeyService } from './encryption-key.service';
import { EncryptionKeyComponent } from './encryption-key.component';
import { EncryptionKeyDeleteComponent } from './encryption-key-delete.component';
import { EncryptionKeyAddComponent } from './encryption-key-add.component';

import { AuthenticationService } from '../auth/authentication.service';
import { Roles } from '../auth/roles.enum';

@Component( {
    selector: 'app-encryption-key-repository',
    templateUrl: './encryption-key-repository.component.html',
    styleUrls: ['./encryption-key-repository.component.css'],
} )

export class EncryptionKeyRepositoryComponent implements OnInit {

    displayedColumns = ['deleteSymbol', 'privateKeyName', 'publicKeyName'];
    dataSource: KeyDataSource | null;

    constructor(
            private encryptionKeyService: EncryptionKeyService,
            public auth: AuthenticationService,
            private snackBar: MatSnackBar,
            public dialog: MatDialog) {
        }

    ngOnInit() {
        this.dataSource = new KeyDataSource(this.encryptionKeyService, this.snackBar);
    }

    deleteEncryptionKeys(id: number) {
        if (this.auth.isAuthorized(Roles.admin)) {
            const dialogRef = this.dialog.open(EncryptionKeyDeleteComponent, {});
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.encryptionKeyService.deleteEncryptionKey(id);
                }
            });
        }
    }

    addEncryptionKeys() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.dialog.open(EncryptionKeyAddComponent, {
                panelClass: 'custom-dialog'});
        }
    }

    exportImportPrivateKey(id: number, privateKeyName: string) {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.dialog.open(EncryptionKeyComponent, {
                data: {id: id, keyName: privateKeyName, key: 'private-key'},
                panelClass: 'custom-dialog'
            });
        }
    }

    exportImportPublicKey(id: number, publicKeyName: string) {
        this.dialog.open(EncryptionKeyComponent, {
            data: {id: id, keyName: publicKeyName, key: 'public-key'},
            panelClass: 'custom-dialog'
          });
    }
}

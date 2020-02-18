import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material/snack-bar';

import { EncryptionKey } from './encryption-key.model';
import { EncryptionKeyService } from './encryption-key.service';

export class KeyDataSource extends DataSource<EncryptionKey> {

    encryptionKeyChange$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
            private encryptionKeyService: EncryptionKeyService,
            private snackBar: MatSnackBar) {
        super();
        encryptionKeyService.getEncryptionKeyChange().subscribe(encryptionKeyChange => {
            this.encryptionKeyChange$.next(encryptionKeyChange);
        });
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<EncryptionKey[]> {

        const displayDataChanges = [
              this.encryptionKeyChange$
        ];
        return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
            return this.encryptionKeyService.getEncryptionKeys();
        })
        .map((data) => {
            return data;
         })
         .catch((error) => {
             //this.snackBar.open( 'Błąd pobierania Kluczy Enkrypcji: ' + error, 'ZAMKNIJ' );
             return Observable.of([]);
     });
    }

    disconnect() {}
}

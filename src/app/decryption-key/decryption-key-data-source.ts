import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material';

import { DecryptionKey } from './decryption-key.model';
import { DecryptionKeyService } from './decryption-key.service';

export class DecryptionKeyDataSource extends DataSource<DecryptionKey> {

    decryptionKeyChange$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
            private decryptionKeyService: DecryptionKeyService,
            private snackBar: MatSnackBar) {
        super();
        decryptionKeyService.getDecryptionKeyChange().subscribe(decryptionKeyChange => {
            this.decryptionKeyChange$.next(decryptionKeyChange);
        });
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<DecryptionKey[]> {

        const displayDataChanges = [
              this.decryptionKeyChange$
        ];
        return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
            return this.decryptionKeyService.getDecryptionKeys();
        })
        .map((data) => {
            return data;
         })
         .catch((error) => {
             //this.snackBar.open( 'Błąd pobierania Kluczy Dekrypcji: ' + error, 'ZAMKNIJ' );
             return Observable.of([]);
     });
    }

    disconnect() {}
}

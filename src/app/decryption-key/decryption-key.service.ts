import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DecryptionKey } from './decryption-key.model';
import { StatusMessage } from '../subjects/shared/status-message.model';

@Injectable()
export class DecryptionKeyService {

    private decryptionKeyUrl = '/api/decryption-keys';

    decryptionKeyChange$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(
            private httpClient: HttpClient,
            private snackBar: MatSnackBar) { }

    setDecryptionKeyChange() {
        this.decryptionKeyChange$.next(1);
    }

    getDecryptionKeyChange(): Observable<any> {
        return this.decryptionKeyChange$;
    }

    getDecryptionKeys(): Observable<DecryptionKey[]> {
        //const decryptionKeyUrl = '/api/decryption-keys';
        return this.httpClient.get<DecryptionKey[]>(this.decryptionKeyUrl)
        .catch(() => {
        return Observable.of([]);
      });
    }

    downloadDecryptionKey (id: number, keyName: string): Observable<any> {
        const decryptionKeyUrl = '/api/download/decryption-keys';

        return this.httpClient.get(`${decryptionKeyUrl}/${id}`, { responseType: 'blob' })
        .map(res => this.downloadFile(res, keyName))
        .catch((err) => {
           // this.snackBar.open( 'Błąd połączenia z Serwerem: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
            return Observable.of();
        });
      }

    downloadFile(blob: any, filename: string): string {
      const url = window.URL.createObjectURL(blob); // <-- work with blob directly

      // create hidden dom element (so it works in all browsers)
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);

      // create file, attach to hidden element and open hidden element
      a.href = url;
      a.download = filename;
      a.click();
      return url;
    }

    uploadDecryptionKey(uploadFile: File, id: number): Observable<HttpEvent<{}>> {
        const decryptionKeyUrl = '/api/upload/decryption-keys';
        const formdata: FormData = new FormData();

        formdata.append('decryptionFile', new Blob([uploadFile]), uploadFile.name);
        formdata.append('decryptionFileName', uploadFile.name.substr(0, 25));

        const req = new HttpRequest('PUT', `${decryptionKeyUrl}/${id}`, formdata, {
          reportProgress: true,
        });
        return this.httpClient.request(req);
      }


    deleteDecryptionKey(id: number) {

        return this.httpClient.delete(`${this.decryptionKeyUrl}/${id}`)
            .subscribe(
            () => {
                this.setDecryptionKeyChange();
                this.snackBar.open('Klucz dekrypcji został skasowany.', 'ZAMKNIJ', {
                    duration: 10000,
                });
            },
            ( err: HttpErrorResponse ) => {
                if ( err.error ) {
                   // this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                } else {
                   // this.snackBar.open( 'Błąd kasowania Kluczy Dekrypcji: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                }
            });
    }

    addDecryptionKey(uploadDecryptionKeyFile: File): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();

        formdata.append('decryptionFile', new Blob([uploadDecryptionKeyFile]), uploadDecryptionKeyFile.name);
        formdata.append('decryptionFileName', uploadDecryptionKeyFile.name.substr(0, 25));

        const req = new HttpRequest('POST', this.decryptionKeyUrl, formdata, {
            reportProgress: true,
        });
        return this.httpClient.request(req);
    }
}

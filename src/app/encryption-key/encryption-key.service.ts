import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material/snack-bar';

import { EncryptionKey } from './encryption-key.model';
import { StatusMessage } from '../subjects/shared/status-message.model';

@Injectable()
export class EncryptionKeyService {

    private encryptionKeyUrl = '/api/encryption-keys';

    encryptionKeyChange$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(
            private httpClient: HttpClient,
            private snackBar: MatSnackBar) { }

    setEncryptionKeyChange() {
        this.encryptionKeyChange$.next(1);
    }

    getEncryptionKeyChange(): Observable<any> {
        return this.encryptionKeyChange$;
    }

    getEncryptionKeys(): Observable<EncryptionKey[]> {
        return this.httpClient.get<EncryptionKey[]>(this.encryptionKeyUrl)
        //.catch(this.handleError);
        .catch(() => {
        return Observable.of([]);
      });
    }

    downloadPrivateKey (id: number, keyName: string): Observable<any> {
        const privateKeyUrl = '/api/download/private-keys';

        return this.httpClient.get(`${privateKeyUrl}/${id}`, { responseType: 'blob' })
        .map(res => this.downloadFile(res, keyName))
        .catch(() => {
            //this.snackBar.open( 'Błąd połączenia z Serwerem: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
            return Observable.of();
        });
      }

    downloadPublicKey (id: number, keyName: string): Observable<any> {
        const publicKeyUrl = '/api/download/public-keys';

        return this.httpClient.get(`${publicKeyUrl}/${id}`, { responseType: 'blob' })
        .map(res => this.downloadFile(res, keyName))
        .catch(() => {
            //this.snackBar.open( 'Błąd połączenia z Serwerem: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
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

    uploadPrivateKey(uploadFile: File, id: number): Observable<HttpEvent<{}>> {
        const privateKeyUrl = '/api/upload/private-keys';
        const formdata: FormData = new FormData();

        formdata.append('privateFile', new Blob([uploadFile]), uploadFile.name);
        formdata.append('privateFileName', uploadFile.name.substr(0, 20));

        const req = new HttpRequest('PUT', `${privateKeyUrl}/${id}`, formdata, {
          reportProgress: true,
        });
        return this.httpClient.request(req);
      }

    uploadPublicKey(uploadFile: File, id: number): Observable<HttpEvent<{}>> {
        const publicKeyUrl = '/api/upload/public-keys';
        const formdata: FormData = new FormData();

        formdata.append('publicFile', new Blob([uploadFile]), uploadFile.name);
        formdata.append('publicFileName', uploadFile.name.substr(0, 20));

        const req = new HttpRequest('PUT', `${publicKeyUrl}/${id}`, formdata, {
          reportProgress: true,
        });
        return this.httpClient.request(req);
      }

    deleteEncryptionKey(id: number) {

        return this.httpClient.delete(`${this.encryptionKeyUrl}/${id}`)
            .subscribe(
            () => {
                this.setEncryptionKeyChange();
                this.snackBar.open('Klucze enkrypcji zostały skasowane.', 'ZAMKNIJ', {
                    duration: 10000,
                });
            },
            ( err: HttpErrorResponse ) => {
                if ( err.error ) {
                   // this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                } else {
                   // this.snackBar.open( 'Błąd kasowania Kluczy Enkrypcji: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                }
            });
    }

    addEncryptionKey(uploadPrivateKeyFile: File, uploadPublicKeyFile: File): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();

        formdata.append('privateFile', new Blob([uploadPrivateKeyFile]), uploadPrivateKeyFile.name);
        formdata.append('privateFileName', uploadPrivateKeyFile.name.substr(0, 20));

        formdata.append('publicFile', new Blob([uploadPublicKeyFile]), uploadPublicKeyFile.name);
        formdata.append('publicFileName', uploadPublicKeyFile.name.substr(0, 20));

        const req = new HttpRequest('POST', this.encryptionKeyUrl, formdata, {
            reportProgress: true,
        });
        return this.httpClient.request(req);
    }
}

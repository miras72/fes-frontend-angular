import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import {MatSnackBar} from '@angular/material';
// import { SnackBarStatusMessageComponent } from '../snackbar/snack-bar-status-message-component';

import { ManualFileExchange } from '../shared/manual-file-exchange.model';
import { StatusMessage } from '../shared/status-message.model';

@Injectable()
export class ManualFileExchangeService {

    private manualFileExchangeUrl = '/api/file';

    constructor( private httpClient: HttpClient,
            private snackBar: MatSnackBar) { }

    createTaskFileExchange(newManualFileExchange: ManualFileExchange) {
        return this.httpClient.post(this.manualFileExchangeUrl, newManualFileExchange)
        // .subscribe(() => null)
          .subscribe(
          () => {
              this.snackBar.open('Zadanie pobierania plików uruchomione...', 'ZAMKNIJ', {
                  duration: 10000,
                });
          },
          ( err: HttpErrorResponse ) => {
              if ( err.error ) {
                 // this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
              } else {
                //  this.snackBar.open( 'Błąd zapisu konfiguracji Serwera: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
              }
          });
    }

    deleteTaskFileExchange(id: number) {
        const url = `${this.manualFileExchangeUrl}/${id}`;
        return this.httpClient.delete(url)
          // .subscribe(() => null)
            .subscribe(
            () => {
                this.snackBar.open('Zadanie pobierania plików zostało zatrzymane.', 'ZAMKNIJ', {
                    duration: 10000,
                });
            },
            ( err: HttpErrorResponse ) => {
                if ( err.error ) {
                   // this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                } else {
                   // this.snackBar.open( 'Błąd zapisu konfiguracji Serwera: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                }
            });
    }
}

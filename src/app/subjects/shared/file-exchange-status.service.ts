import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { MatSnackBar } from '@angular/material/snack-bar';

import { FileExchangeStatus } from '../shared/file-exchange-status.model';

@Injectable()
export class FileExchangeStatusService {

    // private fileExchangeStatusUrl = 'api/fileExchangeStatus';  // URL to web api
    private fileExchangeStatusUrl = '/api/file-exchange-status';

    constructor(
            private httpClient: HttpClient,
            private snackBar: MatSnackBar) { }

    getTaskFileExchangeStatus(taskID: number, eventDateTime: string): Observable<FileExchangeStatus[]> {
        let params = new HttpParams();
        params = params.append('taskID', taskID.toString());
        params = params.append('eventDateTime', eventDateTime);
        return this.httpClient.get<FileExchangeStatus[]>(this.fileExchangeStatusUrl, {params: params} )
        .catch((err: HttpErrorResponse) => {
            this.snackBar.open( 'Błąd połączenia z Serwerem: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
        return Observable.of([]);
      });
    }
}

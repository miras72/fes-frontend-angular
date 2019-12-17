import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ServerConfig } from './server-config.model';
import { StatusMessage } from '../subjects/shared/status-message.model';

@Injectable()
export class ServerConfigService {

    private serverConfigUrl = '/api/server-config';

    constructor(
        private httpClient: HttpClient,
        private snackBar: MatSnackBar) { }

    getServerConfig(): Observable<ServerConfig> {
        return this.httpClient.get<ServerConfig>(this.serverConfigUrl)
            .catch((err: HttpErrorResponse) => {
                return Observable.of(null);
            });
    }

    updateServerConfig(serverConfig: ServerConfig) {
        return this.httpClient.put(this.serverConfigUrl, serverConfig)
            .subscribe(
                () => {
                    this.snackBar.open('Konfiguracja Serwera została uaktualniona.', 'ZAMKNIJ', {
                        duration: 10000,
                    });
                }
            );
    }
}

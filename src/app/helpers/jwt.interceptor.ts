import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/RX';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';

import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../auth/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private injector: Injector,
        private snackBar: MatSnackBar,
        private datePipe: DatePipe) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const auth = this.injector.get(AuthenticationService);

        const url = environment.apiUrl;

        console.log('JwtInterceptor:', url);

        // add authorization header with jwt token if available
        const token = auth.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                },
                url: url + request.url
            });
        } else {
            request = request.clone({
                url: url + request.url
            });
        }
        return next.handle(request)
            .catch((error, caught) => {
                var today = Date.now();
                console.log('JwtInterceptor:', error);
                if (error.error instanceof ErrorEvent || error.error instanceof ProgressEvent || error.error instanceof Blob) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('Client error');
                    this.snackBar.open( this.datePipe.transform(today, 'dd/MM/yyy HH:mm:ss') + ' - ' + 'Błąd połączenia: ' + error.status + ' (' + error.statusText + ')', 'ZAMKNIJ' );
                } else if (error.status === 401){
                    console.log('Error code 401');
                    auth.logout();
                    return Observable.throw(error);
                } else if (error.status === 400){
                    console.log(error.error.error);
                    console.log(error.error.error_description);
                    if(error.error.error === 'invalid_grant') {
                        this.snackBar.open( this.datePipe.transform(today, 'dd/MM/yyy HH:mm:ss') + ' - ' + 'Nieprawidłowy login lub hasło!!!', 'ZAMKNIJ' );
                    } else {
                        this.snackBar.open( this.datePipe.transform(today, 'dd/MM/yyy HH:mm:ss') + ' - ' + error.error.error_description + ' Błąd: ' + error.error.error, 'ZAMKNIJ' );
                    }
                } else {
                    // The backend returned an unsuccessful response code.
                   // The response body may contain clues as to what went wrong,
                   console.log('Server error');
                   this.snackBar.open( this.datePipe.transform(today, 'dd/MM/yyy HH:mm:ss') + ' - ' + error.error.message + ' Błąd: ' + error.error.status_code, 'ZAMKNIJ' );
                }
                return Observable.throw(error);
            }) as any;
    }
}

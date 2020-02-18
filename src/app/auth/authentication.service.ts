import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams   } from '@angular/common/http';
import { Observable } from 'rxjs/RX';

import { MatSnackBar } from '@angular/material/snack-bar';

//import { StatusMessage } from '../subjects/shared/status-message.model';
import { User } from './user.model';
import { Token } from './token.model';
import { Roles } from './roles.enum';

import * as decode from 'jwt-decode';

export const TOKEN_NAME = 'jwt-token';

@Injectable()
export class AuthenticationService {

    //private authUrl = '/api/authenticate';
    private authUrl = '/oauth/token';
  

    constructor(
            private snackBar: MatSnackBar,
            private http: HttpClient) { }

    login(user: User): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/x-www-form-urlencoded',
              'Authorization': 'Basic '+btoa("jwtclientid:FGHvmy55ty200")
            })
        };

        let headers = new HttpHeaders();
        headers= headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers = headers.append('Authorization', 'Basic '+btoa("jwtclientid:FGHvmy55ty200"));

        let params = new HttpParams();
        params = params.append('username',user.username);
        params = params.append('password',user.password);    
        params = params.append('grant_type','password');
     
        //return this.http.post<Token>(this.authUrl, params.toString(), httpOptions)
        return this.http.post<Token>(this.authUrl, null, {headers: headers, params: params})
            .map((token: Token) => {
                if (token.access_token) {
                    localStorage.setItem(TOKEN_NAME, token.access_token);
                    this.snackBar.open('Logowanie poprawne.', 'ZAMKNIJ', {
                        duration: 10000,
                      });
                }
            })
            .catch((err: any) => {
               /* this.snackBar.open( err.error.message, 'ZAMKNIJ', {
                  duration: 10000,
                });*/
                return Observable.throw(err);
            });
    }

    logout() {
        localStorage.removeItem(TOKEN_NAME);
    }

    getToken(): string {
        return localStorage.getItem(TOKEN_NAME);
    }

    getUser(): string {
        const token = this.getToken();
        const decodedToken = decode(token);
        const user = decodedToken.displayName;
        return user;
    }

    getTokenExpirationDate (token: string): Date {
        const decoded = decode(token);

        if (decoded.exp === undefined) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if (!token) {
            token = this.getToken();
        }
        if (!token) {
            return true;
        }

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) {
            return false;
        }
        return !(date.valueOf() > new Date().valueOf());
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!this.isTokenExpired(token)) {
            return true;
        }
        return false;
    }

    isAdmin(): boolean {
        const token = this.getToken();
        let isAdmin = false;

        if (token) {
            const decoded = decode(token);

            decoded.authorities.forEach(role => {
                if (role === Roles.admin) {
                    isAdmin = true;
                }
            });
        }
        if (isAdmin) {
            return true;
        } else {
            this.snackBar.open( 'Dostęp Zabroniony. Nie masz uprawnień Administratora.', 'ZAMKNIJ', {
                duration: 10000,
            } );
            return false;
        }
    }

    isOperator(): boolean {
        const token = this.getToken();
        let isOperator = false;

        if (token) {
            const decoded = decode(token);

            decoded.authorities.forEach(role => {
                if (role === Roles.operator || role === Roles.admin) {
                    isOperator = true;
                }
            });
        }
        if (isOperator) {
            return true;
        } else {
            this.snackBar.open( 'Dostęp Zabroniony. Nie masz uprawnień Operatora.', 'ZAMKNIJ', {
                duration: 10000,
            } );
            return false;
        }
    }

    isGuest(): boolean {
        const token = this.getToken();
        let isGuest = false;

        if (token) {
            const decoded = decode(token);

            decoded.authorities.forEach(role => {
                if (role === Roles.guest || role === Roles.operator || role === Roles.admin) {
                    isGuest = true;
                }
            });
        }
        if (isGuest) {
            return true;
        } else {
            this.snackBar.open( 'Dostęp Zabroniony. Nie masz uprawnień Gościa.', 'ZAMKNIJ', {
                duration: 10000,
            } );
            return false;
        }
    }

    isAuthorized (role: string): boolean {
        if (this.isAuthenticated()) {
            switch (role) {
                case Roles.operator: {
                    return this.isOperator();
                }
                case Roles.admin: {
                    return this.isAdmin();
                }
                default: {
                    return false;
                }
            }
        } else {
            this.snackBar.open( 'Dostęp Zabroniony. Musisz być zalogowany.', 'ZAMKNIJ', {
                duration: 10000,
            } );
        }
    }
}

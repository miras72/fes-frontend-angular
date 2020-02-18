import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskConfig } from './task-config.model';
import { TaskStatusService } from '../shared/task-status.service';
import { StatusMessage } from '../shared/status-message.model';

@Injectable()
export class TaskConfigService {

    private taskConfigUrl = '/api/tasks';  // URL to web api
    // private taskStatusUrl = 'api/taskStatus';
    dataChange$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private taskStatus: TaskStatusService,
                private httpClient: HttpClient,
                private snackBar: MatSnackBar) { }

    setDataChange() {
        this.dataChange$.next(1);
    }

    getDataChange(): Observable<any> {
        return this.dataChange$;
    }

    getTaskConfig(id: number): Observable<TaskConfig> {
        const url = `${this.taskConfigUrl}/${id}`;
        return this.httpClient.get<TaskConfig>(url)
        .catch((err: HttpErrorResponse) => {
           // this.snackBar.open( 'Błąd połączenia z Serwerem: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
        return Observable.of(null);
      });
    }

    addTask(newTask: TaskConfig) {
        return this.httpClient.post(this.taskConfigUrl, newTask)
          .subscribe(
          () => {
              this.snackBar.open('Zadanie zostało dodane.', 'ZAMKNIJ', {
                  duration: 10000,
              });
          },
          ( err: HttpErrorResponse ) => {
              if ( err.error ) {
                  //this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
              } else {
                  //this.snackBar.open( 'Błąd zapisu konfiguracji Serwera: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
              }
          });
    }

    updateTask(id: number, updateTask: TaskConfig) {
        const url = `${this.taskConfigUrl}/${id}`;
        return this.httpClient.put(url, updateTask)
          .subscribe(
          () => {
              this.snackBar.open('Zadanie zostało uaktualnione.', 'ZAMKNIJ', {
                  duration: 10000,
              });
          },
          ( err: HttpErrorResponse ) => {
              if ( err.error ) {
                  //this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
              } else {
                  //this.snackBar.open( 'Błąd zapisu konfiguracji Serwera: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
              }
          });
    }

    deleteTask(id: number) {

        return this.httpClient.delete(`${this.taskConfigUrl}/${id}`)
            .subscribe(
            () => {
                this.snackBar.open('Zadanie zostało skasowane.', 'ZAMKNIJ', {
                    duration: 10000,
                });
            },
            ( err: HttpErrorResponse ) => {
                if ( err.error ) {
                    //this.snackBar.open( <StatusMessage>err.error.message + ': ' + <StatusMessage>err.error.status_code, 'ZAMKNIJ' );
                } else {
                    //this.snackBar.open( 'Błąd zapisu konfiguracji Serwera: ' + err.status + ' (' + err.statusText + ')', 'ZAMKNIJ' );
                }
            });
    }
}

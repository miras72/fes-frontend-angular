import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TaskStatus } from '../shared/task-status.model';
import { StatusMessage } from '../shared/status-message.model';

@Injectable()
export class TaskStatusService {

    private taskStatusUrl = '/api/tasks-status';
    dataChange$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(
        private httpClient: HttpClient,
        private snackBar: MatSnackBar) { }


    setDataChange() {
        this.dataChange$.next(1);
    }

    getDataChange(): Observable<any> {
        return this.dataChange$;
    }

    getTasks(): Observable<TaskStatus[]> {
        return this.httpClient.get<TaskStatus[]>(this.taskStatusUrl)
            .catch(() => {
                return Observable.of([]);
            });
    }

    runTasksStatusLive(): Observable<number> {
        return Observable.create(observer => {
            setInterval(() => {
                observer.next(1);
            }, 10000);

        });
    }
}

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatSnackBar } from '@angular/material';

import { TaskStatus } from '../shared/task-status.model';
import { TaskStatusService } from '../shared/task-status.service';
import { TaskConfigService } from '../shared/task-config.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';

export class TaskDataSource extends DataSource<TaskStatus> {

    isLoadingResults = true;
    dataChange$: BehaviorSubject<TaskStatus[]> = new BehaviorSubject<TaskStatus[]>([]);
    dataTaskLive$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
            private taskStatusService: TaskStatusService,
            private taskConfigService: TaskConfigService,
            private snackBar: MatSnackBar) {
        super();
        taskStatusService.getDataChange().subscribe(data => {
            this.dataChange$.next(data);
        });
        taskStatusService.runTasksStatusLive().subscribe(data => {
            this.dataTaskLive$.next(data);
        });
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<TaskStatus[]> {

        const displayDataChanges = [
              this.dataChange$,
              this.dataTaskLive$
        ];
        return Observable.merge(...displayDataChanges)
        .startWith(null)
        .switchMap(() => {
            // this.isLoadingResults = true;
            return this.taskStatusService.getTasks();
        })
        .map((data) => {
            this.isLoadingResults = false;

            data.forEach(taskStatus => {
                var hour = taskStatus.taskConfig.hours;
                var minutes = taskStatus.taskConfig.minutes;
                var binaryDays = taskStatus.taskConfig.days;
                var binaryMonths = taskStatus.taskConfig.months;
                taskStatus.scheduledInterval = hour + ":" + minutes + " " + this.decodeDays(binaryDays) + " " + this.decodeMonths(binaryMonths);
            });
            return data;
         })
         .catch((error) => {
             // this.isLoadingResults = false;
             //this.snackBar.open( 'Błąd pobierania Zadań: ' + error, 'ZAMKNIJ' );
             return Observable.of([]);
     });
    }

    disconnect() {
    }

    decodeDays(binaryDays: number): string {

        var daysOfWeek = null;
        
        if ((binaryDays % 2) >= 1) {
			daysOfWeek = "pn";
		}

		if ((binaryDays % 4) >= 2) {
			if (daysOfWeek == null)
				daysOfWeek = "wt";
			else
				daysOfWeek = daysOfWeek + ",wt";
		}

		if ((binaryDays % 8) >= 4) {
			if (daysOfWeek == null)
				daysOfWeek = "śr";
			else
				daysOfWeek = daysOfWeek + ",śr";
		}

		if ((binaryDays % 16) >= 8) {
			if (daysOfWeek == null)
				daysOfWeek = "cz";
			else
				daysOfWeek = daysOfWeek + ",cz";
		}

		if ((binaryDays % 32) >= 16) {
			if (daysOfWeek == null)
				daysOfWeek = "pt";
			else
				daysOfWeek = daysOfWeek + ",pt";
		}

		if ((binaryDays % 64) >= 32) {
			if (daysOfWeek == null)
				daysOfWeek = "so";
			else
				daysOfWeek = daysOfWeek + ",so";
		}

		if ((binaryDays % 128) >= 64) {
			if (daysOfWeek == null)
				daysOfWeek = "nd";
			else
				daysOfWeek = daysOfWeek + ",nd";
		}
		return daysOfWeek;
    }

    decodeMonths(binaryMonths: number): string {

		var months = null;

		if ((binaryMonths % 2) >= 1) {
			months = "Sty";
		}

		if ((binaryMonths % 4) >= 2) {
			if (months == null)
				months = "Lut";
			else
				months = months + ",Lut";
		}

		if ((binaryMonths % 8) >= 4) {
			if (months == null)
				months = "Mar";
			else
				months = months + ",Mar";
		}

		if ((binaryMonths % 16) >= 8) {
			if (months == null)
				months = "Kwi";
			else
				months = months + ",Kwi";
		}

		if ((binaryMonths % 32) >= 16) {
			if (months == null)
				months = "Maj";
			else
				months = months + ",Maj";
		}

		if ((binaryMonths % 64) >= 32) {
			if (months == null)
				months = "Cze";
			else
				months = months + ",Cze";
		}

		if ((binaryMonths % 128) >= 64) {
			if (months == null)
				months = "Lip";
			else
				months = months + ",Lip";
		}

		if ((binaryMonths % 256) >= 128) {
			if (months == null)
				months = "Sie";
			else
				months = months + ",Sie";
		}

		if ((binaryMonths % 512) >= 256) {
			if (months == null)
				months = "Wrz";
			else
				months = months + ",Wrz";
		}

		if ((binaryMonths % 1024) >= 512) {
			if (months == null)
				months = "Paź";
			else
				months = months + ",Paź";
		}

		if ((binaryMonths % 2048) >= 1024) {
			if (months == null)
				months = "Lis";
			else
				months = months + ",Lis";
		}

		if ((binaryMonths % 4096) >= 2048) {
			if (months == null)
				months = "Gru";
			else
				months = months + ",Gru";
		}
        return months;
    }
}

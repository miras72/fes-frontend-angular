import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { TaskStatus } from '../shared/task-status.model';
import { TaskStatusService } from '../shared/task-status.service';
import { TaskConfig } from '../shared/task-config.model';
import { TaskConfigService } from '../shared/task-config.service';
import { TaskDataSource } from '../shared/task-data-source';

import { SubjectDetailComponent } from '../task/subject-detail.component';
import { SubjectNewComponent } from '../task/subject-new.component';
import { ManualFileExchangeComponent } from '../task/manual-file-exchange.component';
import { SubjectDeleteComponent } from '../task/subject-delete.component';
import { SubjectEventComponent } from '../task/subject-event.component';

import { AuthenticationService } from '../../auth/authentication.service';
import { Roles } from '../../auth/roles.enum';

import { DataSource } from '@angular/cdk/collections';

const defaultDialogConfig = new MatDialogConfig();

@Component({
    selector: 'app-tasks-list',
    templateUrl: './tasks-list.component.html',
    styleUrls: ['./tasks-list.component.css'],
})

export class TasksListComponent implements OnInit {
    subjects: TaskStatus[] = [];
    taskConfig$: TaskConfig;

    dialogConfig = {
        minWidth: '',
    };

    displayedColumns = ['deleteSymbol', 'subjectName', 'subjectMode', 'subjectLastStatus', 'subjectLastDataStatus',
                        'subjectScheduledInterval', 'subjectNextScheduledDate', 'subjectScheduledIsActive'];

    dataSource: TaskDataSource | null;

    constructor(private router: Router,
        private taskStatusService: TaskStatusService,
        private taskConfigService: TaskConfigService,
        private snackBar: MatSnackBar,
        public auth: AuthenticationService,
        public dialog: MatDialog) {
        // this.dataSource = new ExampleDataSource(this.subjectService);
    }

    ngOnInit() {
        this.dataSource = new TaskDataSource(this.taskStatusService, this.taskConfigService, this.snackBar);
    }

    addSubjectOpenDialog() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.dialog.open(SubjectNewComponent, {
                minWidth: '1000px',
                panelClass: 'custom-dialog',
                disableClose: true
            });
        }
    }

    manualDownloadUpload(taskID: number, subjectName: string, subjectMode: string) {
        if (this.auth.isAuthorized(Roles.operator)) {
            this.dialog.open(ManualFileExchangeComponent, {
                data: { taskID: taskID },
                minWidth: '1000px',
                minHeight: '820px',
                panelClass: 'custom-dialog',
                disableClose: true
            });
        }
    }

    displayTask(taskID: number, subjectName: string) {
        this.dialog.open(SubjectDetailComponent, {
            data: {
                subjectID: taskID,
                subjectName: subjectName
            },
            minWidth: '1000px',
            minHeight: '950px',
            panelClass: 'custom-dialog',
            disableClose: true
        });
    }

    deleteTask(taskID: number, subjectName: string) {

        if (this.auth.isAuthorized(Roles.admin)) {
            const dialogRef = this.dialog.open(SubjectDeleteComponent, {
                data: { subjectName: subjectName }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.taskConfigService.deleteTask(taskID);
                    // this.taskStatusService.deleteTaskStatus( taskStatusID ); // Usunac w wersji z remote API serwerem
                }
            });
        }
    }

    displayEvent(taskID: number, subjectName: string) {
        this.dialog.open(SubjectEventComponent, {
            data: {
                taskID: taskID,
                subjectName: subjectName
            },
            minWidth: '1000px',
            panelClass: 'custom-dialog'
        });
    }

    taskScheduledEventChange(event, taskID: number) {

        if (this.auth.isAuthorized(Roles.admin)) {
            this.taskConfigService.getTaskConfig(taskID).subscribe(taskConfig => {
                this.taskConfig$ = taskConfig;
                this.taskConfig$.scheduledIsActive = event.checked;
                this.taskConfigService.updateTask(this.taskConfig$.id, this.taskConfig$);
            });
        }
    }
}

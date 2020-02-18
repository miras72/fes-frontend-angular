import { Component, Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { AfterViewChecked } from '@angular/core';

import { ElementRef, ViewChild } from '@angular/core';

import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { TaskConfig } from '../shared/task-config.model';
import { FileList } from '../shared/manual-file-exchange.model';
import { ManualFileExchange } from '../shared/manual-file-exchange.model';
import { Event } from '../shared/file-exchange-status.model';
import { TaskConfigService } from '../shared/task-config.service';
import { ManualFileExchangeService } from '../shared/manual-file-exchange.service';
import { FileExchangeStatusService } from '../shared/file-exchange-status.service';

import { AuthenticationService } from '../../auth/authentication.service';
import { Roles } from '../../auth/roles.enum';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-manual-file-exchange',
    templateUrl: './manual-file-exchange.component.html',
    styleUrls: ['./manual-file-exchange.component.css'],
})

export class ManualFileExchangeComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

    @ViewChild('scrollBottom') private scrollBottom: ElementRef;
    // @ViewChild('scrollBottomFileList') private scrollBottomFileList: ElementRef;

    taskConfig$: TaskConfig;
    fileExchangeStatus$: Event[] = [];
    manualFileExchange: ManualFileExchange;
    fileExchangeStatusObservable: any;
    manualFileForm: FormGroup;
    isRun = false;
    fileDateString: string;
    isLiveEvent: boolean;
    eventDateTime: string;

    constructor(private taskConfigService: TaskConfigService,
        private manualFileExchangeService: ManualFileExchangeService,
        private fileExchangeStatusService: FileExchangeStatusService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        public auth: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.createForm();
    }

    ngOnInit() {
        this.taskConfigService.getTaskConfig(this.data.taskID).subscribe(subjectConfig => {
            this.taskConfig$ = subjectConfig;
            this.ngOnChanges();
            this.isLiveEvent = true;
        });
    }

    ngOnChanges() {
        this.manualFileForm.reset({
            autoScroll: true,
            dateFile: new Date()
        });
        this.setFileList(this.taskConfig$.fileList);

    }
    createForm() {
        this.manualFileForm = this.fb.group({
            dateFile: { value: '', disabled: true },
            autoScroll: '',
            fileList: this.fb.array([this.initFileList()])
        });
    }

    initFileList(): FormGroup {
        return this.fb.group({
            fileName: ''
        });
    }

    setFileList(fileList: FileList[]) {
        this.manualFileForm.setControl('fileList', new FormArray([]));
        fileList.map(file => this.addFile(file));
    }

    get fileList(): FormArray {
        return this.manualFileForm.get('fileList') as FormArray;
    }

    addFile(file) {
        this.fileList.push(this.fb.group({
            fileName: [(file) ? file.fileName : '', [Validators.required]]
        }
        ));
    }

    removeFile(index: number) {
        this.fileList.removeAt(index);
    }

    getFileErrorMessage(index: number) {
        return (this.fileList.at(index).get('fileName').hasError('required')) ? 'Proszę podać nazwę pliku' : '';
    }

    public runManualFileExchange() {
        if (this.manualFileForm.valid) {
            this.isRun = true;
            this.manualFileForm.controls['fileList'].disable();
            this.manualFileForm.controls['autoScroll'].enable();
            this.manualFileExchange = this.prepareManualFileExchange();
            this.manualFileExchangeService.createTaskFileExchange(this.manualFileExchange);

            this.isLiveEvent = true;
            this.liveEvent();
        }
    }

    liveEvent() {
        TimerObservable.create(0, 1500)
            .takeWhile(() => this.isLiveEvent)
            .subscribe(() => {
                this.fileExchangeStatusService.getTaskFileExchangeStatus(this.data.taskID, this.eventDateTime)
                    .subscribe(
                        (fileExchangeTaskStatus) => {
                            fileExchangeTaskStatus.forEach(task => {
                                task.events.forEach(itemLive => {
                                    let notFound = true;
                                    this.fileExchangeStatus$.forEach(itemOld => {
                                        if (itemOld.id === itemLive.id) {
                                            notFound = false;
                                        }
                                    });
                                    if (notFound) {
                                        this.fileExchangeStatus$.push(itemLive);
                                        if (itemLive.eventText.includes('Koniec logowania zdarzeń')) {
                                            this.doneManualFileExchange();
                                        }
                                    }
                                });
                            });
                        },
                        (err) => {
                            console.log('Received error:', err);
                        }
                    );
            });
    }

    public stopnManualFileExchange() {
        this.isRun = false;
        this.isLiveEvent = false;
        this.manualFileForm.controls['fileList'].enable();
        this.manualFileForm.controls['autoScroll'].enable();
        this.manualFileExchangeService.deleteTaskFileExchange(this.data.taskID);
    }

    public doneManualFileExchange() {
        this.isRun = false;
        this.isLiveEvent = false;
        this.manualFileForm.controls['fileList'].enable();
        this.manualFileForm.controls['autoScroll'].enable();
        this.snackBar.open('Zadanie pobierania plików zakończone.', 'ZAMKNIJ', {
            duration: 10000,
        });
    }

    prepareManualFileExchange(): ManualFileExchange {
        const formModel = this.manualFileForm.getRawValue();
        const fileListDeepCopy: FileList[] = formModel.fileList.map(
            (file: FileList) => Object.assign({}, file)
        );

        const today = new Date();

        const day = String(today.getDate());
        const day0 = day.length < 2 ? '0' + day : day;

        const month = String(today.getMonth() + 1);
        const month0 = month.length < 2 ? '0' + month : month;

        const hour = String(today.getHours());
        const hour0 = hour.length < 2 ? '0' + hour : hour;

        const minute = String(today.getMinutes());
        const minute0 = minute.length < 2 ? '0' + minute : minute;

        const second = String(today.getSeconds());
        const second0 = second.length < 2 ? '0' + second : second;

        this.eventDateTime = day0 + month0 + String(today.getFullYear()) + hour0 + minute0 + second0;

        const stringDay = String(formModel.dateFile.getDate());
        const stringDay0 = stringDay.length < 2 ? '0' + stringDay : stringDay;
        const stringMonth = String(formModel.dateFile.getMonth() + 1);
        const stringMonth0 = stringMonth.length < 2 ? '0' + stringMonth : stringMonth;
        this.fileDateString = stringDay0 + stringMonth0 + String(formModel.dateFile.getFullYear());
        const saveManualFileForm: ManualFileExchange = {
            eventDateTime: this.eventDateTime,
            taskID: this.taskConfig$.id,
            fileDate: this.fileDateString,
            fileList: fileListDeepCopy,
        };
        return saveManualFileForm;
    }

    ngAfterViewChecked() {
        if (this.manualFileForm.controls.autoScroll.value) {
            this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
        }
        // this.scrollBottomFileList.nativeElement.scrollTop = this.scrollBottomFileList.nativeElement.scrollHeight;
    }

    ngOnDestroy() {
        this.isLiveEvent = false;
    }
}

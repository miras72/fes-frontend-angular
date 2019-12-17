import { Component, Inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnChanges } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { AfterViewChecked } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';

import { FileExchangeStatusService } from '../shared/file-exchange-status.service';
import { FileExchangeStatus } from '../shared/file-exchange-status.model';
import { Event } from '../shared/file-exchange-status.model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-subject-event',
    templateUrl: './subject-event.component.html',
    styleUrls: ['./subject-event.component.css'],
})

export class SubjectEventComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

    planModel: any = { start_date: new Date() };
    isLiveEvent: boolean;
    fileExchangeStatus$: Event[] = [];
    eventDate: string;
    todayDate: string;

    @ViewChild('scrollBottom') private scrollBottom: ElementRef;

    constructor(private fileExchangeStatusService: FileExchangeStatusService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        const stringDay = String(this.planModel.start_date.getDate());
        const stringDay0 = stringDay.length < 2 ? '0' + stringDay : stringDay;
        const stringMonth = String(this.planModel.start_date.getMonth() + 1);
        const stringMonth0 = stringMonth.length < 2 ? '0' + stringMonth : stringMonth;
        this.eventDate = stringDay0 + stringMonth0 + String(this.planModel.start_date.getFullYear());
    }

    ngOnInit() {
        this.ngOnChanges();
        const stringDay = String(new Date().getDate());
        const stringDay0 = stringDay.length < 2 ? '0' + stringDay : stringDay;
        const stringMonth = String(new Date().getMonth() + 1);
        const stringMonth0 = stringMonth.length < 2 ? '0' + stringMonth : stringMonth;
        this.todayDate = stringDay0 + stringMonth0 + String(new Date().getFullYear());
    }

    ngOnChanges() {
        this.fileExchangeStatus$ = [];
        this.fileExchangeStatusService.getTaskFileExchangeStatus(this.data.taskID, this.eventDate)
            .subscribe(
                (fileExchangeTaskStatus) => {
                    fileExchangeTaskStatus.forEach(task => {
                        task.events.forEach(item => {
                            this.fileExchangeStatus$.push(item);
                        });
                    });
                },
                (err) => {
                    console.log('Received error:', err);
                }
            );
        this.isLiveEvent = false;
    }

    liveEventChange(event) {
        if (event.checked) {
            this.isLiveEvent = true;
            TimerObservable.create(0, 1500)
                .takeWhile(() => this.isLiveEvent)
                .subscribe(() => {
                    this.fileExchangeStatusService.getTaskFileExchangeStatus(this.data.taskID, this.eventDate)
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
                                        }
                                    });
                                });
                            },
                            (err) => {
                                console.log('Received error:', err);
                            }
                        );
                });
        } else {
            this.isLiveEvent = false;
        }
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {
        const stringDay = String(event.value.getDate());
        const stringDay0 = stringDay.length < 2 ? '0' + stringDay : stringDay;
        const stringMonth = String(event.value.getMonth() + 1);
        const stringMonth0 = stringMonth.length < 2 ? '0' + stringMonth : stringMonth;
        this.eventDate = stringDay0 + stringMonth0 + String(event.value.getFullYear());
        this.ngOnChanges();
    }

    ngAfterViewChecked() {
        if (this.isLiveEvent) {
            this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
        }
    }

    ngOnDestroy() {
        this.isLiveEvent = false;
    }
}

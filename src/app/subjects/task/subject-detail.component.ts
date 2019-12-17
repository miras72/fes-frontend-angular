import { Component, OnInit, Inject} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { TaskConfig } from '../shared/task-config.model';
import { TaskConfigService } from '../shared/task-config.service';

// import { Observable } from 'rxjs/Observable';


@Component( {
    selector: 'app-subject-detail',
    templateUrl: './subject-detail.component.html',
    styleUrls: ['./subject-detail.component.css']
} )
export class SubjectDetailComponent implements OnInit {

    taskConfig$: TaskConfig;

    // @Input() subjectID: number;

    isEdit = true;

    constructor(public dialogRef: MatDialogRef<SubjectDetailComponent>,
                private subjectConfigService: TaskConfigService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

      /*  this.subjectConfigService.getSubjectConfig( this.data.subjectID ).then( subjectConfig => {
            this.subjectConfig = subjectConfig; */

            this.subjectConfigService.getTaskConfig( this.data.subjectID ).subscribe( subjectConfig => {
                this.taskConfig$ = subjectConfig;

           /* this.checkedPN = ((subjectConfig.days % 2) >= 1 ? true : false );
            this.checkedWT = ((subjectConfig.days % 4) >= 2 ? true : false );
            this.checkedSR = ((subjectConfig.days % 8) >= 4 ? true : false );
            this.checkedCZ = ((subjectConfig.days % 16) >= 8 ? true : false );
            this.checkedPT = ((subjectConfig.days % 32) >= 16 ? true : false );
            this.checkedSO = ((subjectConfig.days % 64) >= 32 ? true : false );
            this.checkedND = ((subjectConfig.days % 128) >= 64 ? true : false );

            this.checkedSTY = ((subjectConfig.mounths % 2) >= 1 ? true : false );
            this.checkedLUT = ((subjectConfig.mounths % 4) >= 2 ? true : false );
            this.checkedMAR = ((subjectConfig.mounths % 8) >= 4 ? true : false );
            this.checkedKWI = ((subjectConfig.mounths % 16) >= 8 ? true : false );
            this.checkedMAJ = ((subjectConfig.mounths % 32) >= 16 ? true : false );
            this.checkedCZE = ((subjectConfig.mounths % 64) >= 32 ? true : false );
            this.checkedLIP = ((subjectConfig.mounths % 128) >= 64 ? true : false );
            this.checkedSIE = ((subjectConfig.mounths % 256) >= 128 ? true : false );
            this.checkedWRZ = ((subjectConfig.mounths % 512) >= 256 ? true : false );
            this.checkedPAZ = ((subjectConfig.mounths % 1024) >= 512 ? true : false );
            this.checkedLIS = ((subjectConfig.mounths % 2048) >= 1024 ? true : false );
            this.checkedGRU = ((subjectConfig.mounths % 4096) >= 2048 ? true : false ); */
           // this.ngOnChanges();
       });
    }
}

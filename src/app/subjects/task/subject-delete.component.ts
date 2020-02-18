import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-subject-delete',
    templateUrl: './subjects-delete.component.html',
    styleUrls: ['./subjects-delete.component.css'],
  })

export class SubjectDeleteComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }
}

import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-subject-new',
    templateUrl: './subjects-new.component.html',
    styleUrls: ['./subjects-new.component.css'],
  })

export class SubjectNewComponent {
    isEdit = false;

    constructor(public dialogRef: MatDialogRef<SubjectNewComponent>) {
    }
}

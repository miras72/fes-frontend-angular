import { Component, OnInit, OnChanges } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import {MatDialogRef} from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { AuthenticationService } from '../auth/authentication.service';
import { Roles } from '../auth/roles.enum';

import { ServerConfig } from './server-config.model';
import { ServerConfigService } from './server-config.service';
import { StatusMessage } from '../subjects/shared/status-message.model';

@Component( {
    selector: 'app-server',
    templateUrl: './server.component.html',
    styleUrls: ['./server.component.css'],
} )

export class ServerComponent implements OnInit, OnChanges {

    serverConfigForm: FormGroup;
    serverConfig$: ServerConfig;
    updateServerConfig: ServerConfig;

    constructor(
        public dialogRef: MatDialogRef<ServerComponent>,
        private fb: FormBuilder,
        public auth: AuthenticationService,
        private serverConfigService: ServerConfigService,
        private snackBar: MatSnackBar) {

        this.createForm();
    }

    ngOnInit() {
        this.serverConfigService.getServerConfig().subscribe( serverConfig => {
            this.serverConfig$ = serverConfig;
            this.ngOnChanges();
        });
    }

    createForm() {
        this.serverConfigForm = this.fb.group( {
            workDirectory: ['', Validators.required],
            archDirectory: ['', Validators.required],
        } );
    }

    ngOnChanges() {
        this.serverConfigForm.reset( {
            workDirectory: this.serverConfig$.workDirectory,
            archDirectory: this.serverConfig$.archDirectory,
        } );
    }

    saveServerConfig() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.updateServerConfig = this.prepareServerConfig();
            this.serverConfigService.updateServerConfig(this.updateServerConfig);
            this.dialogRef.close();
        }
    }

    prepareServerConfig(): ServerConfig {
        const formModel = this.serverConfigForm.getRawValue();

        const saveServerConfigForm: ServerConfig = {
                workDirectory: formModel.workDirectory,
                archDirectory: formModel.archDirectory,
        };
        return saveServerConfigForm;
    }
}

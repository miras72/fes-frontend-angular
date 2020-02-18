import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import {AuthenticationService} from './authentication.service';

import { User } from './user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })


  export class LoginComponent {

    loginForm: FormGroup;
    user: User;
    show: boolean;

    constructor(
            private auth: AuthenticationService,
            public dialogRef: MatDialogRef<LoginComponent>,
            private fb: FormBuilder) {

            this.createForm();
        }

    createForm() {
        this.loginForm = this.fb.group( {
            username: ['', Validators.required],
            password: ['', Validators.required],
        } );
    }

    prepareLogin(): User {
        const formModel = this.loginForm.getRawValue();

        const userForm: User = {
                username: formModel.username,
                password: formModel.password,
        };
        return userForm;
    }

    login() {
        this.user = this.prepareLogin();
        this.auth.login(this.user).subscribe();
        this.dialogRef.close();
    }
}

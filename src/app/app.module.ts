import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './subjects/shared/in-memory-data.service';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TaskStatusService } from './subjects/shared/task-status.service';
import { TaskConfigService } from './subjects/shared/task-config.service';
import { TasksListComponent } from './subjects/tasks-list/tasks-list.component';
import { SubjectDetailComponent } from './subjects/task/subject-detail.component';
import { SubjectNewComponent } from './subjects/task/subject-new.component';
import { SubjectComponent } from './subjects/task/subject.component';
import { ManualFileExchangeComponent } from './subjects/task/manual-file-exchange.component';
import { ManualFileExchangeService } from './subjects/shared/manual-file-exchange.service';
import { FileExchangeStatusService } from './subjects/shared/file-exchange-status.service';
import { SubjectDeleteComponent } from './subjects/task/subject-delete.component';
import { SubjectEventComponent  } from './subjects/task/subject-event.component';
import { ServerComponent } from './server/server.component';
import { ServerConfigService } from './server/server-config.service';

import { EncryptionKeyComponent } from './encryption-key/encryption-key.component';
import { EncryptionKeyDeleteComponent } from './encryption-key/encryption-key-delete.component';
import { EncryptionKeyAddComponent } from './encryption-key/encryption-key-add.component';
import { EncryptionKeyRepositoryComponent } from './encryption-key/encryption-key-repository.component';
import { EncryptionKeyService } from './encryption-key/encryption-key.service';

import { DecryptionKeyComponent } from './decryption-key/decryption-key.component';
import { DecryptionKeyDeleteComponent } from './decryption-key/decryption-key-delete.component';
import { DecryptionKeyAddComponent } from './decryption-key/decryption-key-add.component';
import { DecryptionKeyRepositoryComponent } from './decryption-key/decryption-key-repository.component';
import { DecryptionKeyService } from './decryption-key/decryption-key.service';

import { AuthenticationService } from './auth/authentication.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';

import { InputFileComponent } from './input-file/input-file.component';
import { ByteFormatPipe } from './input-file/byte-format.pipe';
import { DatePipe } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl, 'pl-PL');
// import { SnackBarStatusMessageComponent } from './subjects/snackbar/snack-bar-status-message-component';

// import { InputFileComponent } from './subjects/input_file/input-file.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksListComponent,
    SubjectDetailComponent,
    SubjectNewComponent,
    SubjectComponent,
    ManualFileExchangeComponent,
    SubjectDeleteComponent,
    SubjectEventComponent,
    ServerComponent,
    EncryptionKeyComponent,
    EncryptionKeyDeleteComponent,
    EncryptionKeyAddComponent,
    EncryptionKeyRepositoryComponent,
    DecryptionKeyComponent,
    DecryptionKeyDeleteComponent,
    DecryptionKeyAddComponent,
    DecryptionKeyRepositoryComponent,
    LoginComponent,
    LogoutComponent,
    InputFileComponent,
    ByteFormatPipe
    // SnackBarStatusMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    // Simulate a data server in memory
     // InMemoryWebApiModule.forRoot(InMemoryDataService),
    // InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 1000 }),
  ],
  providers: [TaskStatusService, TaskConfigService, MatDialog, JwtInterceptor, ManualFileExchangeService,DatePipe,
              FileExchangeStatusService, EncryptionKeyService, DecryptionKeyService, ServerConfigService, AuthenticationService,
              {
                  provide: HTTP_INTERCEPTORS,
                  useClass: JwtInterceptor,
                  multi: true
              },
              //{provide: //MAT_DATE_LOCALE, useValue: 'pl-PL'}],
              {provide: LOCALE_ID, useValue: 'pl-PL'}],
  entryComponents: [SubjectDetailComponent, SubjectNewComponent,
                    ManualFileExchangeComponent, SubjectDeleteComponent,
                    SubjectEventComponent, ServerComponent, EncryptionKeyComponent,
                    EncryptionKeyDeleteComponent, EncryptionKeyAddComponent, EncryptionKeyRepositoryComponent,
                    DecryptionKeyComponent, DecryptionKeyDeleteComponent,
                    DecryptionKeyAddComponent, DecryptionKeyRepositoryComponent,
                    LoginComponent, LogoutComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

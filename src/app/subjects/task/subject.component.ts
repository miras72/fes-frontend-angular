import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { TaskConfig, Server, FileList, MailingList, SUBJECT_MODE, EXCHANGE_PROTOCOL,
    SOURCE_FILE_MODE, DECOMPRESSION_METHOD, DECRYPTION_METHOD
} from '../shared/task-config.model';

import { TaskStatus } from '../shared/task-status.model';

import { EncryptionKey } from '../../encryption-key/encryption-key.model';
import { EncryptionKeyService } from '../../encryption-key/encryption-key.service';
import { DecryptionKey } from '../../decryption-key/decryption-key.model';
import { DecryptionKeyService } from '../../decryption-key/decryption-key.service';
import { TaskConfigService } from '../shared/task-config.service';
import { TaskStatusService } from '../shared/task-status.service';

import { AuthenticationService } from '../../auth/authentication.service';
import { Roles } from '../../auth/roles.enum';

@Component( {
    selector: 'app-subject',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css'],
} )

export class SubjectComponent implements OnInit, OnChanges {

    @Input() taskConfig: TaskConfig | undefined;
    @Input() isEdit: boolean;
    @Input() dialogRef;

    taskStatus: TaskStatus;

    isDisabled: boolean;
    valuePlaceholder: string;
    encryptionKeys$: EncryptionKey[];
    decryptionKeys$: DecryptionKey[];

    firstSubjectForm: FormGroup;
    secondSubjectForm: FormGroup;
    thirdSubjectForm: FormGroup;
    fourthSubjectForm: FormGroup;
    fifthSubjectForm: FormGroup;
    lastSubjectForm: FormGroup;

    exchangeProtocol = EXCHANGE_PROTOCOL;
    subjectMode = SUBJECT_MODE;
    sourceFileMode = SOURCE_FILE_MODE;
    decompressionMethod = DECOMPRESSION_METHOD;
    decryptionMethod = DECRYPTION_METHOD;

    constructor(private encryptionKeyService: EncryptionKeyService,
        private decryptionKeyService: DecryptionKeyService,
        private fb: FormBuilder,
        public auth: AuthenticationService,
        private taskConfigService: TaskConfigService,
        private taskStatusService: TaskStatusService ) {
        this.encryptionKeyService.getEncryptionKeys()
            .subscribe( encryptionKeys => {
                this.encryptionKeys$ = encryptionKeys;
            } );
        this.decryptionKeyService.getDecryptionKeys()
        .subscribe( decryptionKeys => {
            this.decryptionKeys$ = decryptionKeys;
        } );
        this.createForm();
    }

    ngOnInit() {

        if ( this.isEdit ) {
            this.isDisabled = true;
            this.firstSubjectForm.disable();
            this.secondSubjectForm.disable();
            this.thirdSubjectForm.disable();
            this.fourthSubjectForm.disable();
            this.fifthSubjectForm.disable();
            this.lastSubjectForm.disable();
        }
        this.ngOnChanges();
    }

    ngOnChanges() {
        if ( this.isEdit ) {
            this.firstSubjectForm.reset( {
                id: this.taskConfig.id,
                subjectName: this.taskConfig.subjectName,
                subjectAddress: this.taskConfig.subjectAddress,
                subjectLogin: this.taskConfig.subjectLogin,
                subjectPassword: this.taskConfig.subjectPassword,
                subjectDirectory: this.taskConfig.subjectDirectory,
                subjectMode: this.taskConfig.subjectMode,
                subjectExchangeProtocol: this.taskConfig.subjectExchangeProtocol,
                subjectLoginForm: this.taskConfig.subjectLoginForm,
                subjectLogoutForm: this.taskConfig.subjectLogoutForm,
                subjectPostOptions: this.taskConfig.subjectPostOptions,
                subjectResponseString: this.taskConfig.subjectResponseString,
                subjectEncryptionKeyID: this.taskConfig.subjectEncryptionKeyID,
            } );
            this.setServers( this.taskConfig.servers );
            this.thirdSubjectForm.reset( {
                fileArchive: this.taskConfig.fileArchive,
                dateFormat: this.taskConfig.dateFormat,
                serverDecompressionMethod: this.taskConfig.decompressionMethod,
                serverDecryptionMethod: this.taskConfig.decryptionMethod,
                decryptionKeyID: this.taskConfig.decryptionKeyID,
                serverSourceFileMode: this.taskConfig.sourceFileMode,
            } );
            this.setFileList( this.taskConfig.fileList );
            this.fourthSubjectForm.reset( {
                minutes: this.taskConfig.minutes,
                hours: this.taskConfig.hours,
                scheduledIsActive: this.taskConfig.scheduledIsActive,
                checkedPN: ( ( this.taskConfig.days % 2 ) >= 1 ? true : false ),
                checkedWT: ( ( this.taskConfig.days % 4 ) >= 2 ? true : false ),
                checkedSR: ( ( this.taskConfig.days % 8 ) >= 4 ? true : false ),
                checkedCZ: ( ( this.taskConfig.days % 16 ) >= 8 ? true : false ),
                checkedPT: ( ( this.taskConfig.days % 32 ) >= 16 ? true : false ),
                checkedSO: ( ( this.taskConfig.days % 64 ) >= 32 ? true : false ),
                checkedND: ( ( this.taskConfig.days % 128 ) >= 64 ? true : false ),

                checkedSTY: ( ( this.taskConfig.months % 2 ) >= 1 ? true : false ),
                checkedLUT: ( ( this.taskConfig.months % 4 ) >= 2 ? true : false ),
                checkedMAR: ( ( this.taskConfig.months % 8 ) >= 4 ? true : false ),
                checkedKWI: ( ( this.taskConfig.months % 16 ) >= 8 ? true : false ),
                checkedMAJ: ( ( this.taskConfig.months % 32 ) >= 16 ? true : false ),
                checkedCZE: ( ( this.taskConfig.months % 64 ) >= 32 ? true : false ),
                checkedLIP: ( ( this.taskConfig.months % 128 ) >= 64 ? true : false ),
                checkedSIE: ( ( this.taskConfig.months % 256 ) >= 128 ? true : false ),
                checkedWRZ: ( ( this.taskConfig.months % 512 ) >= 256 ? true : false ),
                checkedPAZ: ( ( this.taskConfig.months % 1024 ) >= 512 ? true : false ),
                checkedLIS: ( ( this.taskConfig.months % 2048 ) >= 1024 ? true : false ),
                checkedGRU: ( ( this.taskConfig.months % 4096 ) >= 2048 ? true : false )
            } );

            this.fifthSubjectForm.reset( {
                mailFrom: this.taskConfig.mailFrom,
                mailSubject: this.taskConfig.mailSubject
            } );
            this.setMilingList( this.taskConfig.mailingList );

            this.firstSubjectForm.disable();
            this.secondSubjectForm.disable();
            this.thirdSubjectForm.disable();
            this.fourthSubjectForm.disable();
            this.fifthSubjectForm.disable();
            this.lastSubjectForm.disable();
        }
    }

    createForm() {

        this.firstSubjectForm = this.fb.group( {
            id: null,
            subjectName: ['', Validators.required],
            subjectAddress: ['', Validators.required],
            subjectLogin: '',
            subjectPassword: '',
            subjectDirectory: '',
            subjectMode: ['', Validators.required],
            subjectExchangeProtocol: ['', Validators.required],
            subjectLoginForm: '',
            subjectLogoutForm: '',
            subjectPostOptions: '',
            subjectResponseString: '',
            subjectEncryptionKeyID: '',
        } );

        this.secondSubjectForm = this.fb.group( {
            subjectDirectory: '',
            servers: this.fb.array( [this.initServers()] )
        } );

        this.thirdSubjectForm = this.fb.group( {
            fileArchive: '',
            dateFormat: 'yyyyMMdd',
            serverDecompressionMethod: '',
            serverDecryptionMethod: '',
            decryptionKeyID: '',
            serverSourceFileMode: '',
            fileList: this.fb.array( [this.initFileList()] )
        } );

        this.fourthSubjectForm = this.fb.group( {
            minutes: ['00', Validators.required],
            hours: '20',
            scheduledIsActive: null,
            checkedPN: true,
            checkedWT: true,
            checkedSR: true,
            checkedCZ: true,
            checkedPT: true,
            checkedSO: '',
            checkedND: '',
            checkedSTY: true,
            checkedLUT: true,
            checkedMAR: true,
            checkedKWI: true,
            checkedMAJ: true,
            checkedCZE: true,
            checkedLIP: true,
            checkedSIE: true,
            checkedWRZ: true,
            checkedPAZ: true,
            checkedLIS: true,
            checkedGRU: true
        } );

        this.fifthSubjectForm = this.fb.group( {
            mailSubject: ['', Validators.required],
            mailFrom: ['', [Validators.required, Validators.email]],
            mailingList: this.fb.array( [this.initMailingList()] )
        } );

        this.lastSubjectForm = this.fb.group( {
        } );
    }

    initServers(): FormGroup {
        return this.fb.group( {
            id: null,
            taskID: null,
            serverAddress: '',
            serverLogin: '',
            serverPassword: '',
            serverDirectory: ''
        } );
    }

    initFileList(): FormGroup {
        return this.fb.group( {
            id: null,
            taskID: null,
            fileName: ''
        } );
    }

    initMailingList(): FormGroup {
        return this.fb.group( {
            id: null,
            taskID: null,
            recipientName: ''
        } );
    }

    setServers( servers: Server[] ) {
        this.secondSubjectForm.setControl( 'servers', new FormArray( [] ) );
        servers.map( server => this.addServer( server ) );
    }

    setFileList( fileList: FileList[] ) {
        this.thirdSubjectForm.setControl( 'fileList', new FormArray( [] ) );
        fileList.map( file => this.addFile( file ) );
    }

    setMilingList( mailingList: MailingList[] ) {
        this.fifthSubjectForm.setControl( 'mailingList', new FormArray( [] ) );
        mailingList.map( recipient => this.addRecipient( recipient ) );
    }

    get servers(): FormArray {
        return this.secondSubjectForm.get( 'servers' ) as FormArray;
    }

    get fileList(): FormArray {
        return this.thirdSubjectForm.get( 'fileList' ) as FormArray;
    }

    get mailingList(): FormArray {
        return this.fifthSubjectForm.get( 'mailingList' ) as FormArray;
    }

    getSubjectNameErrorMessage() {
        return ( this.firstSubjectForm.get( 'subjectName' ).hasError( 'required' ) ) ? 'Proszę podać nazwę Podmiotu' : '';
    }

    getSubjectAddressErrorMessage() {
        return ( this.firstSubjectForm.get( 'subjectAddress' ).hasError( 'required' ) ) ? 'Proszę podać adres Serwera' : '';
    }

    getSubjectModeErrorMessage() {
        return ( this.firstSubjectForm.get( 'subjectMode' ).hasError( 'required' ) ) ? 'Proszę wybrać tryb wymiany plików' : '';
    }

    getSubjectExchangeProtocolErrorMessage() {
        return ( this.firstSubjectForm.get( 'subjectExchangeProtocol' ).hasError( 'required' ) ) ? 'Proszę wybrać protokół wymiany' : '';
    }

    getServerAddressErrorMessage( index: number ) {
        return ( this.servers.at( index ).get( 'serverAddress' ).hasError( 'required' ) ) ? 'Proszę podać adres serwera' : '';
    }

    getFileErrorMessage( index: number ) {
        return ( this.fileList.at( index ).get( 'fileName' ).hasError( 'required' ) ) ? 'Proszę podać nazwę pliku' : '';
    }

    getMailSubjectErrorMessage() {
        return ( this.fifthSubjectForm.get( 'mailSubject' ).hasError( 'required' ) ) ? 'Proszę podać Tytuł wiadomości' : '';
    }

    getMailFromErrorMessage() {
        return ( this.fifthSubjectForm.get( 'mailFrom' ).hasError( 'required' ) ) ? 'Proszę podać adres email' :
            ( this.fifthSubjectForm.get( 'mailFrom' ).hasError( 'email' ) ) ? 'Proszę wpisać prawidłowy adres email' : '';
    }

    getRecipientNameErrorMessage( index: number ) {
        return ( this.mailingList.at( index ).get( 'recipientName' ).hasError( 'required' ) ) ? 'Proszę podać adres email' :
            ( this.mailingList.at( index ).get( 'recipientName' ).hasError( 'email' ) ) ? 'Proszę wpisać prawidłowy adres email' : '';
    }

    addServer( server ) {
        this.servers.push( this.fb.group( {
            id: ( server ) ? server.id : null,
            taskID: ( server ) ? server.taskID : null,
            serverAddress: [( server ) ? server.serverAddress : '', [Validators.required]],
            serverLogin: ( server ) ? server.serverLogin : '',
            serverPassword: ( server ) ? server.serverPassword : '',
            serverDirectory: ( server ) ? server.serverDirectory : ''
        }
        ) );
    }

    removeServer( index: number ) {
        this.servers.removeAt( index );
    }

    addFile( file ) {
        this.fileList.push( this.fb.group( {
            id: ( file ) ? file.id : null,
            taskID: ( file ) ? file.taskID : null,
            fileName: [( file ) ? file.fileName : '', [Validators.required]]
        }
        ) );
    }

    removeFile( index: number ) {
        this.fileList.removeAt( index );
    }

    addRecipient( recipient ) {
        this.mailingList.push( this.fb.group( {
            id: ( recipient ) ? recipient.id : null,
            taskID: ( recipient ) ? recipient.taskID : null,
            recipientName: [( recipient ) ? recipient.recipientName : '', [Validators.required, Validators.email]]
        }
        ) );
    }

    removeRecipient( index: number ) {
        this.mailingList.removeAt( index );
    }

    public editSubject() {
        if (this.auth.isAuthorized(Roles.admin)) {
            this.isDisabled = false;
            this.firstSubjectForm.enable();
            this.secondSubjectForm.enable();
            this.thirdSubjectForm.enable();
            this.fourthSubjectForm.enable();
            this.fifthSubjectForm.enable();
            this.lastSubjectForm.enable();
        }
    }

    public cancelEditSubject() {
        this.isDisabled = true;
        this.firstSubjectForm.disable();
        this.secondSubjectForm.disable();
        this.thirdSubjectForm.disable();
        this.fourthSubjectForm.disable();
        this.fifthSubjectForm.disable();
        this.lastSubjectForm.disable();
        this.ngOnChanges();
    }

    public saveSubject() {
        this.isDisabled = true;
        this.firstSubjectForm.disable();
        this.secondSubjectForm.disable();
        this.thirdSubjectForm.disable();
        this.fourthSubjectForm.disable();
        this.fifthSubjectForm.disable();
        this.lastSubjectForm.disable();
        this.taskConfig = this.prepareSaveSubject();
        // this.taskStatus = this.prepareSaveTaskStatus(); // Usunac w wersji z remote API serwerem
        if ( this.isEdit ) {
            this.taskConfigService.updateTask( this.taskConfig.id, this.taskConfig);
            // this.taskStatusService.updateTaskStatus(this.taskStatus); // Usunac w wersji z remote API serwerem
        } else {
            this.taskConfigService.addTask( this.taskConfig );
            //  this.taskStatusService.addTaskStatus(this.taskStatus); // Usunac w wersji z remote API serwerem
        }
        this.dialogRef.close();
    }

    prepareSaveSubject(): TaskConfig {
        const firstFormModel = this.firstSubjectForm.value;
        const secondFormModel = this.secondSubjectForm.value;
        const thirdFormModel = this.thirdSubjectForm.value;
        const fourthFormModel = this.fourthSubjectForm.value;
        const fifthFormModel = this.fifthSubjectForm.value;
        const serversDeepCopy: Server[] = secondFormModel.servers.map(
            ( server: Server ) => Object.assign( {}, server )
        );
        const fileListDeepCopy: FileList[] = thirdFormModel.fileList.map(
            ( file: FileList ) => Object.assign( {}, file )
        );
        const mailingListDeepCopy: MailingList[] = fifthFormModel.mailingList.map(
            ( recipient: MailingList ) => Object.assign( {}, recipient )
        );
        const saveSubject: TaskConfig = {
            id: firstFormModel.id,
            subjectName: firstFormModel.subjectName,
            subjectAddress: firstFormModel.subjectAddress,
            subjectLogin: firstFormModel.subjectLogin,
            subjectPassword: firstFormModel.subjectPassword,
            subjectDirectory: firstFormModel.subjectDirectory,
            subjectExchangeProtocol: firstFormModel.subjectExchangeProtocol,
            subjectEncryptionKeyID: firstFormModel.subjectEncryptionKeyID,
            subjectMode: firstFormModel.subjectMode,
            subjectLoginForm: firstFormModel.subjectLoginForm,
            subjectLogoutForm: firstFormModel.subjectLogoutForm,

            subjectPostOptions: firstFormModel.subjectPostOptions,
            subjectResponseString: firstFormModel.subjectResponseString,

            servers: serversDeepCopy,

            sourceFileMode: thirdFormModel.serverSourceFileMode,
            decompressionMethod: thirdFormModel.serverDecompressionMethod,
            decryptionMethod: thirdFormModel.serverDecryptionMethod,
            decryptionKeyID: thirdFormModel.decryptionKeyID,

            dateFormat: thirdFormModel.dateFormat,

            fileList: fileListDeepCopy,
            fileArchive: thirdFormModel.fileArchive,

            minutes: fourthFormModel.minutes,
            hours: fourthFormModel.hours,
            days: ( fourthFormModel.checkedPN ? 1 : 0 ) +
            ( fourthFormModel.checkedWT ? 2 : 0 ) +
            ( fourthFormModel.checkedSR ? 4 : 0 ) +
            ( fourthFormModel.checkedCZ ? 8 : 0 ) +
            ( fourthFormModel.checkedPT ? 16 : 0 ) +
            ( fourthFormModel.checkedSO ? 32 : 0 ) +
            ( fourthFormModel.checkedND ? 64 : 0 ),

            months: ( fourthFormModel.checkedSTY ? 1 : 0 ) +
            ( fourthFormModel.checkedLUT ? 2 : 0 ) +
            ( fourthFormModel.checkedMAR ? 4 : 0 ) +
            ( fourthFormModel.checkedKWI ? 8 : 0 ) +
            ( fourthFormModel.checkedMAJ ? 16 : 0 ) +
            ( fourthFormModel.checkedCZE ? 32 : 0 ) +
            ( fourthFormModel.checkedLIP ? 64 : 0 ) +
            ( fourthFormModel.checkedSIE ? 128 : 0 ) +
            ( fourthFormModel.checkedWRZ ? 256 : 0 ) +
            ( fourthFormModel.checkedPAZ ? 512 : 0 ) +
            ( fourthFormModel.checkedLIS ? 1024 : 0 ) +
            ( fourthFormModel.checkedGRU ? 2048 : 0 ),

            scheduledIsActive: fourthFormModel.scheduledIsActive,

            mailFrom: fifthFormModel.mailFrom,
            mailSubject: fifthFormModel.mailSubject,
            mailingList: mailingListDeepCopy
        };
        return saveSubject;
    }
}

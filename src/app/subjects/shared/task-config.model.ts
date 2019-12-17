export interface TaskConfig {
    id?: number;
    taskStatusID?: number;
    subjectName: string;
    subjectAddress: string;
    subjectLogin: string;
    subjectPassword: string;
    subjectDirectory: string;
    subjectExchangeProtocol: string;
    subjectEncryptionKeyID: number;
    subjectMode: string;
    subjectLoginForm: string;
    subjectLogoutForm: string;
    subjectPostOptions: string;
    subjectResponseString: string;

    servers: Server[];

    sourceFileMode: string;
    decompressionMethod: string;
    decryptionMethod: string;
    decryptionKeyID: number;
    // decryptionKeyName: string;

    dateFormat: string;

    fileList: FileList[];
    fileArchive: boolean;

    minutes: string;
    hours: string;
    days: number;
    months: number;
    scheduledIsActive: boolean;

    mailFrom: string;
    mailSubject: string;
    mailingList: MailingList[];
}

export interface Server {
    id?: number;
    taskID?: number;
    serverAddress: string;
    serverLogin: string;
    serverPassword: string;
    serverDirectory: string;
}

export interface FileList {
    id?: number;
    taskID?: number;
    fileName: string;
}

export interface MailingList {
    id?: number;
    taskID?: number;
    recipientName: string;
}

export const SUBJECT_MODE = ['download', 'upload'];
export const EXCHANGE_PROTOCOL = ['sftp', 'ssl', 'ftp'];
export const SOURCE_FILE_MODE = ['delete', 'rename', 'sync'];
export const DECOMPRESSION_METHOD = ['gzip', 'zip'];
export const DECRYPTION_METHOD = ['pgp'];

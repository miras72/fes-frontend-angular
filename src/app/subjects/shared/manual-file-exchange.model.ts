export interface ManualFileExchange {
    id?: number;
    eventDateTime: string;
    taskID: number;
    fileDate: string;
    fileList: FileList[];
}

export interface FileList {
    fileName: string;
}

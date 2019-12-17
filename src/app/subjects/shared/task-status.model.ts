import {TaskConfig} from './task-config.model';

export interface TaskStatus {
    id?: number;
   // taskID: number;
   // subjectName: string;
   // subjectMode: string;
    lastStatus: string;
    lastDataStatus: string;
    nextScheduledDate: string;
    scheduledInterval: string;
    //scheduledIsActive: boolean;

    taskConfig: TaskConfig;
}

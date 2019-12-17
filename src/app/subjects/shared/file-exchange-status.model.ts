export interface FileExchangeStatus {
    id: number;
    taskID: number;
    eventDate: string;
    events: Event[];
}

export interface Event {
    id: number;
    fileExchangeStatusID: number;
    eventText: string;
}

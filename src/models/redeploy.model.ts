export interface ILogFile {
    name: string;
    steps?: IStep[]
}

export interface IStep {
    name: string;
    started: Date;
    ended?: Date;
    error?: boolean;
    outpout?: string;
}
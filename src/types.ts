export interface CloudTaskOptions {
    projectId: string;
    location: string;
    queueId: string;
    url: string;
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
    payload?: Record<string, any>;
    scheduleTime?: Date;
    serviceAccountEmail?: string;
}

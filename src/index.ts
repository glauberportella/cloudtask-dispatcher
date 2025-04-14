import { CloudTasksClient } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import { CloudTaskOptions } from './types';

class CloudTaskDispatcher {
    private client: CloudTasksClient;

    constructor() {
        this.client = new CloudTasksClient();
    }

    async dispatch(options: CloudTaskOptions): Promise<google.cloud.tasks.v2.ITask> {
        const {
            projectId,
            location,
            queueId,
            url,
            method = 'POST',
            payload,
            scheduleTime,
            serviceAccountEmail,
        } = options;

        const parent = this.client.queuePath(projectId, location, queueId);
        
        const task: google.cloud.tasks.v2.ITask = {
            httpRequest: {
                httpMethod: method,
                url,
            },
        };

        if (payload) {
            task.httpRequest!.body = Buffer.from(JSON.stringify(payload)).toString('base64');
            task.httpRequest!.headers = {
                'Content-Type': 'application/json',
            };
        }

        if (scheduleTime) {
            task.scheduleTime = {
                seconds: scheduleTime.getTime() / 1000,
            };
        }

        if (serviceAccountEmail) {
            task.httpRequest!.oidcToken = {
                serviceAccountEmail,
                audience: url,
            };
        }

        const [response] = await this.client.createTask({
            parent,
            task,
        });

        return response;
    }
}

export { CloudTaskDispatcher }; // Para ES Modules
module.exports = { CloudTaskDispatcher }; // Para CommonJS
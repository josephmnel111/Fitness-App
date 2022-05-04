import { Scope } from '../../Model';
import { Channel } from '../channels/channel';

export class FileData {
    public id: number | null = null;
    public fileDataSenderId: number | null = null;
    public fileDataChannelId: number | null = null;
    public fileDataMessageId: number | null = null;
    public timeSent: Date | null = new Date();
    public name: string | null = null;
    public type: string | null = null;
    public data: any = null;

    constructor(
        obj?:
            | {
                  id?: number;
                  fileDataSenderId: number;
                  fileDataChannelId: number;
                  fileDataMessageId?: number;
                  timeSent?: Date;
                  name: string;
                  type: string;
                  data: any;

              }
            | FileData
    ) {
        if (obj) Object.assign(this, obj);
    }

    public static getRoomId(file: FileData): string {
        return Channel.getRoomId(file.fileDataChannelId ?? -1);
    }

    public static ensureDateType(files: FileData[]): FileData[] {
        if (!files) {
            return [];
        }

        for (let file of files) {
            if (file.timeSent && !(file.timeSent instanceof Date)) {
                file.timeSent = new Date(file.timeSent);
            }
        }

        return files;
    }
}

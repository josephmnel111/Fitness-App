import { Scope } from '../../Model';
import { Channel } from '../channels/channel';

export class Message {
    public id: number | null = null;
    public messageSenderId: number | null = null;
    public messageChannelId: number | null = null;
    public timeSent: Date | null = new Date();
    public isEdited: boolean = false;
    public isDeleted: boolean = false;
    public message: string | null = null;

    constructor(
        obj?:
            | {
                  id?: number;
                  messageSenderId: number;
                  messageChannelId: number;
                  timeSent?: Date;
                  isEdited?: boolean;
                  isDeleted?: boolean;
                  message: string;
              }
            | Message
    ) {
        if (obj) Object.assign(this, obj);
        if (obj?.timeSent) {
            this.timeSent = new Date(obj.timeSent);
        }
    }

    public static getRoomId(message: Message): string {
        return Channel.getRoomId(message.messageChannelId ?? -1);
    }

    public static ensureDateType(messages: Message[]): Message[] {
        if (!messages) {
            return [];
        }

        for (let message of messages) {
            if (message.timeSent && !(message.timeSent instanceof Date)) {
                message.timeSent = new Date(message.timeSent);
            }
        }

        return messages;
    }
}

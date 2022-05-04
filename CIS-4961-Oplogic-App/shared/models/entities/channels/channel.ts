import { Scope } from '../../Model';

export class Channel {
    public id: number | null = null;
    public isPrivate: boolean | null = null;
    public isDirectMessage: boolean | null = null;
    public name: string | null = null;
    public description: string | null = null;
    public timeCreated: Date | null = new Date();
    public isDeleted: boolean | null = null;

    constructor(
        obj?:
            | {
                  id?: number;
                  isPrivate: boolean;
                  isDirectMessage: boolean;
                  name: string;
                  description?: string;
                  timeCreated?: Date;
                  isDeleted?: boolean;
              }
            | Channel
    ) {
        if (obj) Object.assign(this, obj);
        if (obj?.timeCreated) {
            this.timeCreated = new Date(obj.timeCreated);
        }
    }

    public static getRoomId(channel: Channel | number): string {
        let scope = Scope.channel + Scope.id;

        if (typeof channel == 'number') {
            return scope + channel;
        } else {
            return scope + channel.id;
        }
    }

    public static ensureDateType(channels: Channel[]): Channel[] {
        if (!channels) {
            return [];
        }

        for (let channel of channels) {
            if (channel.timeCreated && !(channel.timeCreated instanceof Date)) {
                channel.timeCreated = new Date(channel.timeCreated);
            }
        }

        return channels;
    }
}

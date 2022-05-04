export class Notification {
    public id: number | null = null;
    public notificationUserIdSender: number | null = null;
    public notificationUserIdReceiver: number | null = null;
    public notificationChannelId: number | null = null;
    public viewed: boolean = false;
    public timeSent: Date | null = new Date();

    constructor(
        obj?:
            | {
                  id?: number;
                  notificationUserIdSender: number;
                  notificationUserIdReceiver: number;
                  notificationChannelId: number;
                  viewed: boolean;
                  timeSent?: Date;
              }
            | Notification
    ) {
        if (obj) Object.assign(this, obj);
        if (obj?.timeSent) {
            this.timeSent = new Date(obj.timeSent);
        }
    }

    public static ensureDateType(
        notifications: Notification[]
    ): Notification[] {
        if (!notifications) {
            return [];
        }

        for (let notification of notifications) {
            if (
                notification.timeSent &&
                !(notification.timeSent instanceof Date)
            ) {
                notification.timeSent = new Date(notification.timeSent);
            }
        }

        return notifications;
    }
}

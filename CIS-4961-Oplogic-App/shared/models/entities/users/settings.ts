export class Settings {
    public id: number | null = null;
    public settingsUserId: number | null = null;
    public disableAllNotifications: boolean | null = null;
    public badgeEnabled: boolean | null = null;
    public soundEnabled: boolean | null = null;
    public previewEnabled: boolean | null = null;
    public notifyOnDirectMessage: boolean | null = null;
    public notifyOnMention: boolean | null = null;
    public notifyOnEmail: boolean | null = null;
    public notifyOnSMS: boolean | null = null;

    constructor(obj?: {
        id?: number;
        settingsUserId: number;
        disableAllNotifications: boolean;
        badgeEnabled: boolean;
        soundEnabled: boolean;
        previewEnabled: boolean;
        notifyOnDirectMessage: boolean;
        notifyOnMention: boolean;
        notifyOnEmail: boolean;
        notifyOnSMS: boolean;
    } | Settings) {
        if (obj) Object.assign(this, obj);
    }
}

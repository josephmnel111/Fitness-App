import {
    Audit,
    Channel,
    Membership,
    Message,
    Reference,
    Settings,
} from '../../../shared/models/Model';

export class SQL {
    //#region Helpers

    private static columns = {
        audit: SQL.getClassFields(Audit),
        channel: SQL.getClassFields(Channel),
        membership: SQL.getClassFields(Membership),
        message: SQL.getClassFields(Message),
        reference: SQL.getClassFields(Reference),
        settings: SQL.getClassFields(Settings),
    };

    //#region

    //#region Selects

    static getUserByUserId = `SELECT * FROM user WHERE id = ?`;
    static getUsersByChannelId = `
        SELECT u.*
        FROM user u, membership m
        WHERE m.membershipUserId = u.id
        AND m.membershipChannelId = ?
    `;
    static getUsersFromMessagesAndMembershipByChannelId = `
        SELECT * FROM user
        WHERE id IN (
            SELECT DISTINCT messageSenderId 
            FROM message
            WHERE messageChannelId = ?
        )
        OR id in (
            SELECT DISTINCT membershipUserId
            FROM membership
            WHERE membershipChannelId = ?
        )    
    `;
    static getChannelAdminsByChannelId = `
        SELECT u.*
        FROM user u, membership m
        WHERE m.membershipUserId = u.id
        AND m.isChannelAdmin
        AND m.membershipChannelId = ?
    `;
    static getAllUsers = `SELECT * FROM user`;

    static getChannelsByUserId = `
        SELECT c.* 
        FROM channel c, membership m 
        WHERE m.membershipChannelId = c.id 
        AND m.membershipUserId = ?
    `;
    static getNotificationsByUserAndChannel = `SELECT * 
    FROM notification
    WHERE notificationChannelId = ?
    AND notificationUserIdReceiver = ?
    AND viewed = false`;
    static getAllChannels = `SELECT * FROM channel`;
    static getPublicChannels = `SELECT * FROM channel WHERE NOT isPrivate`;
    static getPrivateChannels = `SELECT * FROM channel WHERE isPrivate`;

    static getAllCustomers = `SELECT * FROM customer`;
    static getCustomerById = `SELECT * FROM customer WHERE pkindex = ?`;

    static getAllReferences = `SELECT * FROM reference`;
    static getReferencesByCustomerId = `SELECT * FROM reference WHERE referenceCustomerId = ?`;
    static getReferencesByChannelId = `SELECT * FROM reference WHERE referenceChannelId = ?`;

    static getSettingsByUserId = `SELECT * FROM settings WHERE settingsUserId = ?`;

    static getMessagesByUserId = `SELECT * FROM message WHERE messageSenderId = ?`;
    static getMessagesByChannelId = `SELECT * FROM message WHERE messageChannelId = ?`;
    static getAllMessages = `SELECT * FROM message`;

    static getFilesByChannelId = `SELECT * FROM filedata WHERE fileDataChannelId = ?`;

    static getAuditsByChannelId = `SELECT auditMessageId, oldValue, newValue, changeDate FROM message, audit WHERE auditMessageId = message.id AND messageChannelId = ? ORDER BY auditMessageId ASC, changeDate DESC`;

    static getMembershipByChannelAndUserId = `
        SELECT * FROM membership 
        WHERE membershipUserId = :membershipUserId
        AND membershipChannelId = :membershipChannelId
    ` 
    //#endregion

    //#region Inserts

    static createMessage = `
        INSERT INTO message (messageSenderId, messageChannelId, timeSent, isEdited, isDeleted, message)
        VALUES (:messageSenderId, :messageChannelId, :timeSent, :isEdited, :isDeleted, :message)
    `;

    static createFileData = `
        INSERT INTO filedata (fileDataSenderId, fileDataChannelId, fileDataMessageId, timeSent, name, type, data)
        VALUES (:fileDataSenderId, :fileDataChannelId, :fileDataMessageId, :timeSent, :name, :type, :data)
    `;

    static createNotification = `INSERT INTO notification (notificationUserIdSender, notificationUserIdReceiver, notificationChannelId, viewed, timeSent)
    VALUES (:notificationUserIdSender, :notificationUserIdReceiver, :notificationChannelId, :viewed, :timeSent)`;

    static createAudit = `
        INSERT INTO audit (auditMessageId, auditChangedById, oldValue, newValue, changeDate)
        VALUES (:auditMessageId, :auditChangedById, :oldValue, :newValue, :changeDate)
    `;

    static createChannel = `
        INSERT INTO channel (isPrivate, isDirectMessage, name, timeCreated)
        VALUES (:isPrivate, :isDirectMessage, :name, :timeCreated)
    `;

    static createMembership = `
        INSERT INTO membership (isChannelAdmin, membershipChannelId, membershipUserId)
        VALUES (:isChannelAdmin, :membershipChannelId, :membershipUserId)
    `;

    static createUser = `
        INSERT INTO user (displayName, fullName, email, phoneNumber, isSystemAdmin)
        VALUES (:displayName, :fullName, :email, :phoneNumber, :isSystemAdmin)
    `;

    static createSettings = `
        INSERT INTO settings (settingsUserId, disableAllNotifications, badgeEnabled, soundEnabled, previewEnabled, notifyOnDirectMessage, notifyOnMention, notifyOnEmail, notifyOnSMS)
        VALUES (:settingsUserId, :disableAllNotifications, :badgeEnabled, :soundEnabled, :previewEnabled, :notifyOnDirectMessage, :notifyOnMention, :notifyOnEmail, :notifyOnSMS)
    `;

    static createCustomerReference = `
        INSERT INTO reference (referenceCustomerId, referenceChannelId, firstName, lastName, address, phoneNumber, email, make, model, timeSent) 
        VALUES ?
    `;

    static createUserSettings = `
        INSERT INTO settings (settingsUserId, disableAllNotifications, badgeEnabled, soundEnabled, previewEnabled, notifyOnDirectMessage, notifyOnMention, notifyOnEmail, notifyOnSMS)
        VALUES (:settingsUserId, :disableAllNotifications, :badgeEnabled, :soundEnabled, :previewEnabled, :notifyOnDirectMessage, :notifyOnMention, :notifyOnEmail, :notifyOnSMS)
    `;

    //#endregion

    //#region Updates

    static updateViewedNotifications = `UPDATE notification SET viewed = true WHERE notificationChannelId = ? AND notificationUserIdReceiver = ?`;

    static updateMessageEdit = `UPDATE message SET isEdited = true WHERE id = ?`;

    static updateMessageDelete = `UPDATE message SET isDeleted = true WHERE id = ?`;

    static updateMembership = `
        UPDATE membership SET
        isChannelAdmin = :isChannelAdmin
        WHERE membershipUserId = :membershipUserId
    `;

    static updateUserSettingsBySettingsId = `
        UPDATE settings SET 
        disableAllNotifications = :disableAllNotifications, 
        badgeEnabled = :badgeEnabled, 
        soundEnabled = :soundEnabled, 
        previewEnabled = :previewEnabled, 
        notifyOnDirectMessage = :notifyOnDirectMessage, 
        notifyOnMention = :notifyOnMention, 
        notifyOnEmail = :notifyOnEmail, 
        notifyOnSMS = :notifyOnSMS 
        WHERE id = :id
    `;

    static updateUserSettingsByUserId = `
        UPDATE settings SET 
        disableAllNotifications = :disableAllNotifications, 
        badgeEnabled = :badgeEnabled, 
        soundEnabled = :soundEnabled, 
        previewEnabled = :previewEnabled, 
        notifyOnDirectMessage = :notifyOnDirectMessage, 
        notifyOnMention = :notifyOnMention, 
        notifyOnEmail = :notifyOnEmail, 
        notifyOnSMS = :notifyOnSMS 
        WHERE settingsUserId = :settingsUserId
    `;

    //#endregion

    //#region Deletes

    static deleteMembership = `
        DELETE FROM membership 
        WHERE membershipChannelId = :membershipChannelId
        AND membershipUserId = :membershipUserId
    `;

    // We'll use a transaction for this since it's a multi-step operation:
    // 1) Remove all user memberships to the channel
    // 2) Remove the channel itself
    static deleteChannel = `
        SET autocommit = 0;
        START TRANSACTION;
            DELETE FROM membership
            WHERE membershipChannelId = :channelId;

            UPDATE channel
            SET isDeleted = true
            WHERE id = :channelId;
        COMMIT;
    `;

    //#endregion

    //#region Methods

    static convertToSQLDate<T extends Object>(obj: T): T {
        let dateKey = Object.keys(obj).find((k) => {
            let p = k.toLowerCase();
            return p.includes('date') || p.includes('time');
        });

        if (!dateKey) {
            return obj;
        }

        let s = obj as any;
        s[dateKey] = s[dateKey].slice(0, 19).replace('T', ' ');
        return s;
    }

    private static getClassFields<T extends object>(
        $class: new () => T
    ): string[] {
        let obj = new $class();
        return Object.keys(obj);
    }

    private static filterPK(
        fields?: string[],
        $class?: new () => any
    ): string[] {
        let arr!: string[];
        if ($class) {
            arr = this.getClassFields($class);
        } else if (fields) {
            arr = fields;
        }

        return arr.filter((k) => k != 'id');
    }

    //#endregion
}

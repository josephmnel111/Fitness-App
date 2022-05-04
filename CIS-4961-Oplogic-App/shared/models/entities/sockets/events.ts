import { Scope } from './enums/scope';

export const Events = {
    loginUser: Scope.me + Scope.user + 'login-user',
    updateCurrentUser: Scope.me + Scope.user + 'update-current-user',
    updateCurrentChannel: Scope.me + Scope.channel + 'update-current-channel',

    identifyClient: Scope.info + 'user-id',
    identifyServer: Scope.info + 'server-name',

    connectionsUpdate: Scope.info + 'connections',

    sendMessage: Scope.message + 'send-message',
    receiveMessage: Scope.message + 'receive-message',

    sendFile: Scope.file + 'send-file',
    receiveFile: Scope.file + 'receive-file',

    clearNotifications: Scope.message + 'clear-notifications',
    sendNotification: Scope.message + 'send-notification',
    retreiveNotifications: Scope.message + 'retreive-notifications',
    receiveNotification: Scope.message + 'receive-notification',

    editMessage: Scope.message + 'edit-message',
    receiveEdit: Scope.message + 'receive-edit',

    deleteMessage: Scope.message + 'delete-message',
    receiveDelete: Scope.message + 'receive-delete',

    requestChannelMessages: Scope.channel + 'request-messages',
    receiveChannelMessages: Scope.channel + 'receive-messages',

    requestChannelUsers: Scope.channel + Scope.user + 'request-users',
    receiveChannelUsers: Scope.channel + Scope.user + 'receive-users',

    requestChannelUsersByMessages:
        Scope.channel + Scope.user + 'request-users-by-messages',
    receiveChannelUsersByMessages:
        Scope.channel + Scope.user + 'receive-users-by-messages',

    requestChannelAdmins: Scope.channel + Scope.user + 'request-admins',
    receiveChannelAdmins: Scope.channel + Scope.user + 'receive-admins',

    requestAllUsers: Scope.user + 'request-all-users',
    receiveAllUsers: Scope.user + 'receive-all-users',

    requestAutoTag: Scope.channel + Scope.user + 'request-auto-tag',
    receiveAutoTag: Scope.channel + Scope.user + 'receive-auto-tag',

    requestColorTags: Scope.channel + Scope.user + 'request-color-tags',
    receiveColorTags: Scope.channel + Scope.user + 'receive-color-tags',

    createChannel: Scope.channel + 'create-channel',
    channelCreated: Scope.channel + 'channel-created',

    deleteChannel: Scope.channel + 'delete-channel',
    channelDeleted: Scope.channel + 'channel-deleted',

    requestMyChannels: Scope.me + Scope.channel + 'request-channels',
    receiveMyChannels: Scope.me + Scope.channel + 'receive-channels',

    requestMyMemberships: Scope.me + Scope.membership + 'request-memberships',
    receiveMyMemberships: Scope.me + Scope.membership + 'receive-memberships',

    createMembership: Scope.membership + 'create-membership',
    membershipCreated: Scope.membership + 'membership-created',

    deleteMembership: Scope.membership + 'delete-membership',
    membershipDeleted: Scope.membership + 'membership-deleted',

    requestAllCustomerProfiles: Scope.customer + 'request-profiles',
    receiveAllCustomerProfiles: Scope.customer + 'receive-profiles',

    requestChannelReferences:
        Scope.customer + Scope.channel + 'send-references',
    receiveChannelReferences:
        Scope.customer + Scope.channel + 'receive-references',

    sendReference: Scope.customer + Scope.message + 'send-raw-reference',
    receiveReference: Scope.customer + Scope.message + 'receive-raw-reference',

    sendReferences: Scope.customer + Scope.message + 'send-raw-references',
    receiveReferences:
        Scope.customer + Scope.message + 'receive-raw-references',

    requestMySettings: Scope.me + Scope.settings + 'request-settings',
    receiveMySettings: Scope.me + Scope.settings + 'receive-settings',

    updateSettings: Scope.settings + 'update-settings',
    settingsUpdated: Scope.settings + 'settings-updated',
};

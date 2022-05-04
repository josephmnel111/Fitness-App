import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, merge, Subject, zip } from 'rxjs';
import {
    Audit,
    Channel,
    Customer,
    Message,
    Reference,
    User,
    Events,
    Membership,
    FileData,
    Settings,
} from 'src/../../shared/models/Model';
import { Socket } from 'ngx-socket-io';
import { SessionService } from '../sessionService/session.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    //#region Socket initialization

    public currentUser!: User;
    public currentUserSettings!: Settings;

    public currentChannel!: Channel;
    public currentChannelUpdates: Subject<Channel> = new Subject<Channel>();

    public myChannels: Channel[] = [];
    public publicChannels: Channel[] = [];
    public allUsers: User[] = [];

    public channelUsers: Map<number, User[]> = new Map();
    public channelAdmins: Map<number, User[]> = new Map();
    public channelMessages: Map<number, Message[]> = new Map();
    public channelReferences: Map<number, Reference[]> = new Map();
    public channelUsersFromMessages: Map<number, User[]> = new Map();

    public serverName = this.socket.fromEvent<string>(Events.identifyServer);

    constructor(private socket: Socket, private session: SessionService) {
        this.socket.on('connect', () => {
            // If the client dropped their connection but was logged in,
            // have them keep their login details
            if (
                this.currentUser != undefined &&
                this.currentUser.id != undefined
            ) {
                this.socket.emit(Events.identifyClient, this.currentUser.id);
                this.requestMyChannels();
                this.requestMySettings();
                this.requestMessagesInChannel(this.currentChannel);
            }
        });

        //#region Login

        this.userUpdated.subscribe((user) => {
            this.currentUser = user;
            this.session.currentUser = user;
            this.requestMyChannels();
            this.requestMySettings();
        });

        //#endregion

        //#region Channels

        this.currentChannelUpdates
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe((channel) => {
                this.currentChannel = channel;
                this.session.currentChannel = channel;

                this.updateCurrentChannel(channel);
                this.requestAllChannelInfo(channel);
            });

        this.receiveMyChannels.subscribe((channels) => {
            this.myChannels = channels;
            this.session.myChannels = channels;

            for (const c of channels) {
                this.requestAllUsersInChannel(c);
            }
        });

        this.channelCreated.subscribe((channel) => {
            this.requestAllUsersInChannel(channel);
            this.myChannels.push(channel);
            if (!channel.isPrivate) {
                this.publicChannels.push(channel);
            }
        });

        //#endregion

        //#region Memberships

        this.userAddedToChannel.subscribe((m) => {
            this.requestMyChannels();
            this.socket
                .fromOneTimeEvent<[Channel, User[]]>(Events.receiveChannelUsers)
                .then(([channel, users]) => {
                    if (m.membershipChannelId && m.membershipUserId) {
                        let user = users.find(
                            (u) => u.id == m.membershipUserId
                        );

                        if (user) {
                            let channelFound = this.myChannels.find(
                                (c) => c.id == m.membershipChannelId
                            );

                            if (
                                !channelFound &&
                                user.id == this.currentUser.id
                            ) {
                                this.myChannels.push(channel);
                            }

                            let channelUsers = this.channelUsers.get(
                                m.membershipChannelId
                            );

                            if (channelUsers) {
                                channelUsers.push(user);
                                this.channelUsers.set(
                                    m.membershipChannelId,
                                    channelUsers
                                );
                            }
                        }

                        this.requestAllUsersInChannel(channel);
                    }
                });
        });

        this.userRemovedFromChannel.subscribe((m) => {
            this.requestMyChannels();
            this.socket
                .fromOneTimeEvent<[Channel, User[]]>(Events.receiveChannelUsers)
                .then(([channel, users]) => {
                    if (m.membershipChannelId) {
                        let user = users.find(
                            (u) => u.id == m.membershipUserId
                        );

                        if (user) {
                            if (user.id == this.currentUser.id) {
                                this.myChannels = this.myChannels.filter(
                                    (c) => c.id != m.membershipChannelId
                                );

                                let nextChannel = this.myChannels.find(
                                    (c) => true
                                );

                                if (nextChannel) {
                                    this.currentChannelUpdates.next(
                                        nextChannel
                                    );
                                }
                            }

                            let channelUsers = this.channelUsers
                                .get(m.membershipChannelId)
                                ?.filter((u) => u.id != user?.id);

                            if (channelUsers) {
                                this.channelUsers.set(
                                    m.membershipChannelId,
                                    channelUsers
                                );
                            }
                        }
                    }
                });
        });

        //#endregion

        //#region Messages

        this.receiveMessagesInChannel.subscribe(([channel, messages]) => {
            if (channel.id)
                this.channelMessages.set(
                    channel.id,
                    messages.map((m) => new Message(m))
                );
        });

        //#endregion

        //#region Users

        this.receiveAllUsers.subscribe((users) => {
            this.session.publicUsers = users;
            this.allUsers = users;
        });

        this.receiveUsersInChannel.subscribe(([channel, users]) => {
            if (channel.id) this.channelUsers.set(channel.id, users);
        });

        this.receiveAdminsInChannel.subscribe(([channel, users]) => {
            console.log(
                `Channel ${channel.id} admins: ${users
                    .map((u) => u.fullName)
                    .join(', ')}`
            );
            if (channel.id) this.channelAdmins.set(channel.id, users);
        });

        this.receiveUsersInChannelByMessages.subscribe(([channel, users]) => {
            if (channel.id)
                this.channelUsersFromMessages.set(channel.id, users);
        });

        //#endregion

        //#region References

        let s = this.receiveReferencesInChannel.subscribe(
            ([channel, references]) => {
                if (channel.id)
                    this.channelReferences.set(channel.id, references);
            }
        );

        //#endregion

        //#region Settings

        this.receiveSettings.subscribe((settings) => {
            this.currentUserSettings = settings;
        });

        //#endregion

        //#region Combined Functions

        //#endregion
    }

    //#endregion

    //#region Login

    public loginUser(userId: number) {
        this.socket.emit(Events.loginUser, userId);
    }

    public userUpdated = this.socket.fromEvent<User>(Events.updateCurrentUser);

    //#endregion

    //#region Customers

    public requestAllCustomerProfiles() {
        this.socket.emit(Events.requestAllCustomerProfiles);
    }

    public receiveAllCustomerProfiles = this.socket.fromEvent<Customer[]>(
        Events.receiveAllCustomerProfiles
    );

    public sendCustomerReference(channel: Channel, customer: Customer) {
        let reference = new Reference().fromCustomer(
            channel.id ?? -1,
            customer
        );

        this.socket.emit(Events.sendReference, reference);
    }

    public sendCustomerReferences(channel: Channel, customers: Customer[]) {
        let references: Reference[] = [];
        for (const customer of customers) {
            references.push(
                new Reference().fromCustomer(channel.id ?? -1, customer)
            );
        }

        this.socket.emit(Events.sendReferences, channel, references);
    }

    //#endregion

    //#region Channels

    public updateCurrentChannel(channel: Channel) {
        this.socket.emit(Events.updateCurrentChannel, channel);
    }

    public createChannel(channel: Channel) {
        this.socket.emit(Events.createChannel, channel);
    }

    public channelCreated = this.socket.fromEvent<Channel>(
        Events.channelCreated
    );

    public requestMyChannels() {
        this.socket.emit(Events.requestMyChannels);
    }

    public receiveMyChannels = this.socket.fromEvent<Channel[]>(
        Events.receiveMyChannels
    );

    //#endregion

    //#region Memberships

    public addUserToChannel(channel: Channel, user: User, isAdmin?: boolean) {
        if (channel.id && user.id) {
            let membership = new Membership({
                isChannelAdmin: isAdmin ?? false,
                membershipChannelId: channel.id,
                membershipUserId: user.id,
            });

            this.socket.emit(Events.createMembership, membership);
        }
    }

    public userAddedToChannel = this.socket.fromEvent<Membership>(
        Events.membershipCreated
    );

    public removeUserFromChannel(channel: Channel, user: User) {
        if (channel.id && user.id) {
            let membership = new Membership();
            membership.membershipChannelId = channel.id;
            membership.membershipUserId = user.id;

            this.socket.emit(Events.deleteMembership, membership);
        }
    }

    public userRemovedFromChannel = this.socket.fromEvent<Membership>(
        Events.membershipDeleted
    );

    //#endregion

    //#region Messages

    public editMessage(originalMessage: Message, auditedMessage: Audit) {
        this.socket.emit(Events.editMessage, originalMessage, auditedMessage);
    }

    public receiveEdit = this.socket.fromEvent<Audit>(Events.receiveEdit);

    public deleteMessage(originalMessage: Message, auditedMessage: Audit) {
        this.socket.emit(Events.deleteMessage, originalMessage, auditedMessage);
    }

    public receiveDelete = this.socket.fromEvent<Audit>(Events.receiveDelete);

    public clearNotifsChannelUser(channel: Channel, user: User) {
        this.socket.emit(Events.clearNotifications, channel, user);
    }

    public sendNotification(tags: User[], channel: Channel, curUser: User) {
        this.socket.emit(Events.sendNotification, tags, channel, curUser);
    }

    public retreiveNotifications(channel: Channel, user: User) {
        this.socket.emit(Events.retreiveNotifications, channel, user);
    }

    public receiveNotification = this.socket.fromEvent<
        [Notification[], Channel]
    >(Events.receiveNotification);

    public sendMessage(message: Message, files: FileData[]) {
        this.socket.emit(Events.sendMessage, message, files);
    }

    public receiveMessage = this.socket.fromEvent<[Message, FileData[]]>(
        Events.receiveMessage
    );

    public requestMessagesInChannel(channel: Channel) {
        this.socket.emit(Events.requestChannelMessages, channel);
    }

    public receiveMessagesInChannel = this.socket.fromEvent<
        [Channel, Message[], FileData[]]
    >(Events.receiveChannelMessages);

    //#endregion

    //#region References

    public requestReferencesInChannel(channel: Channel) {
        this.socket.emit(Events.requestChannelReferences, channel);
    }

    public receiveReferencesInChannel = this.socket.fromEvent<
        [Channel, Reference[]]
    >(Events.receiveChannelReferences);

    public sendReference(reference: Reference) {
        this.socket.emit(Events.sendReference, reference);
    }

    public receiveReference = this.socket.fromEvent<Reference>(
        Events.receiveReference
    );

    public sendReferences(references: Reference[]) {
        this.socket.emit(
            Events.sendReferences,
            this.currentChannel,
            references
        );
    }

    public receiveReferences = this.socket.fromEvent<Reference[]>(
        Events.receiveReferences
    );

    //#endregion

    //#region Settings

    public updateSettings(settings: Settings) {
        this.socket.emit(Events.updateSettings, settings);
    }

    public settingsUpdated = this.socket.fromEvent<Settings>(
        Events.settingsUpdated
    );

    public requestMySettings() {
        this.socket.emit(Events.requestMySettings);
    }

    public receiveMySettings = this.socket.fromEvent<Settings>(
        Events.receiveMySettings
    );

    //#endregion

    //#region Tags
    public requestAutoTag(channel: Channel) {
        this.socket.emit(Events.requestAutoTag, channel);
    }

    public receiveAutoTag = this.socket.fromEvent<[Channel, User[]]>(
        Events.receiveAutoTag
    );

    public requestColorTags(channel: Channel) {
        this.socket.emit(Events.requestColorTags, channel);
    }

    public receiveColorTags = this.socket.fromEvent<[Channel, User[]]>(
        Events.receiveColorTags
    );
    //#endregion

    //#region Users

    public requestUsersInChannel(channel: Channel) {
        this.socket.emit(Events.requestChannelUsers, channel);
    }

    public receiveUsersInChannel = this.socket.fromEvent<[Channel, User[]]>(
        Events.receiveChannelUsers
    );

    public requestAdminsInChannel(channel: Channel) {
        this.socket.emit(Events.requestChannelAdmins, channel);
    }

    public receiveAdminsInChannel = this.socket.fromEvent<[Channel, User[]]>(
        Events.receiveChannelAdmins
    );

    public requestUsersInChannelByMessages(channel: Channel) {
        this.socket.emit(Events.requestChannelUsersByMessages, channel);
    }

    public receiveUsersInChannelByMessages = this.socket.fromEvent<
        [Channel, User[]]
    >(Events.receiveChannelUsersByMessages);

    //#endregion

    //#region Combined Functions

    public requestAllChannelInfo(channel: Channel) {
        this.requestAllUsersInChannel(channel);
        this.requestAllMessagesAndReferencesInChannel(channel);
    }

    public requestAllUsersInChannel(channel: Channel) {
        this.requestUsersInChannel(channel);
        this.requestAdminsInChannel(channel);
        this.requestUsersInChannelByMessages(channel);
    }

    public requestAllMessagesAndReferencesInChannel(channel: Channel) {
        this.requestMessagesInChannel(channel);
        this.requestReferencesInChannel(channel);
    }

    public receiveMessagesAndReferencesInChannel = zip(
        this.receiveMessagesInChannel,
        this.receiveReferencesInChannel
    );

    public receiveMessageOrReference = merge(
        this.receiveMessage,
        this.receiveReference
    );

    public receiveSettings = merge(
        this.receiveMySettings,
        this.settingsUpdated
    );

    //#endregion

    //#region // TODO: FOR DEBUGGING USE

    public requestAllUsers() {
        this.socket.emit(Events.requestAllUsers);
    }

    public receiveAllUsers = this.socket.fromEvent<User[]>(
        Events.receiveAllUsers
    );

    //#endregion
}

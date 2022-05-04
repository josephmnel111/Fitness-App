import { Component, Input, OnInit, Output } from '@angular/core';
import {
    Channel,
    Message,
    Reference,
    User,
    FileData,
} from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';
// import { EventEmitter } from 'stream';

@Component({
    selector: 'conversation',
    templateUrl: './conversations.component.html',
    styleUrls: ['./conversations.component.css'],
})
export class ConversationsComponent implements OnInit {
    @Input() public channel!: Channel;

    @Output() public senders?: User[];
    @Output() public unreadMessages: boolean = false;
    @Output() showBadge: boolean = true;
    @Output() showDM: boolean = true;

    public notifications = 0;

    @Output()
    public get senderNames(): string {
        return this.senders?.map((s) => s.fullName).join(', ') ?? '';
    }

    constructor(public socket: SocketService) {}

    ngOnInit(): void {
        this.socket.receiveSettings.subscribe((settings) => {
            if (settings) {
                this.showBadge = settings.badgeEnabled ?? true;
                this.showDM = settings.notifyOnDirectMessage ?? true;
            }
        });

        this.socket.receiveNotification.subscribe(
            async ([notifications, channel]) => {
                if (this.socket.currentChannel == undefined) {
                    if (channel.id == this.channel.id) {
                        this.notifications = notifications.length;
                        if (notifications.length) this.unreadMessages = true;
                    }
                } else {
                    if (channel.id == this.channel.id) {
                        if (this.socket.currentChannel.id == channel.id) {
                            this.notifications = 0;
                            this.socket.clearNotifsChannelUser(
                                this.channel,
                                this.socket.currentUser
                            );
                        } else {
                            this.notifications = notifications.length;
                            if (notifications.length)
                                this.unreadMessages = true;
                        }
                    }
                }
            }
        );

        this.socket.retreiveNotifications(
            this.channel,
            this.socket.currentUser
        );
        this.syncChannelInfo(this.channel);

        this.socket.receiveUsersInChannelByMessages.subscribe(
            ([channel, users]) => {
                if (channel.id == this.channel.id) {
                    this.syncChannelInfo(channel);
                }
            }
        );

        let s = this.socket.receiveUsersInChannel.subscribe(
            ([channel, users]) => {
                if (channel.id == this.channel.id) {
                    this.syncChannelInfo(channel);
                }
            }
        );

        this.socket.receiveMessageOrReference.subscribe((any) => {
            let targetChannelId =
                (any as [Message, FileData[]])?.[0]?.messageChannelId ??
                (any as Reference).referenceChannelId;

            if (targetChannelId && targetChannelId == this.channel.id) {
                let curChannelId = this.socket.currentChannel?.id;

                if (!curChannelId || curChannelId != targetChannelId) {
                    this.unreadMessages = true;
                }
            }
        });

        this.socket.currentChannelUpdates.subscribe((channel) => {
            if (this.channel && channel.id == this.channel.id) {
                this.unreadMessages = false;
            }
        });
    }

    syncChannelInfo(channel: Channel) {
        if (channel.id) {
            let users = this.socket.channelUsers
                .get(channel.id)
                ?.filter((u) => u.id != this.socket.currentUser.id);

            if (users) {
                this.senders = users;
                return true;
            }
        }

        return false;
    }

    updateCurrentChannel() {
        this.socket.currentChannelUpdates.next(this.channel);
        this.socket.clearNotifsChannelUser(
            this.channel,
            this.socket.currentUser
        );
        this.notifications = 0;

        this.syncChannelInfo(this.channel);
    }
}

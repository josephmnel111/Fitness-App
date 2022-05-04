import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
    Channel,
    Message,
    Reference,
    FileData,
} from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';

@Component({
    selector: 'channel',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    @Input() channel!: Channel;

    @Output() channelClick: EventEmitter<string> = new EventEmitter();
    @Output() unreadMessages: boolean = false;
    @Output() showBadge: boolean = true;
    @Output() showDM: boolean = true;

    public notifications = 0;

    constructor(public socket: SocketService) {}

    ngOnInit() {
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
                    // && (this.socket.curChannel.id != channel.id)
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

    updateCurrentChannel() {
        this.socket.currentChannelUpdates.next(this.channel);
        this.socket.clearNotifsChannelUser(
            this.channel,
            this.socket.currentUser
        );
        this.notifications = 0;
    }
}

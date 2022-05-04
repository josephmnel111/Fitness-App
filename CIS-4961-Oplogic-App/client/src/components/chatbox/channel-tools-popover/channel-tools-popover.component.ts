import { Component, OnInit, Output } from '@angular/core';
import {
    CheckboxChangeEventDetail,
    CheckboxCustomEvent,
    InputCustomEvent,
} from '@ionic/angular';
import { SocketService } from 'src/services/socketService/socket.service';
import { User } from 'src/../../shared/models/Model';

@Component({
    selector: 'app-channel-tools-popover',
    templateUrl: './channel-tools-popover.component.html',
    styleUrls: ['./channel-tools-popover.component.css'],
})
export class ChannelToolsPopoverComponent implements OnInit {
    @Output()
    private allUsers: User[] = [];

    @Output()
    public filteredUsers: User[] = [];

    private isUserInteraction = false;

    constructor(public socket: SocketService) {}

    ngOnInit(): void {
        this.allUsers = this.socket.allUsers;
        this.filteredUsers = this.allUsers;
    }

    public search(e: Event) {
        const event = e as InputCustomEvent;
        let text = event.detail.value;

        if (text && text.length > 0) {
            const name = text.trim().toLowerCase();
            this.filteredUsers = this.allUsers.filter((u) =>
                u.fullName?.toLowerCase()?.includes(name)
            );
        } else {
            this.filteredUsers = this.allUsers;
        }
    }

    public userIsInChannel(user: User) {
        const currChannelId = this.socket.currentChannel?.id;

        if (currChannelId) {
            const channelUsers: User[] | undefined =
                this.socket.channelUsers.get(currChannelId);

            if (channelUsers) {
                return channelUsers.find((u) => u.id == user.id) != undefined;
            }
        }

        return false;
    }

    public currentUserIsChannelModerator() {
        let currentChannel = this.socket.currentChannel;
        let currentUser = this.socket.currentUser;

        if (
            currentUser &&
            currentChannel &&
            currentUser.id &&
            currentChannel.id
        ) {
            return this.isUserModerator(currentUser);
        }

        return false;
    }

    public isUserModerator(user: User) {
        let currentChannel = this.socket.currentChannel;

        if (user && currentChannel && user.id && currentChannel.id) {
            let admin = this.socket.channelAdmins
                .get(currentChannel.id)
                ?.find((u) => u.id == user.id);

            if (admin || user.isSystemAdmin) return true;
        }

        return false;
    }

    public isCurrentUser(user: User) {
        return (
            user &&
            this.socket.currentUser &&
            this.socket.currentUser.id == user.id
        );
    }

    public setUserInteraction() {
        this.isUserInteraction = true;
    }

    public memberSelectionChanged(e: Event) {
        const event = e as CheckboxCustomEvent;
        if (this.isUserInteraction) {
            const detail = event.detail;

            const currChannel = this.socket.currentChannel;
            const user = detail.value;

            if (detail.checked) {
                this.socket.addUserToChannel(currChannel, user);
            } else {
                this.socket.removeUserFromChannel(currChannel, user);
            }
        }

        this.isUserInteraction = false;
    }

    public moderatorSelectionChanged(e: Event) {
        const event = e as CheckboxCustomEvent;
        if (this.isUserInteraction) {
            const detail = event.detail;

            const currChannel = this.socket.currentChannel;
            const user = detail.value;

            if (detail.checked) {
                this.socket.addUserToChannel(currChannel, user, true);
            } else {
                this.socket.addUserToChannel(currChannel, user);
            }
        }

        this.isUserInteraction = false;
    }

    public leaveChannel() {
        if (
            this.socket.currentChannel &&
            this.socket.currentUser &&
            this.socket.currentChannel.id &&
            this.socket.currentUser
        ) {
            this.socket.removeUserFromChannel(
                this.socket.currentChannel,
                this.socket.currentUser
            );
        }
    }
}

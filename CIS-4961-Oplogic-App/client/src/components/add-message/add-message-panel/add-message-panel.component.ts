import { Component, OnInit, Output } from '@angular/core';
import { CheckboxCustomEvent, InputCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SocketService } from 'src/services/socketService/socket.service';
import { Channel, User } from '../../../../../shared/models/Model';

@Component({
    selector: 'app-add-message-panel',
    templateUrl: './add-message-panel.component.html',
    styleUrls: ['./add-message-panel.component.css'],
})
export class AddMessagePanelComponent implements OnInit {
    @Output()
    private allUsers: User[] = [];

    @Output()
    public filteredUsers: User[] = [];

    private selectedUsers: User[] = [];

    constructor(
        private socket: SocketService,
        private modalController: ModalController
    ) {}

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

    public selectionChanged(e: Event) {
        const event = e as CheckboxCustomEvent;
        let user: User = event.detail.value;

        if (event.detail.checked) {
            this.selectedUsers.push(user);
        } else {
            this.selectedUsers = this.selectedUsers.filter(
                (u) => u.id != user.id
            );
        }
    }

    onCancel() {
        this.modalController.dismiss({
            dismissed: true,
        });
    }

    onSave() {
        let channelName =
            this.socket.currentUser.displayName +
            this.selectedUsers.map((u) => u.displayName).join('');

        let newChannel = new Channel({
            isDirectMessage: true,
            isPrivate: true,
            name: channelName,
        });

        this.socket.createChannel(newChannel);
        let s = this.socket.channelCreated.subscribe((channel) => {
            if (
                channel.name == newChannel.name &&
                channel.isDirectMessage == newChannel.isDirectMessage &&
                channel.isPrivate == newChannel.isPrivate
            ) {
                for (const user of this.selectedUsers) {
                    this.socket.addUserToChannel(channel, user, true);
                }

                s.unsubscribe();
            }
        });

        this.modalController.dismiss({
            dismissed: true,
        });
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SocketService } from 'src/services/socketService/socket.service';
import { Message } from '../../../../../shared/models/Model';
import { PopoverActions } from '../messages/messages.component';

@Component({
    selector: 'app-msg-popover',
    templateUrl: './msg-popover.component.html',
    styleUrls: ['./msg-popover.component.css'],
})
export class MsgPopoverComponent implements OnInit {
    //Action to be returned from clicking on this popover's list items
    //PopoverActions enum defined in messages.component
    private action: PopoverActions | undefined;

    @Input()
    private message!: Message;

    constructor(
        public popoverController: PopoverController,
        private socket: SocketService
    ) {}

    ngOnInit(): void {}

    /** Signals to edit parent message element*/
    startEdit() {
        this.action = PopoverActions.edit; //Set action to be retured as edit from the PopoverActions enum
        this.close(this.action);
    }

    /** Signals to delete parent message element*/
    deleteMsg() {
        this.action = PopoverActions.delete;
        this.close(this.action);
    }

    isMyMessage(): boolean {
        if (
            this.socket.currentUser &&
            this.socket.currentUser.id &&
            this.message &&
            this.message.messageSenderId &&
            this.socket.currentUser.id == this.message.messageSenderId
        ) {
            return true;
        }

        return false;
    }

    /** Dismisses modal and returns an enum for action to take.
     * @param {PopoverActions} passbackData - Enum for action to take
     */
    close(passbackData: PopoverActions) {
        this.popoverController.dismiss(passbackData);
    }
}

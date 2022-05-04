import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    Output,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Message, Audit } from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';
import { MsgPopoverComponent } from '../msg-popover/msg-popover.component';

// Actions that can be taken from the Popover
// Primary uses in current component and msg-popover.component
export enum PopoverActions {
    edit,
    delete,
}

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
    @ViewChild('messageContent')
    public messageContent!: ElementRef<HTMLDivElement>;

    @ViewChild('editedMsg', { static: false }) //reference to textarea with id #editedMsg
    public editMsgTextArea!: ElementRef; //Used to resize and focus on start of edit

    public isEditing: boolean = false; //flag for if message is currently being edited

    @Input() public message!: Message;
    @Input() public senderName!: string;

    public colorDisplayed = false;

    public dateSent!: string;

    constructor(
        public popoverController: PopoverController,
        public socket: SocketService
    ) {}

    ngOnInit(): void {
        this.socket.receiveEdit.subscribe(async (audit) => {
            if (this.message.id == audit.auditMessageId) {
                this.message.message = audit.newValue;
                this.message.isEdited = true;
            }
        });
        this.socket.receiveDelete.subscribe(async (audit) => {
            if (this.message.id == audit.auditMessageId) {
                this.message.isDeleted = true;
            }
        });

        this.syncMessageInfo(this.message);

        let s = this.socket.receiveUsersInChannelByMessages.subscribe(
            ([channel, users]) => {
                if (channel.id == this.message.messageChannelId) {
                    if (this.syncMessageInfo(this.message)) {
                        s.unsubscribe();
                    }
                }
            }
        );
    }

    ngAfterViewInit(): void {
        this.socket.requestColorTags(this.socket.currentChannel);

        let t = this.socket.receiveColorTags.subscribe(
            async ([channel, user]) => {
                if (
                    channel &&
                    this.message &&
                    channel.id == this.message.messageChannelId &&
                    this.colorDisplayed == false
                ) {
                    if (
                        this.messageContent &&
                        this.messageContent.nativeElement
                    ) {
                        let content =
                            this.messageContent.nativeElement.innerHTML;
                        const regex = /@[\w+.-]+[^&]/g;
                        const matches = content.matchAll(regex);

                        if (matches) {
                            for (const match of matches) {
                                if (match) {
                                    // console.log(match);

                                    let tagVal = `<mark style="background: none; color: cornflowerblue">${match.toString()}</mark>`;
                                    this.messageContent.nativeElement.innerHTML =
                                        content.replace(
                                            match.toString(),
                                            tagVal
                                        )
                                        ;
                                    // console.log(this.messageContent);
                                }
                            }
                        }

                        t.unsubscribe();
                        this.colorDisplayed = true;
                    }
                }
            }
        );
    }

    syncMessageInfo(message: Message): boolean {
        if (this.message.messageChannelId && !this.senderName) {
            let user = this.socket.channelUsersFromMessages
                .get(this.message.messageChannelId)
                ?.find((u) => u.id == this.message.messageSenderId);

            if (user) {
                this.senderName = user.fullName ?? '';
                return true;
            }
        }

        return false;
    }

    /** Set status of message editing
     * @param {boolean} status - Status on if message is edited or not
     */
    setIsEditing(status: boolean) {
        this.isEditing = status;
    }

    /** Saves current message.
     * Checks also if message was changed. Flags message as edited if message was changed and saved
     * @param {string} msg - Message in textarea
     */

    setAuditedMessage(msg: string) {
        let auditedMessage = new Audit({
            oldValue: this.message.message!,
            newValue: msg,
            auditMessageId: this.message.id ?? -1,
            auditChangedById: this.socket.currentUser.id ?? -1,
        });
        return auditedMessage;
    }

    saveMessage(msg: string) {
        //Goes into here if message was changed
        if (msg != this.message.message) {
            let auditedMessage = this.setAuditedMessage(msg);
            this.message.message = msg;

            // ***********************   MESSAGE TO BACKEND DEVS   ****************************************************
            // This area is where a message is saved, so you most likely would want to update the DB below this comment block
            // ********************************************************************************************************
            // -> This will have DB operations executed on the socketService, not in the View component
            this.socket.editMessage(this.message, auditedMessage);
        }

        this.setIsEditing(false); //Stop editing as we are finished
    }

    /** Adjusts a text area to be the height of its text.
     * Mainly used to modify textbox for editing a message
     * @param {HTMLElement} element - HTMLElement reference to textarea
     */
    textAreaAdjust(element: HTMLElement) {
        element.style.height = element.scrollHeight + 'px';
    }

    // Ionic Popover
    // https://ionicframework.com/docs/api/popover
    public async popclick(event: any, btn: HTMLElement) {
        btn.style.pointerEvents = 'none'; //Prevent popClick to be clicked multiple times
        const popover = await this.popoverController.create({
            //Create popover
            component: MsgPopoverComponent,
            componentProps: { message: this.message },
            event: event,
            translucent: true,
        });

        await popover.present(); //Pause until popover fully shown
        btn.style.pointerEvents = 'auto'; //Revert popClick to be clickable

        const { data } = await popover.onDidDismiss(); //Wait until Popover is closed
        this.handlePopoverClose(data); //Handle action done after popover is fully closed
    }

    /** Handles action returned on when a popover is closed
     * @param {PopoverActions} action - Specifies the action to be taken. Enum of type PopoverActions.
     */
    private handlePopoverClose(action: PopoverActions) {
        switch (action) {
            // Edit message popover was clicked
            case PopoverActions.edit:
                this.setIsEditing(true);
                setTimeout(() => {
                    //setTimeout to allow Angular change detection to run first
                    this.textAreaAdjust(this.editMsgTextArea.nativeElement); //Readjust text area to
                    this.editMsgTextArea.nativeElement.focus();
                });
                break;

            // Delete message popover was clicked
            case PopoverActions.delete:
                this.deleteMessage();
                break;

            default:
                // Unknown action or nothing was taken
                break;
        }
    }

    /** Deletes message and sets wasDeleted flag to true  */
    private deleteMessage() {
        let auditedMessage = this.setAuditedMessage('');
        // ***********************   MESSAGE TO BACKEND DEVS   ****************************************************
        // This area is where a message is deleted, so you most likely would want to update the DB below this comment block
        // ********************************************************************************************************
        this.socket.deleteMessage(this.message, auditedMessage);
    }
}

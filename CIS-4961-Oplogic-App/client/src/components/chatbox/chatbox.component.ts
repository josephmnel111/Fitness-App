import {
    Component,
    ElementRef,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    Channel,
    Message,
    User,
    FileData,
} from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';
import { AttachmentPopoverComponent } from './attachment-popover/attachment-popover.component';
import { PopoverController } from '@ionic/angular';
import { ChannelToolsPopoverComponent } from './channel-tools-popover/channel-tools-popover.component';
import { UserToolsPopoverComponent } from '../user-tools-popover/user-tools-popover.component';

export enum PopoverActions {
    AddPicture,
    AddDoc,
}

const pluralizeThreshold = 2;

@Component({
    selector: 'chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent implements OnInit {
    @Output() numChannelMembers!: number;
    @Output() channelName: string = '';

    @ViewChild('pictureInput')
    pictureInput!: ElementRef; //Reference to picture input

    @ViewChild('docInput')
    docInput!: ElementRef; //Reference to document input

    public files: { [key: string]: File } = {}; //Dictionary of files currently in the chatbox

    public displayChat: boolean = true;

    public displayOptions: boolean = false;

    public tempOptions: User[] = [];
    public curTag: string = '';
    public caretPosition = -1;
    public taggedVals: User[] = [];
    public preTagText: string = '';

    constructor(
        public popoverController: PopoverController,
        public socket: SocketService
    ) {}

    ngOnInit() {
        this.socket.receiveAutoTag.subscribe(async ([Channel, User]) => {
            if (this.displayOptions == true) {
                let userVals = [];
                for (let i = 0; i < User.length; ++i) {
                    if (User[i].id == this.socket.currentUser.id) {
                    } else {
                        userVals.push(User[i]);
                    }
                }
                this.autoComplete(userVals);
            }
        });

        this.socket.receiveUsersInChannel.subscribe(([channel, users]) => {
            this.syncChannelInfo(channel);
        });

        this.socket.currentChannelUpdates.subscribe((curChannel) => {
            this.syncChannelInfo(curChannel);
        });

        this.socket.userAddedToChannel.subscribe((m) => {
            this.syncChannelInfo(this.socket.currentChannel);
        });

        this.socket.userRemovedFromChannel.subscribe((m) => {
            this.syncChannelInfo(this.socket.currentChannel);
        });
    }

    private syncChannelInfo(channel: Channel): boolean {
        if (this.socket.currentChannel != undefined) {
            if (
                channel &&
                channel.id &&
                this.socket.currentChannel &&
                channel.id == this.socket.currentChannel.id
            ) {
                let channelMembers = this.socket.channelUsers.get(channel.id);
                if (!channelMembers) {
                    return false;
                }

                this.numChannelMembers = channelMembers.length;

                if (channel.isDirectMessage) {
                    let pluralized = '';
                    let memberNames = channelMembers
                        .filter((u) => u.id != this.socket.currentUser.id)
                        .map((u) => u.fullName);

                    if (memberNames.length > pluralizeThreshold) {
                        let count = memberNames.length - pluralizeThreshold;
                        pluralized = `, ${count} other${count == 1 ? '' : 's'}`;

                        this.channelName =
                            memberNames.slice(0, 2).join(', ') + pluralized;
                    } else {
                        this.channelName = memberNames.join(', ');
                    }
                } else {
                    this.channelName = channel.name ?? '';
                }

                return true;
            }
        }

        return false;
    }

    // Handles creation of popover for showing attachment buttons
    public async presentAttachmentPopover(event: any) {
        const popover = await this.popoverController.create({
            //Create popover
            component: AttachmentPopoverComponent, //Name of component
            event: event,
            size: 'cover', //Width of trigger clicked (in this case the attachment paperclip icon)
            align: 'center', //Center popover over icon
            showBackdrop: false, //No background over entire screen
        });
        await popover.present(); //Pause until popover fully shown

        const { data } = await popover.onDidDismiss(); //Wait until Popover is closed
        this.handleAttachPopClose(data);
    }

    /** Handles action returned on when a popover is closed
     * @param {PopoverActions} action - Specifies the action to be taken. Enum of type PopoverActions.
     */
    private handleAttachPopClose(action: PopoverActions) {
        switch (action) {
            case PopoverActions.AddPicture:
                this.pictureInput.nativeElement.click();
                break;

            case PopoverActions.AddDoc:
                this.docInput.nativeElement.click();
                break;

            default:
                // Unknown action or nothing was taken
                break;
        }
    }

    /** Handles action returned on when a popover is closed
     * @param {event} e - Event when adding a file
     */
    onSelectedFile(e: any) {
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                this.files[e.target.files[i].name] = e.target.files[i];
            }
        }
    }

    isEmptyFileDict() {
        return Object.keys(this.files).length === 0;
    }

    /** Removes a file from the dictionary of files
     * @param {string} fileName - File name to be removed from the dictionary of files
     */
    removeFile(fileName: string) {
        if (this.files.hasOwnProperty(fileName)) delete this.files[fileName];
        else console.log("This shouldn't have happened");
    }

    autoComplete(data: User[]) {
        //Creates list of tag options based off input
        this.tempOptions = [];
        let val = this.curTag;
        for (let i = 0; i < data.length; ++i) {
            if (
                '@' +
                    data[i]
                        .displayName!.slice(0, val.length - 1)
                        .toUpperCase() ==
                val.toUpperCase()
            ) {
                this.tempOptions.push(data[i]);
                if (
                    '@' + data[i].displayName!.toUpperCase() ==
                    val.toUpperCase()
                ) {
                    this.setTag(data[i]);
                }
            }
        }
    }

    setTag(data: User) {
        this.tempOptions = [];
        var doc = <HTMLInputElement>(
            document.getElementsByClassName('form-control')[0]
        );
        let subVal = this.curTag.length; //For length of current tag input plus @ symbol
        let beforeVal = doc.innerHTML.substring(0, this.caretPosition - subVal); //Don't include the already made tag value
        let afterVal = doc.innerHTML.substring(
            this.caretPosition,
            doc.innerHTML.length
        );
        let insertionVal =
            '<mark style="background: none; color: cornflowerblue">' +
            '@' +
            data.displayName +
            `</mark>` +
            '&nbsp;';
        doc.innerHTML = beforeVal + insertionVal;
        doc.innerHTML = doc.innerHTML + afterVal;
        this.preTagText = doc.innerHTML;
        this.curTag = '';
        this.taggedVals.push(data);
        this.caretPosition = this.getCaretPosition(doc);
        this.setCaretPosition(doc);
    }

    Enter(doc: any) {
        this.sendMsg(doc);
        this.tempOptions = [];
        this.curTag = '';
        doc.innerHTML = '';
    }

    getInputTags(element: any) {
        let insert =
            `<mark style="background: none; color: cornflowerblue">` +
            `@` +
            element.displayName +
            '</mark>&nbsp;';
        const reg = new RegExp(insert, 'g');
        const array = [...this.preTagText.matchAll(reg)];
        return array;
    }

    Delete(doc: any, event: any) {
        this.curTag = this.curTag.substring(0, this.curTag.length);
        let found = false;
        let tracker = 0;
        if (this.curTag != '') {
            this.curTag = this.curTag.substring(0, this.curTag.length - 1);
        }
        if (this.curTag == '') {
            this.tempOptions = [];
        } else {
        }
        this.taggedVals.forEach((element) => {
            let array = this.getInputTags(element);
            array.forEach((arrayEle) => {
                if (
                    arrayEle.index! <= this.caretPosition &&
                    arrayEle.index! + arrayEle[0].length + 1 >=
                        this.caretPosition &&
                    found == false
                ) {
                    event.preventDefault();
                    found = true;
                    doc.innerHTML =
                        doc.innerHTML.substring(0, arrayEle.index!) +
                        doc.innerHTML.substring(
                            arrayEle.index! + arrayEle[0].length,
                            doc.innerHTML.length
                        );
                    this.taggedVals.splice(tracker, 1);
                    this.preTagText = doc.innerHTML;
                    if (doc.innerHTML != '') {
                        this.setCaretPosition(doc);
                    }
                }
            });
            ++tracker;
        });
    }

    handleTags(key: string) {
        this.displayOptions = true;
        if (key == '@') {
            //Keycode for @
            this.curTag = '@';
            this.socket.requestAutoTag(this.socket.currentChannel);
        } else {
            if (key.length == 1) {
                //Prevents values like Shift from being added to variable
                this.curTag += key;
                this.socket.requestAutoTag(this.socket.currentChannel);
            }
        }
    }

    regularText(event: any) {
        this.taggedVals.forEach((element) => {
            let array = this.getInputTags(element);
            array.forEach((arrayEle) => {
                if (
                    arrayEle.index! <= this.caretPosition &&
                    arrayEle.index! + arrayEle[0].length >= this.caretPosition
                ) {
                    event.preventDefault();
                }
            });
        });
        this.tempOptions = [];
    }

    getCaretPosition(doc: any) {
        var target = document.createTextNode('\u0001');
        document.getSelection()!.getRangeAt(0).insertNode(target);
        var position = doc.innerHTML.indexOf('\u0001');
        target.parentNode!.removeChild(target);
        if (doc.innerHTML.substring(position - 6, position) == '&nbsp;') {
            //eliminates nbsp from counting on space
            position = position - 6;
        }
        return position;
    }

    setCaretPosition(doc: any) {
        doc.focus();
        var range = document.createRange();
        var sel = window.getSelection();
        if (doc.childNodes.length != 0) {
            //If input box is not empty
            range.setStart(
                doc.childNodes[doc.childNodes.length - 1],
                doc.childNodes[doc.childNodes.length - 1].length
            );
        } else {
            //If input box is empty
            range.setStart(doc.childNodes[0], 0);
        }
        range.collapse(true);

        sel!.removeAllRanges();
        sel!.addRange(range);
    }

    handleInput(event: any) {
        let doc = <HTMLElement>(
            document.getElementsByClassName('form-control')[0]
        );
        this.caretPosition = this.getCaretPosition(doc);
        if (event.key == 'Enter') {
            //KeyCode for ENTER
            event.preventDefault();
            this.Enter(doc);
        } else if (event.key == 'Backspace' || event.key == 'Delete') {
            //Keycode for backspace
            this.Delete(doc, event);
        } else if (event.key == '@' || this.tempOptions.length > 0) {
            //KeyCode for @ or if options are supposed to be displayed
            this.handleTags(event.key);
        } else {
            //If normal text
            this.regularText(event);
        }
    }

    handleAtSymbol() {
        let doc = <HTMLElement>(
            document.getElementsByClassName('form-control')[0]
        );
        this.caretPosition = this.getCaretPosition(doc);
        let beforeVal = doc.innerHTML.substring(0, this.caretPosition);
        let afterVal = doc.innerHTML.substring(
            this.caretPosition,
            doc.innerHTML.length
        );
        doc.innerHTML = beforeVal + '@' + afterVal;
        this.handleTags('@');
        this.setCaretPosition(doc);
        this.caretPosition = this.getCaretPosition(doc);
    }

    sendMsg(textInput: HTMLElement) {
        //Grabs text from user and sends message
        let message = new Message({
            message: textInput.innerText,
            messageChannelId: this.socket.currentChannel.id ?? -1,
            messageSenderId: this.socket.currentUser.id ?? -1,
        });
        let filesData: FileData[] = [];
        Object.keys(this.files).forEach((k) => {
            let file = new FileData({
                fileDataChannelId: this.socket.currentChannel.id ?? -1,
                fileDataSenderId: this.socket.currentUser.id ?? -1,
                name: this.files[k].name,
                type: this.files[k].type,
                data: this.files[k],
            });
            filesData.push(file);
        });

        this.socket.sendMessage(message, filesData);
        this.files = {};
        this.socket.sendNotification(
            this.taggedVals,
            this.socket.currentChannel,
            this.socket.currentUser
        );
        this.taggedVals = [];
        textInput.innerHTML = '';
    }

    async presentChannelToolsPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: ChannelToolsPopoverComponent,
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true,
            showBackdrop: false,
        });
        await popover.present();

        const { role } = await popover.onDidDismiss();
    }

    async presentUserToolsPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: UserToolsPopoverComponent,
            // cssClass: 'my-custom-class',
            event: ev,
            translucent: true,
            showBackdrop: false,
            side: 'start',
        });
        await popover.present();

        const { role } = await popover.onDidDismiss();
    }
}
